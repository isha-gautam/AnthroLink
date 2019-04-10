// JavaScript source code
var express = require('express');
var app = express();

app.use('/static', express.static('views/js'));
app.listen(8080);
