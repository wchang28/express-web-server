var http = require('http');
var https = require('https');
var fs = require('fs');
function startServer(webServerConfig, app, done, errorCallback) {
    var server = null;
    var wsConfig = null;
    if (webServerConfig.https) {
        wsConfig = webServerConfig.https;
        var httpsConfig = webServerConfig.https;
        var sslConfig = httpsConfig.ssl;
        var private_key_file = sslConfig.private_key_file;
        var certificate_file = sslConfig.certificate_file;
        var ca_files = sslConfig.ca_files;
        var privateKey = fs.readFileSync(private_key_file, 'utf8');
        var certificate = fs.readFileSync(certificate_file, 'utf8');
        var credentials = { key: privateKey, cert: certificate };
        if (ca_files && ca_files.length > 0) {
            var ca = [];
            for (var i in ca_files)
                ca.push(fs.readFileSync(ca_files[i], 'utf8'));
            credentials.ca = ca;
        }
        server = https.createServer(credentials, app);
    }
    else {
        wsConfig = webServerConfig.http;
        server = http.createServer(app);
    }
    var port = (wsConfig.port ? wsConfig.port : (webServerConfig.https ? 443 : 80));
    var host = (wsConfig.host ? wsConfig.host : "0.0.0.0");
    server.on('error', function (err) {
        if (typeof errorCallback === 'function')
            errorCallback(err);
    });
    server.listen(port, host, function () {
        var host = server.address().address;
        var port = server.address().port;
        if (typeof done === 'function')
            done((webServerConfig.https ? true : false), host, port);
    });
}
exports.startServer = startServer;
