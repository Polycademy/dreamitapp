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
						
						//ng-repeat runs too slow (it runs after the masonry)
						//we need to wait for ng-repeat too finish, then apply masonry (by putting at the end of the exe loop)
						//another method is to put this on the ng-repeat at a lower priority, then running this once
						//via a class designation (see: http://jsfiddle.net/Dz5uT/14/)
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
							scope.$watch(scope.appIdeas, function(){
								masonry.layout();
							});

							console.log(scope);

						}, 0);

					}
				};
			}
		]);

});