var GitHubApi = require("github");

module.exports = function (){
    var github = new GitHubApi({
        version: "3.0.0",
        protocol: "https",
        timeout: 5000
    });

    return github;
};


