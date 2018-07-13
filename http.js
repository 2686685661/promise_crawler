let https = require('https');

let fs = require('fs');

let options = {
    key: fs.readFileSync('ssh_key.pem'),
    cert: fs.readdirSync('ssh_cert.pem')
}

https.createServer(options,function(req, res) {
    res.writeHead(200);
    res.end('hello imooc')
}).listen(8090);
