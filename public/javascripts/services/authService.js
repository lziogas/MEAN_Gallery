app.factory('AuthService',
  ['$q', '$timeout', '$http', '$window',
  function ($q, $timeout, $http, $window) {

    // create user variable
    var user = null;

    // return available functions for use in controllers
    return ({
      isLoggedIn: isLoggedIn,
      getUserStatus: getUserStatus,
      login: login,
      logout: logout
    });

function isLoggedIn() {
  if(user) {
    return true;
  } else {
    return false;
  }
}

function getUserStatus() {
  return user;
}

function login(username, password) {
  
  // create a new instance of deferred
  var deferred = $q.defer();

  // send a post request to the server
  $http.post('/auth/login', {username: username, password: password})
    // handle success
    .success(function (data, status) {
      if(status === 200){
      	$window.sessionStorage.token = data.token;
        user = true;
        $window.sessionStorage.setItem('user', JSON.stringify(data.user));
        deferred.resolve();
      } else {
        user = false;
        deferred.reject();
      }
    })
    // handle error
    .error(function (data) {
      user = false;
      deferred.reject();
    });

  // return promise object
  return deferred.promise;

}

function logout() {

  // create a new instance of deferred
  var deferred = $q.defer();

  // send a get request to the server
  $http.get('/user/logout')
    // handle success
    .success(function (data) {
      user = false;
      deferred.resolve();
    })
    // handle error
    .error(function (data) {
      user = false;
      deferred.reject();
    });

  // return promise object
  return deferred.promise;

}

}]);

