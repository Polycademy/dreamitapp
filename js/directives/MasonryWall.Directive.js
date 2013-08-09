define(['angular', 'masonry', 'imagesLoaded', 'lodash'], function(angular, Masonry, imagesLoaded, _){

	'use strict';

	/**
	 * Masonry Directive for a wall of item.
	 * This directive is intended to be used along with ng-repeat directive.
	 * Put masonryWallDir on the container element and pass in a class selector for each item to be layed out.
	 * Put the masonryItemDir next to ng-repeat directive on the item to be repeated.
	 * Pass in optional options via masonryWallOptions.
	 * You're done!
	 * 
	 * @param {String} masonryWallDir     Class selector of each item
	 * @param {Object} masonryWallOptions Optional options that are directly passed into Masonry
	 */
	angular.module('Directives')
		.directive('masonryWallDir', function(){
			return {
				controller: [
					'$scope',
					'$element',
					'$attrs', 
					function($scope, $element, $attrs){

						var itemSelector,
							masonryOptions;

						$attrs.$observe('masonryWallDir', function(value){
							itemSelector = value;
						});
						masonryOptions = $scope.$eval($attrs.masonryWallOptions);

						//place holder for masonry to be setup and shared across all ng-repeat directive scopes
						this.masonry = {};

						//this element will contain the masonry
						this.wallContainer = $element;

						//we have some default options
						//then overwrite with passed in options
						//then overwrite with the necessary options
						this.masonryOptions = _.assign(
							{
								gutter: 0,
								transitionDuration: '0.3s'
							},
							masonryOptions,
							{
								itemSelector: itemSelector,
								isInitLayout: false
							}
						);

						//this will be set to true upon the initilisation of masonry
						this.masonryInitialised = false;

					}
				]
			};
		})
		.directive('masonryItemDir', [
			'UtilitiesServ',
			function(UtilitiesServ){
				return {
					scope: true,
					require: '^masonryWallDir',
					link: function(scope, element, attributes, masonryWallDirCtrl){

						//we only run this once when we are in the "last" element of the first iteration
						if(!masonryWallDirCtrl.masonryInitialised && scope.$last){

							//masonry is designed for the parent container
							masonryWallDirCtrl.masonry = new Masonry(
								masonryWallDirCtrl.wallContainer[0], 
								masonryWallDirCtrl.masonryOptions
							);

							//wait for all the images to load before laying out all the items
							imagesLoaded(masonryWallDirCtrl.wallContainer, function(){
								masonryWallDirCtrl.masonry.layout();
							});

							//bind masonry to window resizing
							masonryWallDirCtrl.masonry.bindResize();

							//ok the initial setup is done, we don't want redo this
							masonryWallDirCtrl.masonryInitialised = true;

						}else if(masonryWallDirCtrl.masonryInitialised){

							//this runs on each subsequent iteration of the ng-repeat
							//and only after masonry has been initialised
							imagesLoaded(element, function(){
								masonryWallDirCtrl.masonry.appended(element);
							});

						}

					}
				};
			}
		]);

});