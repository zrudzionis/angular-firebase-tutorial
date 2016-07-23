angular.module('angularfireSlackApp')
.service('Firebase', function(FirebaseConfig) {
    return firebase.initializeApp(FirebaseConfig);
});
