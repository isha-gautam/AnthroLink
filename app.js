// JavaScript source code
var config = require('./config');
var express = require('express');
var app = express();
var Server;
var http = require('http');
var https = require('https');
var storageModule = require('./storage');
var fs = require('fs');
var bodyParser = require('body-parser');
var passport = require('passport');
var currUser;
// var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
// var request = require('request');
const LocalStrategy = require('passport-local').Strategy
var path = require('path');
var PORT = process.env.PORT || 8080;

// Check https enable or not
if (config.hasOwnProperty('https')) {
    var credentials = { key: config.https.key, cert: config.https.cert };
    Server = https.createServer(credentials, app);
    console.log('App starting with HTTPS enabled');
}
else if (config.hasOwnProperty('http')) {
    Server = http.createServer(app);
    console.log('App starting with HTTP enabled');
}
else
    return process.exit(1);

// if (!config.hasOwnProperty('GoogleApi') || config.GoogleApi.hasOwnProperty('client_Id') || config.GoogleApi.hasOwnProperty('client_Secret')) {
//     console.log('Incomplete information');
//     return process.exit(1);
// }

// if (!storageModule.init(config)) {
//     console.log('Cannot connect to DB');
//     return process.exit(1);
// }

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('views'));
app.use(passport.initialize());
app.use(passport.session());

app.set('views', path.join(__dirname, '/views/html'));

app.get('/', function (req, res) {
    fs.readFile("views/html/dashboard.html", function (err, data) {
        if (err) throw err;
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.write(data);
        res.end();
    });
});

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, function (email, password, done) {
    if (!email || !password)
        return done({ 'err': { "msg": "Incomplete data", "code": "" } }, null);
    storageModule.checkUser(email, 'local').then(function (data) {
        if (Object.key(data).length == 0)
            done({ 'err': { "msg": "This user does not exist", "code": "" } }, null);
        else {
            currUser = data;
            done(null, data);
        }
    }).otherwise(function (err) {
        done(err, null);
    });
}
));

passport.serializeUser(function (user, cb) {
    cb(null, user);
});

passport.deserializeUser(function (obj, cb) {
    cb(null, obj);
});

app.get('/auth/google', passport.authenticate('google', {
    scope: ['email', 'profile']
}));

app.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/error' }),
    function (req, res) {
        currUser = req.body;
        res.redirect('/dashboard');
    }
);

app.get('/login', function (req, res) {
    res.redirect('/');
});

app.post('/login', function (req, res) {
    if (!req.hasOwnProperty('body') || !req.body.hasOwnProperty('name'))
        console.log("error logging in");

    if (req.body.name == 'login-submit')
        passport.authenticate('local', {
            successRedirect: '/dashboard',
            failureRedirect: '/error',
            failureFlash: true
        })
    else {
        storageModule.checkUser(email, 'local').then(function (data) {
            if (Object.key(data).length == 0) {
                storageModule.createUser(null, req.body.name, req.body.email, req.body.password, null, 'local').then(function (data) {
                    currUser = data;
                    res.redirect('/dashboard');
                }).otherwise(function (err) {
                    res.redirect('/login');
                });
            }
        }).otherwise(function (err) {
            done(err, null);
        });
    }
});

app.get('/search', function (req, res) {
    res.sendFile(__dirname + "/views/html/" + "search.html");
});

app.post('/search', function (req, res) {
    if (!req.hasOwnProperty('body') || !req.body.hasOwnProperty('search'))
        console.log("error getting data");
    storageModule.findOrg(req.body.search.location).then(function (data) {
        res.send(data);
    }).otherwise(function (err) {
        res.send("No search results");
    })
})

app.get('/editProfile', function (req, res) {
    res.sendFile(__dirname + "/views/html/" + "editProfile.html");
});

app.post('/editProfile', function (req, res) {
    if (!req.hasOwnProperty('body') || !req.body.hasOwnProperty('name'))
        console.log("error getting data");
    storageModule.updateUser(json.stringify(req.body)).then(function (data) {
        console.log("Succesfully edited!")
    }).otherwise(function (err) {
        console.log("Error updating! Please try again later!")
    });
    res.redirect('/search');
})

app.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/login');
});

app.get('/error', function (req, res) {
    res.redirect('/login');
});

Server.listen(PORT, () => {
    console.log('Listening to port ' + PORT);
});