app.controller('authCtrl', ['$scope', '$http', '$location', '$rootScope', '$window', 'AuthService', 'ImageService', '$routeParams',
	function($scope, $http, $location, $rootScope, $window, AuthService, ImageService, $routeParams){
		
		$scope.user = {username:'',password:''};
		$scope.alert = '';
		$rootScope.logged = $window.sessionStorage.getItem('user');

		$scope.$on("getImages", function (event) {
		   $scope.getPic();
		});

		$scope.login = function(user) {
			AuthService.login(user.username, user.password)
		        // handle success
		        .then(function () {
		          $location.path('/gallery');
		        })
		        // handle error
		        .catch(function () {
		          $scope.alert = "Invalid username and/or password";
		        });
		};

		$scope.signup = function(user) {
			$http.post('/auth/signup', user)
				.success(function(data) {
					$scope.alert = data.alert;
				})
				.error(function() {
					$scope.alert = 'Registration failed'
				})
		};

    	$scope.logout = function(){
	        $http.get('/auth/logout')
	            .success(function() {
	                $location.path('/login');
	                delete $window.sessionStorage.token;
	                delete $window.sessionStorage.user;
	            })
	            .error(function() {
	                $scope.alert = 'Logout failed'
	            });
    	};	

    	$scope.getPic = function() {
    		if ($routeParams.categoryName === undefined) {
	    		ImageService.getPic()
	    			.success(function(data) {
	    				$scope.imageList = data.images;
	    				setIds(data.images);
	    			})
	    			.error(function(res) {
	    				$scope.alert = 'Failed to load images';
	    			});
    		} else {
    			ImageService.getPicsByCategory(decodeURIComponent($routeParams.categoryName))
    				.success(function(data){
    					$scope.imageList = data.images;
    					setIds(data.images);
    				})
    				.error(function(res){
    					$scope.alert = 'Failed to load images';
    				});
    		}
    	};

    	function setIds(images) {
    		var ids = [];
    		for (k in images) {
    			ids.push(images[k]._id);
    		}
    		ImageService.setIds(ids);	
    	}

}]);