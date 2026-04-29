import { Client } from 'ssh2';

const conn = new Client();
conn.on('ready', () => {
    console.log('Client :: ready');
    conn.exec(process.argv[2], (err, stream) => {
        if (err) throw err;
        stream.on('close', (code: any, signal: any) => {
            conn.end();
        }).on('data', (data: any) => {
            console.log(data.toString());
        }).stderr.on('data', (data: any) => {
            console.error(data.toString());
        });
    });
}).connect({
    host: '139.180.131.18',
    port: 22,
    username: 'root',
    password: 'e=3UB%qq9Xc?yr4.',
});
