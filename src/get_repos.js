var getGithub = require('./get_github.js');


module.exports = function (accessToken, page, done) {
    var github = getGithub();

    github.authenticate({
        type: "oauth",
        token: accessToken
    });

    github.repos.getAll({
        sort: 'updated',
        direction: 'desc',
        page: page,
        per_page: 10
    }, done);
};
