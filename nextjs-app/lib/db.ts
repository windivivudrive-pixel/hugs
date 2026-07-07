import mysql from 'mysql2/promise';
import { Client } from 'ssh2';
import net from 'net';
import fs from 'fs';
import path from 'path';

let pool: mysql.Pool | null = null;
let tunnelReady = false;
const localProxyPort = 3307;

/**
 * Create TCP server proxy over SSH tunnel
 */
async function createSSHTunnel(): Promise<number> {
    if (tunnelReady) return localProxyPort;

    const sshHost = process.env.SSH_HOST;
    const sshPassword = process.env.SSH_PASSWORD;
    const sshPrivateKeyPath = process.env.SSH_PRIVATE_KEY_PATH;
    const sshPrivateKeyContent = process.env.SSH_PRIVATE_KEY;
    const sshPassphrase = process.env.SSH_PASSPHRASE;

    if (!sshHost || (!sshPassword && !sshPrivateKeyPath && !sshPrivateKeyContent)) {
        return parseInt(process.env.DB_PORT || '3306');
    }

    return new Promise((resolve, reject) => {
        const ssh = new Client();
        
        ssh.on('ready', () => {
            const server = net.createServer((sock) => {
                ssh.forwardOut(
                    '127.0.0.1',
                    sock.remotePort || 0,
                    process.env.DB_HOST || '127.0.0.1',
                    parseInt(process.env.DB_PORT || '3306'),
                    (err, stream) => {
                        if (err) {
                            sock.end();
                            return;
                        }
                        sock.pipe(stream).pipe(sock);
                    }
                );
            });

            server.on('error', (err: { code?: string }) => {
                if (err.code === 'EADDRINUSE') {
                    // Port already in use — another module already created the tunnel
                    tunnelReady = true;
                    resolve(localProxyPort);
                } else {
                    reject(err);
                }
            });
            
            // start listening on an ephemeral port or a fixed port
            server.listen(localProxyPort, '127.0.0.1', () => {
                tunnelReady = true;
                resolve(localProxyPort);
            });
        });

        ssh.on('error', reject);

        interface SSHConnectConfig {
            host: string;
            port: number;
            username: string;
            readyTimeout: number;
            privateKey?: string | Buffer;
            passphrase?: string;
            password?: string;
        }

        const connectConfig: SSHConnectConfig = {
            host: sshHost,
            port: parseInt(process.env.SSH_PORT || '22'),
            username: process.env.SSH_USER || 'root',
            readyTimeout: 3000, // Reduced to 3s so Vercel doesn't hit 10s timeout if SSH hangs
        };

        if (sshPrivateKeyContent) {
            connectConfig.privateKey = sshPrivateKeyContent;
            if (sshPassphrase) {
                connectConfig.passphrase = sshPassphrase;
            }
        } else if (sshPrivateKeyPath) {
            try {
                // Handle both absolute and relative paths
                const absolutePath = path.isAbsolute(sshPrivateKeyPath) 
                    ? sshPrivateKeyPath 
                    : path.resolve(process.cwd(), sshPrivateKeyPath);
                
                if (fs.existsSync(absolutePath)) {
                    connectConfig.privateKey = fs.readFileSync(absolutePath);
                    if (sshPassphrase) {
                        connectConfig.passphrase = sshPassphrase;
                    }
                } else {
                    console.warn(`SSH Private Key not found at ${absolutePath}. Falling back to other auth methods.`);
                }
            } catch (err) {
                console.error(`Error reading SSH Private Key at ${sshPrivateKeyPath}:`, err);
            }
        }

        if (sshPassword && !connectConfig.privateKey) {
            connectConfig.password = sshPassword;
        }

        ssh.connect(connectConfig);
    });
}

/**
 * Get MySQL connection pool.
 */
export async function getDB(): Promise<mysql.Pool> {
    if (pool) return pool;

    const sshHost = process.env.SSH_HOST;

    if (sshHost) {
        console.log('Establishing database connection via SSH tunnel...');
        try {
            const port = await createSSHTunnel();
            pool = mysql.createPool({
                host: '127.0.0.1',
                port: port,
                user: process.env.DB_USER || '',
                password: process.env.DB_PASSWORD || '',
                database: process.env.DB_NAME || '',
                waitForConnections: true,
                connectionLimit: 5,
                queueLimit: 0,
                connectTimeout: 10000, // 10s timeout
            });
            console.log('SSH tunnel and DB pool created successfully.');
        } catch (error) {
            console.error('Failed to create SSH tunnel:', error);
            throw error;
        }
    } else {
        // Direct connection
        console.log('Connecting directly to database...');
        pool = mysql.createPool({
            host: process.env.DB_HOST || '127.0.0.1',
            port: parseInt(process.env.DB_PORT || '3306'),
            user: process.env.DB_USER || '',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || '',
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0,
            connectTimeout: 10000, // 10s timeout
        });
    }

    return pool;
}

/**
 * Execute a SQL query
 */
export async function query<T = Record<string, unknown>>(
    sql: string,
    params?: (string | number | boolean | null)[]
): Promise<T[]> {
    const db = await getDB();
    const [rows] = await db.execute(sql, params);
    return rows as T[];
}
