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
var path = require('path');

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
    res.redirect('/login');
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
            return done({ 'err': { "msg": "Incorrect data received from Google", "code": "" } });
        var photo = null;
        if (profile.photos.length > 0)
            photo = profile.photos[0].value;
        var email = null;
        if (profile.emails.length > 0)
            email = profile.emails[0].value;
        storageModule.createUser(profile.emails[0].value, profile.displayName, photo, profile.provider).then(function (data) {
            done(null, data);
        }).otherwise(function (err) {
            done(err);
        });
    }
));

passport.use(new LocalStrategy({
    passReqToCallBack: true,
    usernameField: 'email',
    passwordField: 'password'
}, function (email, password, done) {
    if (!email || !password)
        return done({ 'err': { "msg": "Incomplete data", "code": "" } });
    storageModule.checkUser(email, password).then(function (data) {
        if (!data || Object.keys(data).length == 0) {
            console.log("user doesnt' exist");
            done(null, false, { 'err': { "msg": "Wrong email id or password", "code": "" } });
        }
        else
            done(null, data);
    }).otherwise(function (err) {
        done(err);
    });
}));

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (obj, done) {
    storageModule.checkUser(obj[0]._id).then(function (data) {
        if (!data || Object.keys(data).length == 0) {
            console.log("user doesnt' exist");
            done(null, false, { 'err': { "msg": "Wrong email id or password", "code": "" } });
        }
        else
            done(null, data);
    }).otherwise(function (err) {
        done(err);
    });
});

app.get('/auth/google', passport.authenticate('google', {
    scope: ['email', 'profile']
}));

app.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/error' }),
    function (req, res) {
        res.redirect('/editProfile');
    }
);

app.get('/login', function (req, res) {
    res.sendFile(path.join(__dirname, "/views/html/", "login.html"));
});

app.post('/login', passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/error'
}));

app.post('/register', function (req, res) {
    var ReqBody;
    if (!req.hasOwnProperty('body'))
        res.status(400).send("Bad request. The request could not be understood by the server due to malformed syntax.");
    else {
        ReqBody = JSON.parse(JSON.stringify(req.body));
        var img;
        if (ReqBody.type == "Citizen")
            img = "https://img.icons8.com/cotton/64/000000/gender-neutral-user.png";
        else
            img = "https://img.icons8.com/metro/52/000000/organization.png";
        storageModule.createUser(ReqBody.email, ReqBody.name, ReqBody.password, img, 'local', ReqBody.type).then(function (data) {
            res.redirect('/login');
        }).otherwise(function (err) {
            console.log("User already exists. Please login with another email");
            res.redirect('/login');
        });
    }
});

app.get('/dashboard', isAuthenticated, function (req, res) {
    res.sendFile(path.join(__dirname, "/views/html/", "dashboard.html"));
});

app.get('/search', isAuthenticated, function (req, res) {
    res.sendFile(path.join(__dirname, "/views/html/", "search.html"));
});

app.post('/search', isAuthenticated, function (req, res) {
    if (!req.hasOwnProperty('body') || !req.body.hasOwnProperty('searchStr'))
        res.status(400).send("Bad request. The request could not be understood by the server due to malformed syntax."); else {
        storageModule.fetchUser(req.body.searchStr).then(function (data) {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(data));
        }).otherwise(function (err) {
            res.end("No search results");
        });
    }
});

app.get('/otherProfile', isAuthenticated, function (req, res) {
    res.sendFile(path.join(__dirname, "/views/html/", "otherProfile.html"));
});

app.post('/otherProfile', isAuthenticated, function (req, res) {
    if (!req.hasOwnProperty('body') || !req.body.hasOwnProperty('othPro'))
        res.status(400).send("Bad request. The request could not be understood by the server due to malformed syntax.");
    else {
        res.redirect("/ticket");
    }
});

app.get('/ticket', isAuthenticated, function (req, res) {
    res.sendFile(path.join(__dirname, "/views/html/", "ticket.html"));
});

app.post('/ticket', isAuthenticated, function (req, res) {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    if (!req.hasOwnProperty('body') || !req.hasOwnProperty('user') || req.user.length <= 0)
        res.status(400).send("Bad request. The request could not be understood by the server due to malformed syntax.");
    else {
        storageModule.createTicket(req.body.citName, req.body.citEmail, req.body.orgName, req.body.orgEmail, req.body.startDate, req.body.endDate, req.body.TDescr, req.body.type).then(function (data) {
            res.end(JSON.stringify(data));
        }).otherwise(function (err) {
            res.status(500).send("Internal Server error. The server encountered an unexpected condition which prevented it from fulfilling the request.");
        });
    }
});

app.get('/editProfile', isAuthenticated, function (req, res) {
    res.sendFile(path.join(__dirname, "/views/html/", "editProfile.html"));
});

app.post('/editProfile', isAuthenticated, function (req, res) {
    if (!req.hasOwnProperty('body') || !req.hasOwnProperty('user') || req.user.length <= 0)
        res.status(400).send("Bad request. The request could not be understood by the server due to malformed syntax.");
    storageModule.updateUser(req.body, req.user[0]).then(function (data) {
        res.send("Successfully edited");
    }).otherwise(function (err) {
        res.status(500).send("Internal Server error. The server encountered an unexpected condition which prevented it from fulfilling the request.");
    });
});

app.get('/getCurrUser', isAuthenticated, function (req, res) {
    if (!req.hasOwnProperty('user') || req.user.length <= 0)
        res.status(400).send("Bad request. The request could not be understood by the server due to malformed syntax.");
    else {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(req.user[0]));
    }
});

app.get('/othPro', isAuthenticated, function (req, res) {
    if (!req.hasOwnProperty('body') || !req.query.hasOwnProperty('othPro'))
        res.status(400).send("Bad request. The request could not be understood by the server due to malformed syntax.");
    else {
        storageModule.checkUser(req.query.othPro).then(function (data) {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(data[0]));
        }).otherwise(function (err) {
            res.status(500).send("Internal Server error. The server encountered an unexpected condition which prevented it from fulfilling the request.");
        });
    }
});

app.get('/getTicks', isAuthenticated, function (req, res) {
    if (!req.hasOwnProperty('body') || req.body.length < 0)
        res.status(400).send("Bad request. The request could not be understood by the server due to malformed syntax.");
    else {
        storageModule.searchTicket(req.user[0]._id).then(function (data) {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(data));
        }).otherwise(function (err) {
            res.status(500).send("Internal Server error. The server encountered an unexpected condition which prevented it from fulfilling the request.");
        });
    }
});

app.post('/updateStatus', isAuthenticated, function (req, res) {
    if (!req.hasOwnProperty('body') || !req.body.hasOwnProperty('stat'))
        res.status(400).send("Bad request. The request could not be understood by the server due to malformed syntax.");
    else {
        storageModule.updateTicketStat(req.body.stat.id, req.body.stat.status).then(function (data) {
            console.log("done")
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end("success");
        }).otherwise(function (err) {
            res.status(500).send("Internal Server error. The server encountered an unexpected condition which prevented it from fulfilling the request.");
        });
    }
});

app.get('/logout', isAuthenticated, function (req, res) {
    req.logout();
    req.session.destroy(function (err) {
        res.redirect('/');
    });
});

app.get('/error', function (req, res) {
    res.redirect('/login');
});

function isAuthenticated(req, res, next) {
    if (req.isAuthenticated() || req.hasOwnProperty('user'))
        return next();
    res.redirect('/');
};

Server.listen(PORT, IP, () => {
    console.log('Listening to port ' + PORT);
});