angular.module('angularfireSlackApp')
  .service('Auth', function($state, $firebaseAuth, Firebase) {
    var auth, firebaseAuth;

    firebaseAuth = $firebaseAuth(Firebase.auth());

    Auth = {
//      setAuthenticatedAccount: setAuthenticatedAccount,
      getAuthenticatedAccount: getAuthenticatedAccount,
      register: register,
      login: login,
      isAuthenticated: isAuthenticated,
      unauthenticate: unauthenticate,
      logout: logout
    };

    return Auth;


    function getApi() {
      return firebaseAuth;
    }
//
//    function setAuthenticatedAccount(account) {
//      $cookies.authenticatedAccount = JSON.stringify(account);
//    }

    function getAuthenticatedAccount() {
      var account = $cookies.authenticatedAccount;

      if (!!account) {
        return JSON.parse(account);
      }
    }

    function isAuthenticated() {
      return getApi().$requireSignIn();
    }

    function unauthenticate() {
      return getApi().$signOut();
    }

    function login(account) {
      getApi().$signInWithEmailAndPassword(account.email, account.password).then(loginSuccessFn, loginErrorFn);

      function loginSuccessFn() {
//        Auth.setAuthenticatedAccount(account);
        $state.go('home');
      }

      function loginErrorFn(error) {
        console.error('Failed to login. Error:', error);
      }
    }

    function register(account) {
      return getApi().$createUserWithEmailAndPassword(account.email, account.password)
        .then(registerSuccessFn, registerErrorFn);

      function registerSuccessFn() {
        Auth.login(account);
      }

      function registerErrorFn(error) {
        console.error('Failed to register. Error:', error);
      }
    }

    function logout() {
      return Auth.unauthenticate().then(logoutSuccessFn, logoutErrorFn);

      function logoutSuccessFn(data, status, headers, config) {
        $state.go('home');
      }

      function logoutErrorFn(data, status, headers, config) {
        console.error('Failed to logout. Error:', status);
      }
    }
  });
