import { Client } from 'ssh2';
import * as fs from 'fs';

const conn = new Client();
conn.on('ready', () => {
    conn.sftp((err, sftp) => {
        if (err) throw err;
        
        let completed = 0;
        const total = 2;
        
        function checkDone() {
            completed++;
            if (completed === total) {
                console.log('All files uploaded successfully.');
                conn.end();
            }
        }

        sftp.fastPut('api-projects.php', '/var/www/html/hugs.agency/api-projects.php', (err) => {
            if (err) throw err;
            console.log('api-projects.php uploaded.');
            checkDone();
        });

        sftp.fastPut('industry-taxonomy.php', '/var/www/html/hugs.agency/wp-content/mu-plugins/industry-taxonomy.php', (err) => {
            if (err) throw err;
            console.log('industry-taxonomy.php uploaded.');
            checkDone();
        });
    });
}).connect({
    host: '139.180.131.18',
    port: 22,
    username: 'root',
    password: 'e=3UB%qq9Xc?yr4.',
});
