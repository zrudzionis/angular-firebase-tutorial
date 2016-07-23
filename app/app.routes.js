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
        });

      $urlRouterProvider.otherwise('/');
    });

  requireNotAuthenticated = {
    redirectIfAuthenticated: function($state, Auth) {
      // if user does not require authentitication promise will be redjected
      return Auth.$requireSignIn().then(isAuthenticatedSuccess, isAuthenticatedError);

      function isAuthenticatedSuccess() {
        $state.go('home');
      }

      function isAuthenticatedError() {
        return;
      }
    }
  }
})();
