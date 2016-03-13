app.controller('DropdownCtrl', ['$scope', '$http', '$window', function($scope, $http, $window){

  $scope.$on("getCategories", function (event) {
     $scope.getCategories();
  });

  $scope.getCategories = function() {
    var user = $.parseJSON($window.sessionStorage.getItem('user'));
    $http.get('/categories', {
      headers: {
        'x-access-token': $window.sessionStorage.token.toString(),
        'id': user.id   
      }
    })
    .success(function(data) {
      $scope.items = data.categories;
    })
    .error(function() {
      console.log("Can't get categories");
    });
  };

  $scope.toggleDropdown = function($event) {
    $event.preventDefault();
    $event.stopPropagation();
    $scope.status.isopen = !$scope.status.isopen;
  };

  $scope.appendToEl = angular.element(document.querySelector('#dropdown-long-content'));
  $scope.getCategories();		
}]);