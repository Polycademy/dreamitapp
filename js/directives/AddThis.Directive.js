define(['angular', 'addthis'], function(angular, addthis){

	'use strict';

	angular.module('Directives')
		.directive('addThisDir', function(){
			return {
				scope: true,
				link: function(scope, element, attributes){

					//use addthis.button(element, {}, {}) to make this work for dynamic elements

				}
			};
		});

});