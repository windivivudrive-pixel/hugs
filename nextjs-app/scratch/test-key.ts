import { Client, Channel } from 'ssh2';
import mysql from 'mysql2/promise';
import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';

// Load .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function testKeyConnection() {
    const ssh = new Client();
    const keyPath = process.env.SSH_PRIVATE_KEY_PATH || '';

    console.log(`Testing SSH Key connection to: ${process.env.SSH_HOST}...`);
    console.log(`Using Key: ${keyPath}`);
    
    await new Promise<void>((resolve, reject) => {
        ssh.on('ready', () => { resolve(); });
        ssh.on('error', (err) => {
            console.error('SSH Error:', err);
            reject(err);
        });
        
        try {
            ssh.connect({
                host: process.env.SSH_HOST,
                port: parseInt(process.env.SSH_PORT || '22'),
                username: process.env.SSH_USER || 'root',
                privateKey: fs.readFileSync(keyPath),
                passphrase: process.env.SSH_PASSPHRASE,
                readyTimeout: 20000,
            });
        } catch (e) {
            reject(e);
        }
    });
    console.log('SSH Key Connected successfully!');

    const stream: Channel = await new Promise((resolve, reject) => {
        ssh.forwardOut('127.0.0.1', 0, '127.0.0.1', 3306, (err, stream) => {
            if (err) reject(err);
            else resolve(stream);
        });
    });

    const conn = await mysql.createConnection({
        host: '127.0.0.1',
        port: 3306,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        stream: stream,
    });
    console.log('MySQL Connected over Key-based SSH Tunnel!');

    const [rows] = await conn.execute('SELECT 1 + 1 AS result');
    console.log('Query Result:', (rows as any[])[0].result);

    await conn.end();
    ssh.end();
    console.log('All tests passed with SSH Key!');
}

testKeyConnection().catch(err => {
    console.error('Key Connection Test Failed:', err);
    process.exit(1);
});
