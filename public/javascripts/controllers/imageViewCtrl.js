app.controller('imageViewCtrl', ['$scope', '$http', '$routeParams', '$window', '$location', 'ImageService', '$rootScope',
	function($scope, $http, $routeParams, $window, $location, ImageService, $rootScope){
	
	$scope.init = function() {
		$scope.getImage();
	};

	$scope.getIds = function() {
		/*ImageService.getIds()
			.success(function(data) {
				$scope.imgIds = data.imageIds;
				$scope.showPrev = $scope.imgIds[0] !== $scope.image._id ? true : false;
			})
			.error(function(res) {
				$scope.alert = 'Failed to load images';
			});*/
		$scope.imgIds = ImageService.getIds();
		$scope.showPrev = $scope.imgIds[0] !== $scope.image._id ? true : false;
	};

	$scope.getImage = function(id) {
		var imgId = id === undefined ? $routeParams.id : id;
		var user = $.parseJSON($window.sessionStorage.getItem('user'));
	    $http.get('/images/' + imgId, {
			headers: {
				'x-access-token': $window.sessionStorage.token.toString(),
				'id': user.id 	
			}
		})
		.success(function(data) {
			$scope.image = data.image;
			$scope.tags = data.image.tags;
			$scope.currentId = data.image._id;
			$scope.getIds();
		});
	};

	$scope.deletePic = function() {
		$http.delete('/images/' + $scope.image._id, {
			headers: {
				'x-access-token': $window.sessionStorage.token.toString(),
			}
		})
		.success(function(data){
			$location.path('/gallery');
		})
		.error(function() {
			$scope.alert = 'Failed to delete an image';
		}); 
	};
	
  	$scope.updateImage = function(image) {
		$http.put('/images/' + $scope.image._id, {
			name: image,
			token: $window.sessionStorage.token.toString()
		})
		.success(function(data) {
			console.log("Img updated");
		})
		.error(function(data) {
			console.log("error updating");
		});	 
  	};

  	$scope.createTag = function(tag) {
  		if ($scope.tags.indexOf(tag) >= 0 || tag.indexOf(" ") >= 0) {
  			$scope.alert = "Wrong Tag, it has to be one word and original";
  		} else {
  			$http.put('/images/' + $scope.image._id, {
				tag: tag,
				token: $window.sessionStorage.token.toString()
			})
			.success(function(data) {
				$scope.newtag = null;
				$scope.getImage();
			})
			.error(function(data) {
				console.log("error updating");
			}); 	
  		}
  	};

  	$scope.updateTag = function(tag, index) {
  		if (tag.indexOf(" ") >= 0) {
  			$scope.alert = "tag has to be one word!";
  		} else {
  			$scope.tags[index] = tag;
			$http.put('/images/' + $scope.image._id, {
				tags: $scope.tags,
				token: $window.sessionStorage.token.toString()
			})
			.success(function(data) {
				$scope.getImage();
			})
			.error(function(data) {
				console.log("error updating");
			}); 	
  		}	
  	};

  	$scope.deleteTag = function(tag) {
  		$http.put('/images/' + $scope.image._id, {
  				delete: true,
				tag: tag,
				token: $window.sessionStorage.token.toString()
			})
			.success(function(data) {
				$scope.getImage();
			})
			.error(function(data) {
				$scope.alert = "Can't delete tag!";
			}); 
  	}; 

  	$scope.next = function() {
  		var currIndex = $scope.imgIds.indexOf($scope.currentId);
  		var lastIndex = $scope.imgIds.length - 1;
  		var nextId;
  		if (currIndex == lastIndex) {
  			nextId = $scope.imgIds[0]
  		} else {
  			nextId = $scope.imgIds[currIndex + 1];	
  		}
  		$location.path('/image/' + nextId);
  	};

  	$scope.prev = function() {
  		var currIndex = $scope.imgIds.indexOf($scope.currentId);
  		var lastIndex = $scope.imgIds.length - 1;
  		var prevId = currIndex - 1;
  		$location.path('/image/' + $scope.imgIds[prevId]);
  	};

  	$scope.open = function() {

  	}

}]);