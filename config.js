var fs = require('fs');
module.exports = {
    https: {
      key: fs.readFileSync('private_key.pem'),
      cert: fs.readFileSync('cert.pem')
    }
}
