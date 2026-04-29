import mysql from 'mysql2/promise';
import { Client } from 'ssh2';
import net from 'net';

let pool: mysql.Pool | null = null;
let tunnelReady = false;
let localProxyPort = 3307;

/**
 * Create TCP server proxy over SSH tunnel
 */
async function createSSHTunnel(): Promise<number> {
    if (tunnelReady) return localProxyPort;

    const sshHost = process.env.SSH_HOST;
    const sshPassword = process.env.SSH_PASSWORD;

    if (!sshHost || !sshPassword) {
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

            server.on('error', (err: any) => {
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

        ssh.connect({
            host: sshHost,
            port: parseInt(process.env.SSH_PORT || '22'),
            username: process.env.SSH_USER || 'root',
            password: sshPassword,
            readyTimeout: 10000, // 10s timeout
        });
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
