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

    const newMainConfig = `server {
    server_name admin.hugs.agency www.admin.hugs.agency;

    access_log /var/log/nginx/admin.hugs.agency.access.log rt_cache;
    error_log /var/log/nginx/admin.hugs.agency.error.log;

    root /var/www/admin.hugs.agency/htdocs;

    index index.php index.html index.htm;

    include common/php83.conf;
    include common/wpcommon-php83.conf;
    include common/locations-wo.conf;
    include /var/www/admin.hugs.agency/conf/nginx/*.conf;
}`;

    const newSslConfig = `# display http version used in header (optional)
more_set_headers "X-protocol : $server_protocol always";

# Advertise HTTP/3 QUIC support (required)
more_set_headers 'Alt-Svc h3=":$server_port"; ma=86400';

# enable QUIC address validation
quic_retry on;

# Listen on port 443 with HTTP/3 QUIC
listen 443 quic;
listen [::]:443 quic;

# listen on port 443 with HTTP/2
listen 443 ssl http2;
listen [::]:443 ssl http2;
ssl_certificate     /etc/letsencrypt/live/admin.hugs.agency/fullchain.pem;
ssl_certificate_key     /etc/letsencrypt/live/admin.hugs.agency/key.pem;
ssl_trusted_certificate /etc/letsencrypt/live/admin.hugs.agency/ca.pem;
ssl_stapling_verify on;`;

    const mainB64 = Buffer.from(newMainConfig).toString('base64');
    const sslB64 = Buffer.from(newSslConfig).toString('base64');

    const cmd = `echo "${mainB64}" | base64 -d > /etc/nginx/sites-available/admin.hugs.agency && echo "${sslB64}" | base64 -d > /var/www/admin.hugs.agency/conf/nginx/ssl.conf && nginx -t && systemctl reload nginx`;

    ssh.exec(cmd, (err, stream) => {
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
