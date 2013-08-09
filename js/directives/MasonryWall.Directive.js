define(['angular', 'masonry', 'imagesLoaded', 'lodash'], function(angular, Masonry, imagesLoaded, _){

	'use strict';

	/**
	 * Masonry Directive for a wall of item.
	 * This directive is intended to be used along with ng-repeat directive.
	 * This directive should be on each item of the ng-repeat, and hence is on the same scope as the ng-repeat.
	 * You have to pass in a CSS selector parameter into the directive. This parameter has to include a wildcard
	 * that is unique to each item's id. The CSS selector needs to be a class.
	 * For example: ideas_* where * will be replaced by the idea id. 
	 * Then in the class you need class="idea_{{idea.id}}"
	 * 
	 * @param {String} masonryWallDir              Class selector of each item
	 * @param {Object} masonryWallOptions          Optional options that are directly passed into Masonry
	 */
	angular.module('Directives')
		.directive('masonryWallDir', function(){
			return {
				controller: [
					'$scope',
					'$element',
					'$attrs', 
					function($scope, $element, $attrs){

						var itemSelector = $attrs.masonryWallDir;
						var masonryOptions = $scope.$eval($attrs.masonryWallOptions);

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