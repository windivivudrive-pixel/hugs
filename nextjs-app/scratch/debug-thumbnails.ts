import mysql from 'mysql2/promise';
import { Client, Channel } from 'ssh2';
import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function debugThumbnails() {
    const ssh = new Client();
    await new Promise<void>((resolve, reject) => {
        ssh.on('ready', resolve);
        ssh.on('error', reject);
        ssh.connect({
            host: process.env.SSH_HOST,
            port: 22,
            username: process.env.SSH_USER,
            privateKey: fs.readFileSync(process.env.SSH_PRIVATE_KEY_PATH || ''),
            passphrase: process.env.SSH_PASSPHRASE,
        });
    });

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

    console.log('--- Post Meta for Featured Images ---');
    const [rows] = await conn.execute(`
        SELECT p.ID, p.post_title, pm.meta_value as thumbnail_id, pm2.meta_value as file_path
        FROM wp_posts p
        LEFT JOIN wp_postmeta pm ON p.ID = pm.post_id AND pm.meta_key = '_thumbnail_id'
        LEFT JOIN wp_postmeta pm2 ON pm.meta_value = pm2.post_id AND pm2.meta_key = '_wp_attached_file'
        WHERE p.post_type = 'post' AND p.post_status = 'publish'
        LIMIT 3
    `);

    console.log(JSON.stringify(rows, null, 2));

    await conn.end();
    ssh.end();
}

debugThumbnails().catch(console.error);
