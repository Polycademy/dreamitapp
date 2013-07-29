define(['angular', 'masonry', 'imagesLoaded'], function(angular, Masonry, imagesLoaded){

	'use strict';

	/**
	 * Masonry Directive for the Wall of items
	 */
	angular.module('Directives')
		.directive('masonryWallDir', [
			'$timeout',
			function($timeout){
				return {
					scope: true,
					link: function(scope, element, attributes){
						
						//ng-repeat runs too slow, we need to wait for it too finish
						//it will also apply() afterwards
						$timeout(function(){

							//masonry requires the raw element
							var masonry = new Masonry(element[0], {
								itemSelector: '.item_panel',
								gutter: 0,
								isInitLayout: false,
								transitionDuration: '0.3s'
							});

							//waits for images to load fully
							imagesLoaded(element, function(){
								masonry.layout();
							});

							//bind to window resize
							masonry.bindResize();

							//also needs to recall layout() everytime new elements come in
							//from infinite scroll!

						}, 0);

					}
				};
			}
		]);

});