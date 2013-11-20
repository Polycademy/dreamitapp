define(['angular'], function(angular){

	'use strict';

	angular.module('Directives')
		.directive('rotatingAdvertsDir', [
			'$timeout',
			function($timeout){
				return {
					link: function(scope, element, attributes){

						var iterator = attributes.rotatingAdvertsDir;
						var between = attributes.rotateBetween.split(':');

						var randomFromInterval = function(from, to){
							from = parseInt(from);
							to = parseInt(to);
							return Math.floor(Math.random()*(to-from+1)+from);
						};

						scope[iterator] = randomFromInterval(between[0], between[1]);

						(function switchAdvert(){
							setTimeout(function(){
								scope[iterator] = randomFromInterval(between[0], between[1]);
								switchAdvert();
							}, 5000);
						})();

					}
				};
			}
		]);

});