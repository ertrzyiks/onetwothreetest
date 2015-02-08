var getGithub = require('./get_github.js');


module.exports = function (accessToken, repo, done) {
    var github = getGithub(),
        q;

    github.authenticate({
        type: "oauth",
        token: accessToken
    });

    q = 'resources extension:xml repo:' + repo;

    github.search.code({
        q: q
    }, done);
};
