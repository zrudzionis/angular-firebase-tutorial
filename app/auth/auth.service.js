angular.module('angularfireSlackApp')
  .service('Auth', function($state, $firebaseAuth, $firebaseObject, Firebase) {
    var auth, firebaseAuth;

    firebaseAuth = $firebaseAuth(Firebase.auth());

    Auth = {
      getAuthenticatedAccount: getAuthenticatedAccount,
      register: register,
      login: login,
      unauthenticate: unauthenticate,
      logout: logout,
      onAuthStateChanged: onAuthStateChanged,
    };

    Auth.onAuthStateChanged(function(account) {
      if (account) {
        $state.go('channels');
      }else {
        $state.go('home');
      }
    });

    return Auth;

    function onAuthStateChanged(onAuthStateChangedFn) {
      firebaseAuth.$onAuthStateChanged(onAuthStateChangedFn);
    }

    function getApi() {
      return firebaseAuth;
    }

    function getAuthenticatedAccount() {
      return getApi().$requireSignIn()
    }

    function unauthenticate() {
      return getApi().$signOut();
    }

    function login(account) {
      return getApi()
        .$signInWithEmailAndPassword(account.email, account.password)
        .then(loginSuccessFn, loginErrorFn);

      function loginSuccessFn(account) {
        return account;
      }

      function loginErrorFn(error) {
        console.error('Failed to login. Error:', error);
      }
    }

    function register(account) {
      return getApi()
        .$createUserWithEmailAndPassword(account.email, account.password)
        .then(registerSuccessFn, registerErrorFn);

      function registerSuccessFn() {
        Auth.login(account);
      }

      function registerErrorFn(error) {
        console.error('Failed to register. Error:', error);
      }
    }

    function logout() {
      Auth.unauthenticate();
    }
  });
