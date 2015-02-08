var getGithub = require('./get_github.js');


module.exports = function (accessToken, paths, done) {
    var github = getGithub(),
        q;

    github.authenticate({
        type: "oauth",
        token: accessToken
    });

    github.repos.getContent(paths, done);
};
