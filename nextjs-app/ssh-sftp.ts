import { Client } from 'ssh2';
import * as fs from 'fs';

const conn = new Client();
conn.on('ready', () => {
    conn.sftp((err, sftp) => {
        if (err) throw err;
        sftp.fastGet('/var/www/html/hugs.agency/wp-content/themes/agency/resources/functions.php', 'functions.php', (err) => {
            if (err) throw err;
            console.log('File downloaded successfully.');
            conn.end();
        });
    });
}).connect({
    host: '139.180.131.18',
    port: 22,
    username: 'root',
    password: 'e=3UB%qq9Xc?yr4.',
});
