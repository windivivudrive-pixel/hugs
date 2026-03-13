import { Client, Channel } from 'ssh2';
import mysql from 'mysql2/promise';

async function testQuery() {
    const ssh = new Client();

    await new Promise<void>((resolve, reject) => {
        ssh.on('ready', () => { resolve(); });
        ssh.on('error', reject);
        ssh.connect({
            host: '139.180.131.18',
            port: 22,
            username: 'root',
            password: 'e=3UB%qq9Xc?yr4.',
        });
    });
    console.log('SSH Connected!');

    const stream: Channel = await new Promise((resolve, reject) => {
        ssh.forwardOut('127.0.0.1', 0, '127.0.0.1', 3306, (err, stream) => {
            if (err) reject(err);
            else resolve(stream);
        });
    });

    const conn = await mysql.createConnection({
        host: '127.0.0.1',
        port: 3306,
        user: 'agenncy',
        password: 'agenncy@123!',
        database: 'agenncy',
        stream: stream,
    });
    console.log('MySQL Connected!');

    // Test the fixed query (with subqueries instead of GROUP BY)
    const [rows] = await conn.execute(
        `SELECT p.ID, p.post_title, p.post_date,
            (SELECT t.name FROM wp_term_relationships tr
             INNER JOIN wp_term_taxonomy tt ON tr.term_taxonomy_id = tt.term_taxonomy_id AND tt.taxonomy = 'category'
             INNER JOIN wp_terms t ON tt.term_id = t.term_id
             WHERE tr.object_id = p.ID LIMIT 1) AS cat_name
         FROM wp_posts p
         WHERE p.post_type = 'post' 
           AND p.post_status = 'publish'
         ORDER BY p.post_date DESC
         LIMIT 20 OFFSET 0`
    );

    console.log(`\n=== Got ${(rows as any[]).length} posts ===`);
    for (const row of rows as any[]) {
        console.log(`  [${row.cat_name}] ${row.post_title}`);
    }

    // Count all
    const [countRows] = await conn.execute(
        `SELECT COUNT(*) as total FROM wp_posts WHERE post_type = 'post' AND post_status = 'publish'`
    );
    console.log(`\nTotal published posts: ${(countRows as any[])[0].total}`);

    // Category breakdown
    const [catRows] = await conn.execute(
        `SELECT 
            (SELECT t.name FROM wp_term_relationships tr
             INNER JOIN wp_term_taxonomy tt ON tr.term_taxonomy_id = tt.term_taxonomy_id AND tt.taxonomy = 'category'
             INNER JOIN wp_terms t ON tt.term_id = t.term_id
             WHERE tr.object_id = p.ID LIMIT 1) AS cat_name,
            COUNT(*) as cnt
         FROM wp_posts p
         WHERE p.post_type = 'post' AND p.post_status = 'publish'
         GROUP BY cat_name
         ORDER BY cnt DESC`
    );
    console.log('\n=== Category Breakdown ===');
    for (const row of catRows as any[]) {
        console.log(`  ${row.cat_name}: ${row.cnt} posts`);
    }

    await conn.end();
    ssh.end();
    console.log('\nDone!');
}

testQuery().catch(console.error);
