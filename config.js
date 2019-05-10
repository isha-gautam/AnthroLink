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
    port: '27017'
  },

  GoogleApi: {
    client_Id: '594743792021-tvffn11n961cqea8mbufm9gnts372m0n.apps.googleusercontent.com',
    client_Secret: 'N37STg-MvMS36GRneYLud2Jr'
  }
}
