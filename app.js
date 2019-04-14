// JavaScript source code
const { OAuth2Client } = require('google-auth-library');
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
const client = new OAuth2Client('594743792021-tvffn11n961cqea8mbufm9gnts372m0n.apps.googleusercontent.com');
var authObject;
var token_id, access_token, refresh_token;
var profile;
var profileDB;


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
/*
app.post('/google/login',
    passport.authenticate('local', { failureRedirect: '/' }),
    function (req, res) {

        if (!req.hasOwnProperty('body') || !req.body.hasOwnProperty('id_token') || !req.body.hasOwnProperty('access_token') || !req.body.hasOwnProperty('profile'))
            resp.status(404).send({ 'data': { 'msg': 'GoogleAuth does not have sufficient data' } });
        else {
            authObject = req.body;
            token_id = authObject.id_token;
            access_token = authObject.access_token;
            profileDB = {
                'Id': authObject.Id,
                'name': authObject.name,
                'userimg': authObject.userimg,
                'emailID': authObject.emailID
            };

            profile = authObject.profile;

            resp.status(200).send({ 'data': { 'token_id': token_id, 'access_id': access_token } });

            async function verify() {
                const ticket = await client.verifyIdToken({
                    idToken: token_id,
                    audience: '594743792021-tvffn11n961cqea8mbufm9gnts372m0n.apps.googleusercontent.com',
                });
                const payload = ticket.getPayload();
                const userid = payload['sub'];
            }
            console.log("Account verified!");
            verify().catch(console.error);
            console.log(profileDB);

            // var options = {
            //     method: 'POST',
            //     url: 'https://localhost:8080/oauth/token',
            //     headers: { 'content-type': 'application/json' },
            //     body:
            //     {
            //         grant_type: 'authorization_code',
            //         client_id: '594743792021-tvffn11n961cqea8mbufm9gnts372m0n.apps.googleusercontent.com',
            //         client_secret: '8aant_BOs6holQms7d8PM_wN',
            //         redirect_uri: 'https://localhost:8080'
            //     },
            //     json: true
            // };

            // request(options, function (error, response, body) {
            //     if (error) throw new Error(error);
            //     console.log(response);
            //     refresh_token = body.refresh_token;
            //     if (response.hasOwnProperty('body'))
            //         console.log(response.body);
            //     else
            //         console.log('bye');
            //       console.log(response);
            // });
        }

        res.redirect('/');

    }

);
*/

passport.serializeUser(function (user, cb) {
    cb(null, user);
});

passport.deserializeUser(function (obj, cb) {
    cb(null, obj);
});

app.get('/auth/google',
    passport.authenticate('google', {
        scope:
            ['email', 'profile']
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
