define(['angular', 'jquery'], function(angular){

	'use strict';

	/**
	 * This just shows the share button when the mouse is over the image. Otherwise it doesn't.
	 */
	angular.module('Directives')
		.directive('shareButtonDir', 
			function(){
				return {
					link: function(scope, element, attributes){

						element.hide();

						element.parent().hover(function(){

							element.fadeIn();

						}, function(){

							element.fadeOut();

						});

					}
				};
			}
		);

});