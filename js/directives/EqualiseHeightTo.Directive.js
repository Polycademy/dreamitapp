/*
	Equalises height of the current element to a target element.
	This uses the jquery-resize plugin along with jquery.
	It means the current element will always be bound the target element.
 */
define(['angular', 'jquery-resize'], function(angular){

	'use strict';

	angular.module('Directives')
		.directive('equaliseHeightToDir', [
			function(){
				return {
					scope: true,
					link: function(scope, element, attributes){

						var target = angular.element(attributes.equaliseHeightToDir);

						var equaliseHeightToTarget = function(){
							element.height(target.height());
						};

						//bind to the element's resize
						angular.element(attributes.equaliseHeightToDir).resize(function(){
							equaliseHeightToTarget();
						});
					
					}
				};
			}
		]);

});