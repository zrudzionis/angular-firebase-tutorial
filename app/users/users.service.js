angular.module('angularfireSlackApp')
  .service('Users', function($firebaseArray, $firebaseObject, Firebase) {
    var Users;
    // TODO this service can be used only when user is authenticated how we can make is better?
    Users = {
      getProfile: getProfile,
      getDisplayName: getDisplayName,
      all: all,
      getGravatar: getGravatar,
    };


    function getUsersRef() {
      return Firebase.database().ref().child('users');
    }

    function all() {
      return $firebaseArray(getUsersRef());
    }

    function getProfile(uid) {
      return $firebaseObject(getUsersRef().child(uid));
    }

    function getDisplayName(uid) {
      return Users.all().$getRecord(uid).displayName;
    }


    function getGravatar(uid) {
      return '//www.gravatar.com/avatar/' + Users.all().$getRecord(uid).emailHash;
    }

    return Users;
  });
