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
      password: 'password',
      port:     27017,
      url:      '"mongodb://localhost:27017/AnthroLinkDB',
      username: 'AnthroAdmin',
    }

}
