define(['angular', 'masonry', 'imagesLoaded', 'lodash', 'jquery'], function(angular, Masonry, imagesLoaded, _){

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
	 * @param {String} masonryWallDir              Reference to collection
	 * @param {String} masonryWallSelector         Class selector of each item
	 * @param {String} masonryWallAppendedSelector Class selector of each item with a unique wildcard
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

						this.wallContainer = $element;
						this.collection = $attrs.masonryWallDir;
						this.itemSelector = $attrs.masonryWallSelector;
						// this.appendedItemSelector = $attrs.masonryWallAppendedSelector;
						this.masonryOptions = _.assign(
							{
								itemSelector: this.itemSelector,
								gutter: 0,
								isInitLayout: false,
								transitionDuration: '0.3s'
							}, 
							$scope.$eval($attrs.masonryWallOptions)
						);
						this.masonryInitialised = false;

					}
				]
			};
		})
		.directive('masonryItemDir', [
			//'$timeout',
			'UtilitiesServ',
			function(UtilitiesServ){
				return {
					scope: true,
					require: '^masonryWallDir',
					link: function(scope, element, attributes, masonryWallDirCtrl){

						//we only run this once we are in the "last" element of the first iteration
						if(!masonryWallDirCtrl.masonryInitialised && scope.$last){

							//masonry is designed for the parent container
							var masonry = new Masonry(
								masonryWallDirCtrl.wallContainer[0], 
								masonryWallDirCtrl.masonryOptions
							);

							//wait for all the images to load before laying out all the items
							imagesLoaded(masonryWallDirCtrl.wallContainer, function(){
								masonry.layout();
							});

							//bind masonry to window resizing
							masonry.bindResize();

							//ok the initial setup is done, we don't want redo this
							masonryWallDirCtrl.masonryInitialised = true;

							//now we register a watch onto the collection
							scope.$watch(
								masonryWallDirCtrl.collection, 
								function(newValue, oldValue){

									//a simple subtraction of the oldValue from the newValue
									//this will give us any potential new elements that have been added to the collection
									var difference = newValue.slice(oldValue.length, newValue.length);									

									//we'll use the difference's id to extract the corresponding DOM element
									//this is because ng-repeat has already added the element to the DOM
									//we just need masonry to redo its layout
									if(!UtilitiesServ.empty(difference)){

										//just a test to see if we could acquire the index of each difference in the newValue
										// console.log(newValue.indexOf(difference[0])); //YES IT WORKS
										//now we can just use the index! And go through all of em!

										//console.log(angular.element(masonryWallDirCtrl.itemSelector));

										//timeout hack to run this after ng-repeat has finished and the class attributes interpolated
										// $timeout(function(){

											var newElements = [],
												currentElements = angular.element(masonryWallDirCtrl.itemSelector),
												index;

											for(var i = 0; i < difference.length; i++){

												index = _.indexOf(newValue, difference[i], oldValue.length);
												// var index = newValue.indexOf(difference[i]);
												// console.log(currentElements[index]);
												newElements.push(currentElements[index]);


												// //get the differentiated's element's id
												// var itemClassToLookFor = masonryWallDirCtrl.appendedItemSelector.replace(/\*/, difference[i].id);

												// //find the DOM elements that correspond with those ids and add them to the list
												// newElements.push(angular.element(itemClassToLookFor)[0]);

											}

											//append these elements to Masonry
											imagesLoaded(newElements, function(){
												masonry.appended(newElements);
											});

										// }, 0);

									}

								},
								true
							);

						}

					}
				};
			}
		]);

});