var express = require('express'),
    logger = require('express-logger'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    session = require('express-session'),
    passport = require('passport'),
    util = require('util'),
    expressLayouts = require('express-ejs-layouts'),
    GitHubStrategy = require('passport-github').Strategy,

    getXmls = require('./src/get_xmls.js'),
    getRepos = require('./src/get_repos.js'),
    getContent = require('./src/get_content.js');

var GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
var GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
var GITHUB_CLIENT_CALLBACK_URL = process.env.GITHUB_CLIENT_CALLBACK_URL;


passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(obj, done) {
    done(null, obj);
});

// Use the GitHubStrategy within Passport.
passport.use(new GitHubStrategy({
        clientID: GITHUB_CLIENT_ID,
        clientSecret: GITHUB_CLIENT_SECRET,
        callbackURL: GITHUB_CLIENT_CALLBACK_URL,
        scope: 'repo'
    },
    function(accessToken, refreshToken, profile, done) {
        profile.accessToken = accessToken;

        process.nextTick(function () {
            return done(null, profile);
        });
    }
));

var app = express();

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(methodOverride());
app.use(expressLayouts);
app.use(session({
    resave: false,
    saveUninitialized: true,
    secret: 'absdjkv3b2bh34h5bjh34v5hj34v5h3'
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
    res.render('index', { user: req.user, layout: 'layout.ejs' });
});

app.get(/^\/show\/([^\/]+)\/([^\/]+)/, function (req, res) {
    if (!req.user) {
        return res.redirect('/');
    }

    var user = req.params[0],
        repo = req.params[1],
        repoName = user + '/' + repo;

    getXmls(req.user.accessToken, repoName, function (err, list) {
        res.render('show', {
            user: req.user,
            xmls: list.items,
            repoName: repoName,
            layout: 'layout.ejs'
        });
    });
});

app.get('/repos/:page', function(req, res){
    if (!req.user) {
        return res.send([]);
    }

    getRepos(req.user.accessToken, req.params.page, function (err, list) {
        res.send(list);
    });
});

app.get(/^\/content\/([^\/]+)\/([^\/]+)/, function (req, res) {
    if (!req.user) {
        return "";
    }

    var user = req.params[0],
        repo = req.params[1];

    getContent(req.user.accessToken, { user: user,  repo: repo, path: req.query.path }, function (err, content) {
        console.log(err);
        res.send(content);
    });
});

// GET /auth/github
app.get('/auth/github',
    passport.authenticate('github'),
    function(req, res){

    });

// GET /auth/github/callback
app.get('/auth/github/callback',
    passport.authenticate('github', { failureRedirect: '/login' }),
    function(req, res) {
        res.redirect('/');
    });

app.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
});


console.log('Listening on ', process.env.PORT || 3000);
app.listen(process.env.PORT || 3000);

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }

    res.redirect('/login')
}
