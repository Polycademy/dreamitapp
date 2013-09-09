define(['angular', 'jquery'], function(angular){

	'use strict';

	/**
	 * This allows clicks on the backdrop of the overlay to close the overlay. But not for the child elements.
	 * Pass in a boolean to overlayCloseDir to activate or disactivate this.
	 * Pass in overlayCloseFunc as the function to be called when the parent element is clicked.
	 */
	angular.module('Directives')
		.directive('overlayCloseDir', 
			function(){
				return {
					link: function(scope, element, attributes){

						attributes.$observe('overlayCloseDir', function(value){

							if(value || typeof value === 'undefined'){

								element.parent().click(function(){
									scope.$apply(attributes.overlayCloseFunc);
								}).children().click(function(event){
									event.stopPropagation();
								});

							}

						});

					}
				};
			}
		);

});