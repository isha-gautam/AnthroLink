// JavaScript source code
var config = require('./config');
var express = require('express');
var app = express();
var Server;
var http = require('http');
var https = require('https');
var storageModule = require('./storage');
var bodyParser = require('body-parser');
var passport = require('passport');
var session = require('express-session');
var IP, mode, PORT;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const LocalStrategy = require('passport-local').Strategy;

// Check https enable or not
if (config.hasOwnProperty('https')) {
    var credentials = { key: config.https.key, cert: config.https.cert };
    Server = https.createServer(credentials, app);
    console.log('App starting with HTTPS enabled');
    mode = "https";
}
else if (config.hasOwnProperty('http')) {
    Server = http.createServer(app);
    console.log('App starting with HTTP enabled');
    mode = "http";
}
else
    return process.exit(1);

if (!config.hasOwnProperty('GoogleApi') || !config.GoogleApi.hasOwnProperty('client_Id') || !config.GoogleApi.hasOwnProperty('client_Secret')) {
    console.log('Incomplete information');
    return process.exit(1);
}

IP = config.hasOwnProperty('IP') ? config.IP : '127.0.0.1';
PORT = config.hasOwnProperty('PORT') ? config.PORT : (process.env.PORT || 8080);

if (!storageModule.init(config)) {
    console.log('Cannot connect to DB');
    return process.exit(1);
}

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('views'));
app.use(session({ secret: 'AnthroLink_kniLorhtnA' }));
app.use(passport.initialize());
app.use(passport.session());

app.get('/', function (req, res) {
    res.sendFile(__dirname + "/views/html/" + "login.html");
});

passport.use(new GoogleStrategy({
    clientID: config.GoogleApi.client_Id,
    clientSecret: config.GoogleApi.client_Secret,
    callbackURL: mode + "://" + IP + ':' + PORT + "/auth/google/callback"
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
}));

app.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/error' }),
    function (req, res) {
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

app.get('/dashboard', function (req, res) {
    res.sendFile(__dirname + "/views/html/" + "dashboard.html");
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

Server.listen(PORT, IP, () => {
    console.log('Listening to port ' + PORT);
});