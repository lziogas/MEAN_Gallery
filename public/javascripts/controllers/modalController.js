app.controller('ModalCtrl', function ($scope, $uibModal, $log, $window, $http, $rootScope) {
  $scope.animationsEnabled = true;
  $scope.open = function (type) {
    if (type == "upload") {
      var modalInstance = $uibModal.open({
        animation: $scope.animationsEnabled,
        templateUrl: '../../partials/modalContent.html',
        controller: 'ModalInstanceCtrl'
      });    
    } else if (type == "newCategory") {
      var modalInstance = $uibModal.open({
        animation: $scope.animationsEnabled,
        templateUrl: '../../partials/newCategoryModal.html',
        controller: 'ModalInstanceCtrl'
      });     
    } else if (type == "addCategory") {
      var modalInstance = $uibModal.open({
        animation: $scope.animationsEnabled,
        templateUrl: '../../partials/addCategoryModal.html',
        controller: 'ModalInstanceCtrl'
      });
    }
  };

  $scope.toggleAnimation = function () {
    $scope.animationsEnabled = !$scope.animationsEnabled;
  };

});

app.controller('ModalInstanceCtrl', function ($scope, $uibModalInstance, $window, Upload, $rootScope, $http, $routeParams) {

  $scope.image = {imageName:'',tags:''};

  $scope.getModalCategories = function() {
    var user = $.parseJSON($window.sessionStorage.getItem('user'));
    $http.get('/categories', {
      headers: {
        'x-access-token': $window.sessionStorage.token.toString(),
        'id': user.id   
      }
    })
    .success(function(data) {
      $scope.categories = data.categories;
    })
    .error(function() {
      console.log("Can't get categories");
    });
  };

  $scope.getModalCategories();

  $scope.uploadPic = function(file, image) {
    var user = $.parseJSON($window.sessionStorage.getItem('user'));
    Upload.upload({
        url: '/images/upload',
        method: 'POST',
        data: {
          username: user.username,
          id: user.id,
          imageName: image.imageName,
          tags: image.tags
        },
        file: file
    }).then(function (resp) {
            $scope.cancel();
            $rootScope.$broadcast('getImages');
        }, function (resp) {
            alert('Error status: ' + resp.status);
        });
  };

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };

  $scope.selectedCategories = []; 

  $scope.addImage = function () {
    var user = $.parseJSON($window.sessionStorage.getItem('user'));
    $http.put("/categories/", {categories: $scope.selectedCategories, imageId: $routeParams.id}, {
      headers: {
        'x-access-token': $window.sessionStorage.token.toString()  
      }
    })
    .success(function() {
      $scope.cancel();
    }).error(function() {
      console.log("Error adding to category");
    });
  };

  $scope.addCategory = function (name) {
    var user = $.parseJSON($window.sessionStorage.getItem('user'));
    $http.post("/categories/add", {name: name, id: user.id}, {
      headers: {
          'x-access-token': $window.sessionStorage.token.toString() 
        }
    })
    .success(function() {
      $scope.cancel();
      $rootScope.$broadcast('getCategories');
    }).error(function() {
      console.log("Error creating new category");
    });
  };

  $scope.selectCategory = function(bool, category) {
    if(bool){
      $scope.selectedCategories.push(category);
    } else {
      var index = $scope.selectedCategories.indexOf(category);
      $scope.selectedCategories.splice(index, 1);     
    }
  };

});