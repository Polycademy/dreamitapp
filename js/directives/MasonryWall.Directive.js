define(['angular', 'masonry', 'imagesLoaded'], function(angular, Masonry, imagesLoaded){

	'use strict';

	/**
	 * Masonry Directive for the Wall of items
	 */
	angular.module('Directives')
		.directive('masonryWallDir', [
			function(){
				return {
					scope: {},
					link: function(scope, element, attributes){

						//this will be executed on page load
						var masonry = new Masonry(element, {
							itemSelector: '.item_panel',
							gutter: 0,
							//isInitLayout: false //this may not be required, test it with other methods
						});

						//re-execute this each time new elements come in via the ng-repeat (and window.resize or whenever size changes)
						//make sure images are loaded before executing masonry
						imagesLoaded(element, function(){
							masonry.layout();
						});

						//btw remember this needs to be recalled when new elements enter via the ng-repeat!
					
					}
				};
			}
		]);

});