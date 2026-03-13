const { createConnection } = require('mysql2/promise');
require('dotenv').config({ path: '.env.local' });

async function run() {
  const db = await createConnection({
    host: process.env.MYSQL_HOST,
    port: Number(process.env.MYSQL_PORT),
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
  });

  const [rows] = await db.query(`
     SELECT p.ID, p.post_title, 
            (SELECT t.name FROM wp_term_relationships tr
             INNER JOIN wp_term_taxonomy tt ON tr.term_taxonomy_id = tt.term_taxonomy_id AND tt.taxonomy = 'category'
             INNER JOIN wp_terms t ON tt.term_id = t.term_id
             WHERE tr.object_id = p.ID LIMIT 1) AS cat_name
     FROM wp_posts p
     WHERE p.post_type = 'post' 
       AND p.post_status = 'publish'
     ORDER BY p.post_date DESC
  `);
  console.log("Total posts:", rows.length);
  const categories = {};
  for (const row of rows) {
    const cat = row.cat_name || 'Uncategorized';
    categories[cat] = (categories[cat] || 0) + 1;
  }
  console.log(categories);
  await db.end();
}
run();
