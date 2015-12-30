// create the module and name it app
var app = angular.module('app', ['ui.router', 'firebase']);

// create the controller and inject Angular's $scope
app.controller('mainController', function($scope, $rootScope, $firebaseObject, $firebaseAuth, $firebaseArray) {
    var ref = new Firebase('https://tpj2ee.firebaseio.com/');
    var userRef = new Firebase('https://tpj2ee.firebaseio.com/users');
    var paysRef = new Firebase('https://tpj2ee.firebaseio.com/pays');
    var villageRef = new Firebase('https://tpj2ee.firebaseio.com/village');
    var activiteRef = new Firebase('https://tpj2ee.firebaseio.com/activite');
    var langueRef = new Firebase('https://tpj2ee.firebaseio.com/langue');
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
            isAdmin();
            console.log($scope.userData);
        }).catch(function(error) {
            console.error("Authentication failed:", error);
        });
    }

    $scope.logout = function() {
        if ($scope.auth != null) {
            $scope.auth.$unauth();
        }
    }

    $scope.isLogged = function() {
        return $scope.auth.$getAuth();
    }

    $scope.userRole = null;

    var userRole = function(role) {
        $scope.userRole = role;
    }

    var isAdmin = function() {
        if ($scope.isLogged()) {
            var obj = $firebaseObject(userRef.child("/" + $scope.auth.$getAuth().uid));
            obj.$loaded(
                function(data) {
                    userRole(data.role);
                },
                function(error) {
                    console.error("Error:", error);
                }
            );

        }
    }

    /*Changement de mot de passe*/
    $scope.changePassword = function(user) {
        ref.changePassword({
            email: user.email,
            oldPassword: user.oldPassword,
            newPassword: user.newPassword
        }, function(error) {
            if (error) {
                switch (error.code) {
                    case "INVALID_PASSWORD":
                        console.log("The specified user account password is incorrect.");
                        break;
                    case "INVALID_USER":
                        console.log("The specified user account does not exist.");
                        break;
                    default:
                        console.log("Error changing password:", error);
                }
            } else {
                console.log("User password changed successfully!");
            }
        });
    }

    $scope.listeVillages = {};

    var remplirListeVillages = function(pays, village) {
        if (typeof $scope.listeVillages[pays] === 'undefined')
            $scope.listeVillages[pays] = [];
        var obj = {};
        obj["village"] = village;
        $scope.listeVillages[pays].push(obj);
        console.log($scope.listeVillages);
    }

    var listerVillagesVacances = function() {
        $scope.listeVillages = {};
        paysRef.on("value", function(snapshot) {
            snapshot.forEach(function(data) {
                for (var village in data.val().village) {
                    villageRef.child(village).on('value', function(snap) {
                        var pays = data.val().nom;
                        var village = snap.val().nom;
                        remplirListeVillages(pays, village);
                    });
                }
            });
        });
    };

    $scope.listeActivites = {};

    var remplirListeActivite = function(village, designation, gratuite) {
        if (typeof $scope.listeActivites[village] === 'undefined')
            $scope.listeActivites[village] = [];
        var obj = {};
        obj["designation"] = designation;
        if (gratuite == true) {
            obj["gratuite"] = "oui";
        } else
            obj["gratuite"] = "non";
        $scope.listeActivites[village].push(obj);
    }

    var listerActivitesVillages = function() {
        $scope.listeActivites = {};
        villageRef.on("value", function(snapshot) {
            snapshot.forEach(function(data) {
                for (var act in data.val().activite) {
                    activiteRef.child(act).on('value', function(snap) {
                        var village = data.val().nom;
                        var designation = snap.val().designation;
                        var gratuite = data.val().activite[act];

                        remplirListeActivite(village, designation, gratuite);
                    });
                }
            });
        });
    }


    $scope.listeLanguesVillages = {};

    var remplirListeLangues = function(village, lang) {
        if (typeof $scope.listeLanguesVillages[village] === 'undefined')
            $scope.listeLanguesVillages[village] = [];
        var obj = {};
        obj["langue"] = lang;
        $scope.listeLanguesVillages[village].push(obj);
    }


    var listerLanguesVillages = function() {
        $scope.listeLanguesVillages = {};
        villageRef.on("value", function(snapshot) {
            snapshot.forEach(function(data) {
                for (var lang in data.val().langue) {
                    langueRef.child(lang).on('value', function(snap) {
                        console.log(snap.val());
                        var village = data.val().nom;
                        var lang = snap.val().designation;

                        remplirListeLangues(village, lang);
                    });
                }
            });
        });
    }


    $scope.listeActivitesDansVillages = function() {
        listerActivitesVillages();
        setTimeout(function() {
            $scope.$apply(function() {
                $scope.listeActivitesDansLeVillage = JSON.stringify($scope.listeActivites, undefined, 2);
            });
        }, 500);
    }

    $scope.villagesVacances = function() {
        listerVillagesVacances();
        setTimeout(function() {
            $scope.$apply(function() {
                $scope.liste = JSON.stringify($scope.listeVillages, undefined, 2);
            });
        }, 500);
    };

    $scope.languesVillages = function() {
        listerLanguesVillages();
        setTimeout(function() {
            $scope.$apply(function() {
                $scope.listeLanguesDansLesVillages = JSON.stringify($scope.listeLanguesVillages, undefined, 2);
            });
        }, 500);
    };

});

app.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider.state('home', {
        url: '/',
        templateUrl: 'templates/home.html'
    })

    $stateProvider.state('profile', {
        url: '/profile',
        templateUrl: 'templates/profile.html'
    })

    $urlRouterProvider.otherwise('/')
});
