define(['angular', 'masonry', 'imagesLoaded', 'lodash'], function(angular, Masonry, imagesLoaded, _){

	'use strict';

	/**
	 * Masonry Directive for the Wall of items
	 */
	angular.module('Directives')
		.directive('masonryWallDir', [
			'$timeout',
			'UtilitiesServ',
			function($timeout, UtilitiesServ){
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

							scope.$watch(
								'appIdeas', 
								function(newValue, oldValue){

									//this is very important, we don't want to pass by reference
									//there these objects are cloned and then passed in
									//var newArray = angular.copy(newValue);
									//var oldArray = angular.copy(oldValue);

									console.log(newValue);
									console.log(oldValue);

									//difference between items based on their ids
									//we just want to know if there is newer item objects added
									var difference = UtilitiesServ.arrayDifference(function(a, b){

										//a and b will be the actual objects values from the array to compare
										if(a.id === b.id){
											return true;
										}else{
											return false;
										}

									}, newValue, oldValue);

									console.log(difference);

									//find the difference between newValue and oldValue
									//get the differentiated's element's id
									//use the ids, and find the DOM elements that correspond with those ids
									//appended those elements to Masonry
									//PROBLEMS: the id may not yet be intepolated on the DOM

									// console.log(element.children('.item_panel').last()[0]);
									// imagesLoaded(element, function(){
									// 	masonry.reloadItems();
									// 	masonry.layout();
									// });
									// masonry.appended(element.children('.item_panel').last()[0]);
								}, 
								true
							);

							// var lol = $timeout(function myFunction() {
							// 	console.log('Muahaha');
							// 	masonry.reloadItems();
							// 	masonry.layout();
							// 	lol = $timeout(myFunction, 4000);
							// },4000);

						}, 0);

					}
				};
			}
		]);

});