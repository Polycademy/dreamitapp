define(['angular'], function(angular){

	'use strict';

	angular.module('Directives')
		.directive('compileDir', [
			'$compile',
			function($compile){
				return {
					link: function(scope, element, attributes){

						scope.$watch(function(){
							return scope.$eval(attributes.compileDir);
						}, function(value){
							// compile the new DOM and link it to the current scope.
							// NOTE: we only compile .childNodes so that
							// we don't get into infinite loop compiling ourselves
							element.html(value);
							$compile(element.contents())(scope);
						});

					}
				};
			}
		]);

});