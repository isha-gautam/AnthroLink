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
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var request = require('request');
const LocalStrategy = require('passport-local').Strategy

var PORT = process.env.PORT || 8080;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('views'));
app.use(passport.initialize());
app.use(passport.session());

storageModule.init(config);

// Check https enable or not
if (config.hasOwnProperty('https')) {
    var credentials = { key: config.https.key, cert: config.https.cert };
    Server = https.createServer(credentials, app);
    console.log('App starting with HTTPS enabled');
}
else {
    Server = http.createServer(app);
    console.log('App starting with HTTP enabled');
}

app.get('/', function (req, response) {
    fs.readFile("views/html/login.html", function (err, data) {
        if (err) throw err;
        response.writeHead(200, { 'Content-Type': 'text/html' });
        response.write(data);
        response.end();
    });
});

app.post('views/html/login', function (req, res) {
    if (!req.hasOwnProperty('body') || req.body.hasOwnProperty('name'))
        console.log("error logging in");

    if (res.body.name == 'login-submit')
        passport.authenticate('local', {
            successRedirect: 'views/html/profile',
            failureRedirect: '/views/html/login',
            failureFlash: true
        })
    else {
        storageModule.checkUser(email, 'local').then(function (data) {
            if (Object.key(data).length == 0) {
                storageModule.createUser(null, req.body.name, req.body.email, req.body.password, null, 'local').then(function (data) {
                    res.redirect('views/html/profile');
                }).otherwise(function (err) {
                    res.redirect('/login');
                });
            }
        }).otherwise(function (err) {
            done(err, null);
        });
    }
});

passport.use(new LocalStrategy(
    function (email, password, done) {
        if (!email || !password)
            return done({ 'err': { "msg": "Incomplete data", "code": "" } }, null);
        storageModule.checkUser(email, 'local').then(function (data) {
            if (Object.key(data).length == 0)
                done(null, data);
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
}
));

passport.use(new GoogleStrategy({
    clientID: "594743792021-tvffn11n961cqea8mbufm9gnts372m0n.apps.googleusercontent.com",
    clientSecret: "N37STg-MvMS36GRneYLud2Jr",
    callbackURL: "https://127.0.0.1:8080/auth/google/callback"
},
    function (accessToken, refreshToken, profile, done) {
        //console.log("access token:" + accessToken + "\nrefresh token:" + refreshToken + "\nprofile:" + profile.id + profile.emails + profile.photos.value);
        if (!accessToken || !profile || !profile.hasOwnProperty("id") ||
            !profile.hasOwnProperty("displayName") || !profile.hasOwnProperty("emails") ||
            !profile.hasOwnProperty("photos") || !profile.hasOwnProperty("provider"))
            return done({ 'err': { "msg": "Incorrect data received from Google", "code": "" } }, null);
        var photo = null;
        if (profile.photos.length > 0)
            photo = profile.photos[0].value;
        var email = null;
        if (profile.emails.length > 0)
            email = profile.emails[0].value;
        storageModule.createUser(profile.id, profile.displayName, email, null, photo, profile.provider).then(function (data) {
            done(null, data);
        }).otherwise(function (err) {
            done(err, null);
        });
    }
));

app.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/error' }),
    function (req, res) {
        res.redirect('views/html/profile');
    });

app.get('views/html/profile', function (req, res) {
    var name = 'hello';
    res.render("views/html/profile.html", { user: req.body });
});

app.get('/success', (req, res) => res.send("You have successfully logged in"));

app.get('/error', (req, res) => res.send("error logging in"));

Server.listen(PORT, () => {
    console.log('Listening to port ' + PORT);
});
