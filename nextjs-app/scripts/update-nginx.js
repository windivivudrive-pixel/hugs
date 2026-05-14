const { Client } = require('ssh2');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.resolve(process.cwd(), '.env.local') });

async function run() {
    const ssh = new Client();
    await new Promise((res, rej) => {
        ssh.on('ready', res);
        ssh.on('error', rej);
        ssh.connect({
            host: process.env.SSH_HOST,
            username: process.env.SSH_USER,
            privateKey: fs.readFileSync(process.env.SSH_PRIVATE_KEY_PATH),
            passphrase: process.env.SSH_PASSPHRASE,
        });
    });

    const newConfig = `server {
    listen 80;
    listen [::]:80;
    server_name admin.hugs.agency www.admin.hugs.agency;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name admin.hugs.agency www.admin.hugs.agency;

    ssl_certificate /etc/letsencrypt/live/admin.hugs.agency/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/admin.hugs.agency/key.pem;

    access_log /var/log/nginx/admin.hugs.agency.access.log rt_cache;
    error_log /var/log/nginx/admin.hugs.agency.error.log;

    root /var/www/admin.hugs.agency/htdocs;
    index index.php index.html index.htm;

    include common/php83.conf;
    include common/wpcommon-php83.conf;
    include common/locations-wo.conf;
    include /var/www/admin.hugs.agency/conf/nginx/*.conf;
}`;

    const b64 = Buffer.from(newConfig).toString('base64');

    ssh.exec(`echo "${b64}" | base64 -d > /etc/nginx/sites-available/admin.hugs.agency && nginx -t && systemctl reload nginx`, (err, stream) => {
        if (err) throw err;
        let output = '';
        stream.on('data', (data) => output += data).on('close', () => {
            console.log(output);
            ssh.end();
        });
        stream.stderr.on('data', (data) => console.error(data.toString()));
    });
}
run().catch(console.error);
