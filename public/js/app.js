var app = angular.module('OneTwoThreeApp', ['ngMaterial', 'ui.codemirror']);

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

app.controller('XmlListController', function ($scope, $http) {
    $scope.repoName = '';
    $scope.content = null;
    $scope.isLoading = false;

    $scope.editorOptions = {
        lineWrapping : true,
        lineNumbers: true,
        readOnly: 'nocursor',
        mode: 'xml',
        viewportMargin: Infinity,
        gutters: ["color-gutter", "CodeMirror-linenumbers"]
    };

    function makeMarker(color) {
        var marker = document.createElement("div");
        marker.style.color = color;
        marker.style.fontSize = '26px';
        marker.innerHTML = "\u25A0";
        return marker;
    }

    $scope.codemirrorLoaded = function (_editor) {
        _editor.on('change', function () {
            var doc = _editor.getDoc(),
                lines = doc.lineCount(),
                i, content, res;

            for (i = 0; i < lines; i++) {
                content = doc.getLine(i);

                res = content.match(/#([0-9A-F]{6}|[0-9A-F]{3})/i);

                if (res) {
                    _editor.setGutterMarker(i, "color-gutter", makeMarker(res[0]));
                }
            }
        });
    };

    $scope.showContent = function (path) {
        $scope.isLoading = true;

        $http.get('/content/' + $scope.repoName + '?path=' + encodeURIComponent(path))
            .success(function (data, status, headers, config) {
                $scope.isLoading = false;
                $scope.content = window.atob(data.content);
            });
    };
});

app.filter('show_ago', function () {
    return function(input) {
        return moment(input).fromNow();
    };
});
