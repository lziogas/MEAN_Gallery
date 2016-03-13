var app = angular.module('galleryApp', ['ngRoute', 'ngCookies', 'ngFileUpload', 'ui.bootstrap']);

app.run(['$rootScope', '$location', '$route', 'AuthService', '$window', 
	function($rootScope, $location, $route, AuthService, $window){
	$rootScope.$on('$routeChangeStart', function (event, next, current) {
    if (next.access.restricted && AuthService.isLoggedIn() === false && !$window.sessionStorage.token) {
      $location.path('/login');
    }
  });
}]);

app.config(function(
	$routeProvider, 
	$locationProvider) {

	$routeProvider
	.when('/', {
		templateUrl: '/partials/main.html',
		access: {restricted: false}
	})
	.when('/signup', {
		templateUrl: '/partials/signup.html',
		controller: 'authCtrl',
		access: {restricted: false}
	})
	.when('/login', {
		templateUrl: '/partials/login.html',
		controller: 'authCtrl',
		access: {restricted: false}
	})
	.when('/gallery', {
        templateUrl: '/partials/gallery.html',
        controller: 'authCtrl',
        access: {restricted: true}
    })
    .when('/image/:id', {
    	templateUrl: '/partials/imageView.html',
        controller: 'imageViewCtrl',
        access: {restricted: true}	
    })
    .when('/:categoryName', {
        templateUrl: '/partials/gallery.html',
        controller: 'authCtrl',
        access: {restricted: true}
    })
	.otherwise({
		redirectTo: '/'
	});

	$locationProvider.html5Mode(true);

});