var app = angular.module('OneTwoThreeApp', ['ngMaterial']);

app.controller('RepoListController', function ($scope, $http) {
    $scope.isLoading = false;
    $scope.page = 0;
    $scope.repos = [];

    $scope.loadMoreRepos = function () {
        if ($scope.isLoading) {
            return;
        }

        $scope.isLoading = true;
        $scope.page = $scope.page + 1;

        $http.get('/repos/' + $scope.page).success(function (data, status, headers, config) {
            Array.prototype.push.apply($scope.repos, data);
            $scope.isLoading = false
        });
    };

    $scope.loadMoreRepos();
});

app.filter('show_ago', function () {
    return function(input) {
        return moment(input).fromNow();
    };
});
