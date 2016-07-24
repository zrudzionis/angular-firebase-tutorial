(function () {
  'use strict';

  var requireNotAuthenticated, homeToChannelsIfAuthenticated;

  angular
    .module('angularfireSlackApp')
    .config(function ($stateProvider, $urlRouterProvider) {

      $stateProvider
        .state('home', {
          url: '/',
          templateUrl: 'home/home.html',
          resolve: homeToChannelsIfAuthenticated,
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
          controller: 'ProfileCtrl',
          controllerAs: 'profileCtrl',
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
        })
        .state('channels', {
          url: '/channels',
          controller: 'ChannelsCtrl',
          controllerAs: 'channelsCtrl',
          templateUrl: 'channels/index.html',
          resolve: {
            channels: function(Channels) {
              return Channels.$loaded();
            },
            profile: function($state, Auth, Users) {
              return Auth.isAuthenticated().then(isAuthenticatedSuccessFn, isAuthenticatedErrorFn);

              function isAuthenticatedSuccessFn(auth) {
                return Users.getProfile(auth.uid).$loaded().then(profileSuccessFn);

                function profileSuccessFn(profile) {
                  if (!profile.displayName) {
                    $state.go('profile');
                  }
                }
              }

              function isAuthenticatedErrorFn(error) {
                console.error('Channels requires authentication.')
                $state.go('home');
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
  };

  homeToChannelsIfAuthenticated = {
      redirectIfAuthenticated: function($state, Auth) {
      // if user does not require authentitication promise will be redjected
      return Auth.isAuthenticated().then(isAuthenticatedSuccess);

      function isAuthenticatedSuccess() {
        $state.go('channels');
      }
    }
  };
})();
