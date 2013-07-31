define(['angular', 'masonry', 'imagesLoaded', 'lodash'], function(angular, Masonry, imagesLoaded, _){

	'use strict';

	/**
	 * Masonry Directive for the Wall of items
	 * 
	 * @param string CSS selector of the ideas. For example: ideas_* where * will be replaced by the idea id.
	 */
	angular.module('Directives')
		.directive('masonryWallDir', [
			'$timeout',
			'UtilitiesServ',
			function($timeout, UtilitiesServ){
				return {
					scope: true,
					link: function(scope, element, attributes){

						//$timeout hacks are used for convenience
						//later they can be replaced by directive controllers

						//this will be used to find specific idea panels, the new appended ones to be positioned
						var ideaSelector = attributes.masonryWallDir;
						
						//ng-repeat runs too slow (it runs after the masonry)
						//we need to wait for ng-repeat too finish, then apply masonry (by putting at the end of the exe loop)
						//another method is to put this on the same element as the ng-repeat but at a lower priority, then running this once
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

							scope.$watch(
								'appIdeas', 
								function(newValue, oldValue){

									$timeout(function(){

										//find the difference between items based on their ids
										//we just want to know if there is newer item objects added
										var difference = UtilitiesServ.arrayDifference(function(a, b){

											//a and b will be the actual objects values from the array to compare
											if(a.id === b.id){
												return true;
											}else{
												return false;
											}

										}, newValue, oldValue);

										if(!UtilitiesServ.empty(difference)){

											var newElements = [];

											for(var i = 0; i < difference.length; i++){

												//get the differentiated's element's id
												var ideaClassToLookFor = ideaSelector.replace(/\*/, difference[i].id);

												//find the DOM elements that correspond with those ids and add them to the list
												newElements.push(angular.element(ideaClassToLookFor)[0]);

											}

											//appended those elements to Masonry
											imagesLoaded(newElements, function(){
												masonry.appended(newElements);
											});

										}

									}, 0);

								}, 
								true
							);

						}, 0);

					}
				};
			}
		]);

});