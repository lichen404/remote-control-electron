function getIPAddress() {
    const interfaces = require('os').networkInterfaces();
    for (let devName in interfaces) {
        let iFace = interfaces[devName];
        for (let i = 0; i < iFace.length; i++) {
            let alias = iFace[i];
            if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
                return alias.address;
            }
        }
    }
}
module.exports = {getIPAddress}
