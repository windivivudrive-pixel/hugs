import { Client, Channel } from 'ssh2';
import mysql from 'mysql2/promise';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function testQuery() {
    const ssh = new Client();

    console.log(`Connecting to SSH: ${process.env.SSH_HOST}...`);
    
    await new Promise<void>((resolve, reject) => {
        ssh.on('ready', () => { resolve(); });
        ssh.on('error', (err) => {
            console.error('SSH Error Details:', err);
            reject(err);
        });
        ssh.connect({
            host: process.env.SSH_HOST,
            port: parseInt(process.env.SSH_PORT || '22'),
            username: process.env.SSH_USER || 'root',
            password: process.env.SSH_PASSWORD,
            readyTimeout: 20000,
        });
    });
    console.log('SSH Connected!');

    const stream: Channel = await new Promise((resolve, reject) => {
        ssh.forwardOut('127.0.0.1', 0, '127.0.0.1', 3306, (err, stream) => {
            if (err) reject(err);
            else resolve(stream);
        });
    });

    console.log(`Connecting to MySQL: ${process.env.DB_NAME}...`);
    const conn = await mysql.createConnection({
        host: '127.0.0.1',
        port: 3306,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        stream: stream,
    });
    console.log('MySQL Connected!');

    const [rows] = await conn.execute(
        `SELECT p.ID, p.post_title, p.post_date
         FROM wp_posts p
         WHERE p.post_type = 'post' 
           AND p.post_status = 'publish'
         ORDER BY p.post_date DESC
         LIMIT 5`
    );

    console.log(`\n=== Got ${(rows as any[]).length} posts ===`);
    for (const row of rows as any[]) {
        console.log(`  - ${row.post_title}`);
    }

    await conn.end();
    ssh.end();
    console.log('\nDone!');
}

testQuery().catch(err => {
    console.error('Test Failed:', err);
    process.exit(1);
});
