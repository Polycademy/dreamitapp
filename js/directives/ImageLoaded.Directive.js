define(['angular'], function(angular){

	'use strict';

	angular.module('Directives')
		.directive('imageLoadedDir', [
			'$rootScope',
			function($rootScope){
				return {
					link: function(scope, element, attributes){

						var eventName = attributes.imageLoadedDir;

						element.bind('load', function(){
							$rootScope.$broadcast(eventName);
						});

					}
				};
			}
		]);

});