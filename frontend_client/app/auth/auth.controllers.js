'use strict';
/*jslint browser:true*/
/*jslint devel:true */
/*global _*/
/*global $*/

var AuthControllers = angular.module('corvus.auth.controllers', ['corvus.services']);

AuthControllers.controller('Login', ['$scope', '$cookies', '$location', '$timeout', 'Session', 'AppState', function($scope, $cookies, $location, $timeout, Session, AppState) {

    var validEmail = function (email) {
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }

    $scope.login = function(email, password, remember_me) {
        // TODO: input validation
        if (!email || !password) {
            $scope.error = "Email address and Password are required.";
            return;
        } else if (!validEmail(email)) {
            $scope.error = "Please enter a valid formatted email address.";
            return;
        }

        Session.create({
            'email': email,
            'password': password
        }, function (new_session) {
            $cookies['metabase.SESSION_ID'] = new_session.id;

            // this is ridiculously stupid.  we have to wait (300ms) for the cookie to actually be set in the browser :(
            $timeout(function() {
                // now try refetching current user details and sending user on their way
                AppState.refreshCurrentUser().then(function (user) {
                    $scope.$emit('appstate:login', new_session.id);
                    $location.path('/');
                }, function (error) {
                    // hmmm, somehow we still don't have a valid user :(
                    $scope.error = "Login failure";
                });
            }, 300);
        }, function (error) {
            $scope.error = "Invalid username/password combination specified.";
        });
    };

    // do a quick check if the user is already logged in.  if so then send them somewhere better.
    if (AppState.model.currentUser && AppState.model.currentUser.org_perms && AppState.model.currentUser.org_perms.length > 0) {
        $location.path('/'+AppState.model.currentUser.org_perms[0].organization.slug+'/');
    }
}]);


AuthControllers.controller('Logout', ['$scope', '$cookies', '$location', '$timeout', 'Session', function($scope, $cookies, $location, $timeout, Session) {

    // any time we hit this controller just clear out anything session related and move on
    if ( $cookies['metabase.SESSION_ID'] ) {
        var sessionId = $cookies['metabase.SESSION_ID'];
        delete $cookies['metabase.SESSION_ID'];

        // this is ridiculously stupid.  we have to wait (300ms) for the cookie to actually be set in the browser :(
        $timeout(function() {
            // don't actually need to do anything here
            $scope.$emit('appstate:logout', sessionId);

            // only sensible place to go after logout is login page
            $location.path('/auth/login');
        }, 300);
    } else {
        // only sensible place to go after logout is login page
        $location.path('/auth/login');
    }
}]);


AuthControllers.controller('PasswordReset', ['$scope', '$cookies', '$location', 'Session', function($scope, $cookies, $location, Session) {

    // TODO: fill this out

}]);
