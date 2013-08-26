define(['angular', 'jquery'], function(angular){

	'use strict';

	angular.module('Directives')
		.directive('pullDownToWindowDir', [
			'$window',
			function($window){
				return {
					scope: true,
					link: function(scope, element, attributes){

						var window = angular.element($window);

						var pullDown = function(){
							var offsetTop = element.offset().top;
							element.css('min-height', window.height() - offsetTop);
						};

						pullDown();
						window.resize(pullDown);

					}
				};
			}
		]);

});