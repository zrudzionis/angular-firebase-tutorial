angular.module('angularfireSlackApp')
  .service('Users', function($q, $firebaseArray, $firebaseObject, Firebase, Auth) {
    var Users, usersRef, users;

    Users = {
      getProfile: getProfile,
      getDisplayName: getDisplayName,
      all: all,
      getGravatar: getGravatar,
      ready: ready,
    };

    activate();

    return Users;

    function activate() {
      usersRef = Firebase.database().ref().child('users');
      users = null;
      Auth.onAuthStateChanged(onAuthStateChanged);
    }

    function onAuthStateChanged(account) {
      if (!account && users !== null) {
        users.$destroy();
        users = null;
      }
    }

    function ready() {
      var usersPromise, deferred;

      if (users !== null) {
        deferred = $q.defer();
        deferred.resolve(users);
        usersPromise = deferred.promise;
      }else {
        usersPromise = $firebaseArray(usersRef).$loaded().then(usersLoadedSuccessFn);
      }

      return usersPromise;

      function usersLoadedSuccessFn(loadedUsers) {
        users = loadedUsers;
        return users;
      }
    }

    function all() {
      return users;
    }

    function getProfile(uid) {
      return users.$getRecord(uid);
    }

    function getDisplayName(uid) {
      return users.$getRecord(uid).displayName;
    }

    function getGravatar(uid) {
      return '//www.gravatar.com/avatar/' + users.$getRecord(uid).emailHash;
    }
  });
