angular.module('angularfireSlackApp')
  .controller('ChannelsCtrl', function($state, Auth, Users, profile, channels) {
    var channelsCtrl;

    channelsCtrl = this;
    // profile gets injected by resolve in routes
    channelsCtrl.profile = profile;
    channelsCtrl.channels = channels;
    channelsCtrl.getDisplayName = Users.getDisplayName;
    channelsCtrl.getGravatar = Users.getGravatar;
    channelsCtrl.logout = Auth.logout;
    channelsCtrl.newChannel = {
      name: '',
    };
    channelsCtrl.createChannel = createChannel;

    function createChannel() {
      channelsCtrl.channels.$add(channelsCtrl.newChannel).then(createChannelSuccessFn, createChannelErrorFn);

      function createChannelSuccessFn() {
          channelsCtrl.newChannel = {
            name: ''
          };
      }

      function createChannelErrorFn(error) {
        console.error('Failed to create channel. Error:', error);
      }
    }
  });
