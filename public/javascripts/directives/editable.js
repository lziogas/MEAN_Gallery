app.directive('editable', function(){
	// Runs during compile
	return {
		require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
		restrict: 'A',
		link: function($scope, iElm, iAttrs, ngModel) {

			ngModel.$render = function() {
                iElm.text(ngModel.$viewValue || '');
            };

            iElm.dblclick(function() {
                $(this).attr("contentEditable", "true");
                $(this).focus();
            });
            
             // handling "return/enter" and "escape" key press
            iElm.bind('keydown', function(event) {
                var keycode = (event.keyCode ? event.keyCode : event.which);
                // on "enter" set "contentEditable" to "false" to make field not-editable again
                // and call "read" method which is responsible for setting new value to the object in ngModel
                if (keycode === 13) { // ENTER
                    $(this).attr("contentEditable", "false");
                    $(this).blur();
                    event.preventDefault();
                    read();
                }
                // on "escape"and set the text in the element back to the original value
                // and set "contentEditable" to "false" to make field not-editable again
                if (keycode === 27) { // ESCAPE
                    iElm.text(ngModel.$viewValue);
                    $(this).attr("contentEditable", "false");
                    $(this).blur();
                }

                function read() {
	                var text = iElm.text();
	                ngModel.$setViewValue(text);
            	}

            });

		}
	};
});