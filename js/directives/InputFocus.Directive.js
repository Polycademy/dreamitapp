define(['angular'], function(angular){

	'use strict';

	angular.module('Directives')
		.directive('inputFocusDir', [
			'$timeout',
			function($timeout){
				return {
					link: function(scope, element, attributes){

						scope.$watch(attributes.inputFocusDir, function ( val ) {
							if(angular.isDefined(val) && val){
								$timeout( function () { element[0].focus(); } );
							}
						}, true);

					}
				};
			}
		]);

});