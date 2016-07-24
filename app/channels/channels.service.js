angular.module('angularfireSlackApp')
  .factory('Channels', function($firebaseArray, Firebase) {
    var channels, channelsRef;

    channelsRef = Firebase.database().ref().child('channels');
    channels = $firebaseArray(channelsRef);

    return channels;
  });
