(function () {
  'use strict';

  var redirectToChannelsIfAuthenticated;

  angular
    .module('angularfireSlackApp')
    .config(function ($stateProvider, $urlRouterProvider) {

      $stateProvider
        .state('home', {
          url: '/',
          templateUrl: 'home/home.html',
//          resolve: {
//            novalue: redirectToChannelsIfAuthenticated,
//          },
        })
        .state('login', {
          url: '/login',
          controller: 'AuthCtrl',
          controllerAs: 'authCtrl',
          templateUrl: 'auth/login.html'
        })
        .state('register', {
          url: '/register',
          controller: 'AuthCtrl',
          controllerAs: 'authCtrl',
          templateUrl: 'auth/register.html'
        })
        .state('profile', {
          url: '/profile',
          controller: 'ProfileCtrl',
          controllerAs: 'profileCtrl',
          templateUrl: 'users/profile.html',
          resolve: {
            account: function(Auth) {
              return Auth.getAuthenticatedAccount();
            },
            profile: getProfileFn,
          }
        })
        .state('channels', {
          url: '/channels',
          controller: 'ChannelsCtrl',
          controllerAs: 'channelsCtrl',
          templateUrl: 'channels/index.html',
          resolve: {
            profile: getProfileFn,
            channels: function(Channels) {
              return Channels.$loaded();
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

  function getProfileFn(Auth, Users) {
    var account = Auth.getAuthenticatedAccount();

    return account.then(getAccountSuccessFn);

    function getAccountSuccessFn(account) {
      return Users.ready().then(usersLoadedSuccessFn);

      function usersLoadedSuccessFn(users) {
        return Users.getProfile(account.uid);
      }
    }
  }

  redirectToChannelsIfAuthenticated = function($state, Auth) {
    // if user does not require authentitication promise will be redjected
    return Auth.getAuthenticatedAccount().then(getAccountSuccessFn, getAccountErrorFn);

    function getAccountSuccessFn(account) {
      $state.go('channels');
    }

    function getAccountErrorFn(error) {
      console.error('Failed to authenticate while trying to reach home', error);
    }
  };
})();
