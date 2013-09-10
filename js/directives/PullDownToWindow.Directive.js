define(['angular', 'jquery'], function(angular){

	'use strict';

	angular.module('Directives')
		.directive('pullDownToWindowDir', [
			'$window',
			'$timeout',
			function($window, $timeout){
				return {
					link: function(scope, element, attributes){

						var window = angular.element($window);

						var pullDown = function(){
							$timeout(function(){
								var offsetTop = element.offset().top;
								element.css('min-height', window.height() - offsetTop);
							}, 0);
						};

						pullDown();
						window.resize(pullDown);

					}
				};
			}
		]);

});