define(['angular', 'jquery'], function(angular){

	'use strict';

	/**
	 * This allows clicks on the backdrop of the overlay to close the overlay. But not for the child elements.
	 * Not really portable because it relies on closeOverlay being defined on the parent controller.
	 */
	angular.module('Directives')
		.directive('overlayDir', 
			function(){
				return {
					link: function(scope, element, attributes){

						element.parent().click(function(){
							scope.closeOverlay();
						}).children().click(function(event){
							event.stopPropagation();
						});

					}
				};
			}
		);

});