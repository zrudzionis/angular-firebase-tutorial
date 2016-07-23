angular.module('angularfireSlackApp')
  .controller('AuthCtrl', function(Auth, $state) {
    var authCtrl, user;

    authCtrl = this;
    authCtrl.account = {email: '', password: ''};
    authCtrl.login = login;
    authCtrl.register = register;

    function login() {
      Auth.login(authCtrl.account);
    }

    function register() {
      Auth.register(authCtrl.account);
    }
  });
