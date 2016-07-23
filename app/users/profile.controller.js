angular.module('angularfireSlackApp')
  .service('ProfileCtrl', function($state, md5, auth, profile) {
    var profileCtrl;

    profileCtrl = this;
    // profile gets injected by resolve in routes
    profileCtrl.profile = profile;
    profileCtrl.updateProfile = updateProfile;

    function updateProfile() {
      profileCtrl.profile.emailHash = md5.createHash(auth.email);
      profileCtrl.profile.$save();
    }
  });
