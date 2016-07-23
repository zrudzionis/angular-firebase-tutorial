angular.module('angularfireSlackApp')
  .service('Users', function($firebaseArray, $firebaseObject, Firebase) {
    var users, Users, usersRef;

    usersRef = Firebase.database().ref().child('users');
    users = $firebaseArray(usersRef);
    Users = {
      getProfile: getProfile,
      getDisplayName: getDisplayName,
      all: all,
      getGravatar: getGravatar,
    };

    return Users;

    function getProfile(uid) {
      return $firebaseObject(usersRef.child(uid));
    }

    function getDisplayName(uid) {
      return users.$getRecord(uid).displayName;
    }

    function all() {
      return users;
    }

    function getGravatar(uid) {
      return '//www.gravatar.com/avatar/' + users.$getRecord(uid).emailHash;
    }
  });
