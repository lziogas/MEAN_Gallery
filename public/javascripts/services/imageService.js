app.factory('ImageService',
  ['$http', '$window',
  function ($http, $window) {
  	var data = {
  		scopeIds: []
  	}
 	return {
		getPic: function() {
			var user = $.parseJSON($window.sessionStorage.getItem('user'));
			return $http.get('/images', {
						headers: {
							'x-access-token': $window.sessionStorage.token.toString(),
							'id': user.id 	
						}
					});
		},
		getIds: function() {
			/*var user = $.parseJSON($window.sessionStorage.getItem('user'));
			return $http.get('/images/ids', {
				headers: {
					'x-access-token': $window.sessionStorage.token.toString(),
					'id': user.id 	
				}
			});*/
			
			return data.scopeIds;
		},
		getPicsByCategory: function(name) {
			var user = $.parseJSON($window.sessionStorage.getItem('user'));
		    return $http.get('/categories/byCategory', {
		      headers: {
		        'x-access-token': $window.sessionStorage.token.toString(),
		        'id': user.id,
		        'category-name': name
		      }
		    });
		},
		setIds: function(ids) {
			data.scopeIds = ids;
		}
	}; 	
 }]);;