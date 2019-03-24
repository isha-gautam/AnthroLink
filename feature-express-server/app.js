// JavaScript source code
var express = require('express');
var app = express();

var PORT = process.env.PORT || 4119;

app.get('/',function(req,res){
    res.send('Hello World');
});

app.listen(PORT, () => {
    console.log('Listening to port ' + PORT);
});
