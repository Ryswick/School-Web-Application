/*var villageRef = rootRef.child("village");
villageRef.push({
  tallende: {
    name: "tallende",
  }
});*/

// create the module and name it app
var app = angular.module('app', []);

// create the controller and inject Angular's $scope
app.controller('mainController', function($scope) {
    var rootRef = new Firebase('https://tpj2ee.firebaseio.com/');

    $scope.log = function() {
        console.log("coucou");
    }
});
