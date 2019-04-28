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
var path = require('path');
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

app.set('views', path.join(__dirname, '/views/html'));

app.get('/', function (req, res) {
    //fs.readFile("views/html/login.html", function (err, data) {
    fs.readFile("views/html/profile.html", function (err, data) {
        if (err) throw err;
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.write(data);
        res.end();
    });
});

app.post('/views/html/login', function (req, res) {
    if (!req.hasOwnProperty('body') || !req.body.hasOwnProperty('name'))
        console.log("error logging in");

    if (res.body.name == 'login-submit')
        passport.authenticate('local', {
            successRedirect: '/success',
            failureRedirect: '/error',
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

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, function (email, password, done) {
    if (!email || !password)
        return done({ 'err': { "msg": "Incomplete data", "code": "" } }, null);
    storageModule.checkUser(email, 'local').then(function (data) {
        if (Object.key(data).length == 0)
            done({ 'err': { "msg": "This user does not exist", "code": "" } }, null);
        else
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

if (!config.hasOwnProperty('GoogleApi') || config.GoogleApi.hasOwnProperty('client_Id') || config.GoogleApi.hasOwnProperty('client_Secret')) {
    console.log('Incomplete information');
}

passport.use(new GoogleStrategy({
    clientID: config.GoogleApi.client_Id,
    clientSecret: config.GoogleApi.client_Secret,
    callbackURL: "https://127.0.0.1:8080/auth/google/callback"
},
    function (accessToken, refreshToken, profile, done) {
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
        res.redirect('/success');
    });

app.get('/success', function (req, res) {
    res.send("You have successfully logged in")
    res.redirect('/profile');
});

app.get('/error', function (req, res) {
    res.send("error logging in")
    res.redirect('/');
});

app.get('/profile', function (req, res) {
    res.render('profile', { user: req.body });
});

app.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
});

app.post('/views/html/login', function (req, res) {
    if (!req.hasOwnProperty('body') || !req.body.hasOwnProperty('name'))
        console.log("error logging in");

    if (res.body.name == 'login-submit')
        passport.authenticate('local', {
            successRedirect: '/success',
            failureRedirect: '/error',
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

app.post('/views/html/profile', function (req, res) {
    if (!req.hasOwnProperty('body') || !req.body.hasOwnProperty('name'))
        console.log("error getting data");
    
    console.log(json.stringify(req.body));
})

Server.listen(PORT, () => {
    console.log('Listening to port ' + PORT);
});