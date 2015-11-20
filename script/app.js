// create the module and name it app
var app = angular.module('app', ['ui.router', 'firebase']);

// create the controller and inject Angular's $scope
app.controller('mainController', function($scope, $firebaseObject, $firebaseAuth, $firebaseArray) {
    var ref = new Firebase('https://tpj2ee.firebaseio.com/');
    var userRef = new Firebase('https://tpj2ee.firebaseio.com/users')

    $scope.auth = $firebaseAuth(ref);

    // var villageRef = ref.child("village");
    // villageRef.push({
    //     tallende: {
    //         name: "tallende",
    //     }
    // });


    var addUser = function(userData) {
        userRef.child(userData.uid).set({
            role: "admin"
        });
    }



    /* Fonction pour créer un utilisateur */
    $scope.createUser = function(newUser) {
        $scope.auth.$createUser({
            email: newUser.email,
            password: newUser.password
        }).then(function(userData) {
            addUser(userData);
            console.log("User " + userData.uid + " created successfully!");
        }).catch(function(error) {
            console.error(error);
        });
    }

    $scope.login = function(user) {
        $scope.auth.$authWithPassword({
            email: user.email,
            password: user.password
        }).then(function(authData) {
            console.log("Logged in as:", authData.uid);
        }).catch(function(error) {
            console.error("Authentication failed:", error);
        });
    }

    $scope.logout = function() {
        if ($scope.auth != null)
            $scope.auth.$unauth()
    }

    $scope.isLogged = function() {
        return $scope.auth.$getAuth();
    }

    var isAdmin = function() {
        var uid = $scope.auth.$getAuth().uid;
        if ($scope.isLogged());
        userRef.child(uid).on('value', function(data) {
            $scope.admin = data.val().role;
        });

    }

    isAdmin();

});

app.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider.state('home', {
        url: '/',
        templateUrl: 'templates/home.html'
    })

    $stateProvider.state('about', {
        url: '/about',
        templateUrl: 'templates/about.html'
    })

    $urlRouterProvider.otherwise('/')
});
