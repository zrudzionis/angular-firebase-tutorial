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
                  return profile;
                }
              }

              function isAuthenticatedErrorFn(error) {
                console.error('Channels requires authentication.')
                $state.go('home');
              }
            }
          }
        })
        .state('channels.create', {
          url: '/create',
          controller: 'ChannelsCtrl',
          controllerAs: 'channelsCtrl',
          templateUrl: 'channels/create.html',
        })
        ;

      $urlRouterProvider.otherwise('/');
    });

  requireNotAuthenticated = {
    redirectIfAuthenticated: function($state, Auth) {
      // if user does not require authentitication promise will be redjected
      return Auth.isAuthenticated().then(isAuthenticatedSuccessFn, isAuthenticatedErrorFn);

      function isAuthenticatedSuccessFn(profile) {
        $state.go('home');
      }

      function isAuthenticatedErrorFn(error) {
        return;
      }
    }
  };

  homeToChannelsIfAuthenticated = {
      redirectIfAuthenticated: function($state, Auth) {
      // if user does not require authentitication promise will be redjected
      return Auth.isAuthenticated().then(isAuthenticatedSuccessFn, isAuthenticatedErrorFn);

      function isAuthenticatedSuccessFn() {
        $state.go('channels');
      }

      function isAuthenticatedErrorFn(error) {
        console.error('Failed to authenticate while trying to reach home', error);
      }
    }
  };
})();
