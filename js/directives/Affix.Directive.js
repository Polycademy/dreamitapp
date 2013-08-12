define(['angular', 'lodash', 'jquery'], function(angular, _){

	'use strict';

	angular.module('Directives')
		.directive('affix', [
			'$window',
			'$document',
			'$timeout',
			function($window, $document, $timeout){
				return {
					link: function(scope, element, attributes){

						var win = angular.element($window),
							affixed;

						var affixPosition = function(){

							var offset = scope.$eval(attributes.affix),
								affix = win.prop('pageYOffset') <= offset ? 'top' : false;

							if(affixed === affix) return;

							affixed = affix;

							element
								.removeClass('affix affix-top')
								.addClass('affix' + (affix ? '-' + affix : ''));

						};

						var throttled = _.throttle(affixPosition, 300);

						win.bind('scroll', throttled);

						win.bind('click', function(){
							$timeout(affixPosition, 1);
						});

					}
				};
			}
		]);

});