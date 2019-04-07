var fs = require('fs');
module.exports = {
    https: {
      key: fs.readFileSync('private_key.pem'),
      cert: fs.readFileSync('cert.pem')
    },

    db: {
      type: 'mongo',
      name: 'AnthroLinkDB',
      host: 'localhost',
      username: 'AnthroAdmin',
      password: 'password',
      port:     27017,
      err: 'Wrong url'
    }

}
