define(['angular'], function(angular){

	'use strict';

	angular.module('Directives')
		.directive('asyncAnchorDir', [
			'$location',
			'$anchorScroll',
			'$timeout',
			function($location, $anchorScroll, $timeout){
				return {
					link: function(scope, element, attributes){

						var id = attributes.asyncAnchorDir || attributes.id || attributes.name;
						var delay = attributes.asyncAnchorDelay;
						var eventName = attributes.asyncAnchorEvent;

						var scrollToHash = function(hash){

							if(id && hash && id === hash){

								if(delay){
									$timeout(function(){
										$anchorScroll();
									}, delay);
								}else{
									$anchorScroll();
								}

							}

						};

						if(eventName){

							scope.$on(eventName, function(){

								scrollToHash($location.hash());

							});

						}

						scope.$watch(function(){

							return $location.hash();
						
						}, function(hash){

							scrollToHash(hash);

						});

					}
				};
			}
		]);

});