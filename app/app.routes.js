(function () {
  'use strict';

  var requireNotAuthenticated;

  angular
    .module('angularfireSlackApp')
    .config(function ($stateProvider, $urlRouterProvider) {

      $stateProvider
        .state('home', {
          url: '/',
          templateUrl: 'home/home.html'
        })
        .state('login', {
          url: '/login',
          controller: 'AuthCtrl',
          controllerAs: 'authCtrl',
          templateUrl: 'auth/login.html',
          resolve: requireNotAuthenticated,
        })
        .state('register', {
          url: '/register',
          controller: 'AuthCtrl',
          controllerAs: 'authCtrl',
          templateUrl: 'auth/register.html',
          resolve: requireNotAuthenticated,
        })
        .state('profile', {
          url: '/profile',
          templateUrl: 'users/profile.html',
          resolve: {
            auth: function($state, Auth) {
              return Auth.isAuthenticated().catch(function() {
                $state.go('home');
              })
            },
            profile: function(Auth, Users) {
              return Auth.isAuthenticated().then(isAuthenticatedSuccessFn);

              function isAuthenticatedSuccessFn(auth) {
                // TODO why do we need loaded, shouldn't get profile return a promise?
                return Users.getProfile(auth.uid).$loaded();
              }
            }
          }
        });

      $urlRouterProvider.otherwise('/');
    });

  requireNotAuthenticated = {
    redirectIfAuthenticated: function($state, Auth) {
      // if user does not require authentitication promise will be redjected
      return Auth.isAuthenticated().then(isAuthenticatedSuccess);

      function isAuthenticatedSuccess() {
        $state.go('home');
      }
    }
  }
})();
