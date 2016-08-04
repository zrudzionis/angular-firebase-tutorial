angular.module('angularfireSlackApp')
  .controller('ProfileCtrl', function($state, md5, account, profile) {
    var profileCtrl;

    profileCtrl = this;
    // profile gets injected by resolve in routes
    profileCtrl.profile = profile;
    profileCtrl.updateProfile = updateProfile;

    function updateProfile() {
      profileCtrl.profile.emailHash = md5.createHash(account.email);
      profileCtrl.profile.$save().catch(saveProfileErrorFn);

      function saveProfileErrorFn() {
        console.error('Failed to save profile');
      }
    }
  });
