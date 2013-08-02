define(['angular'], function(angular){

	'use strict';

	angular.module('Controllers')
		.controller('HomeCtrl', [
			'$scope',
			'$location',
			'UtilitiesServ',
			'IdeasServ',
			function($scope, $location, UtilitiesServ, IdeasServ){

				/**
				 * This is the array of app ideas to be repeated across the wall.
				 * @type {Array}
				 */
				$scope.appIdeas = [];

				/**
				 * Addthis plugin uses this to create links since it can't recognise the base tag.
				 * @type {string}
				 */
				$scope.baseUrl = angular.element('base')[0].href;

				/**
				 * Increase the amount of likes of an item by one.
				 * A user is only allowed to like it once.
				 * If this is executed again on the same item, the original like will be deducted.
				 * It requires a user to be logged in before this will work.
				 * @param  {integer} ideaId Id of the idea item
				 * @return {void}
				 */
				$scope.likeAction = function(ideaId){

				};

				/**
				 * When click on any tag links. This will set them as query parameters
				 * on the url, and then reload the items based on these tag parameters.
				 * This function should be called when any query parameters are detected.
				 * This only allows on tag to be used.
				 * @param  {string} tag Name of the tag
				 * @return {void}
				 */
				$scope.tagAction = function(tag){

					//this function needs to be moved to a service (because the control_panel controller would use this too)
					//we also need to write something that watches the query parameters (on the home controller)
					//multiple tags are possible with "+" while spaces (%20) are part of the tag itself
					//tag needs to be uri encoded, (then decoded when used!)
					$location.search({'tags': encodeURIComponent(tag)});
				
				};

				/**
				 * Determine if an idea has an image or not. This is used for ng-show so that the HTML
				 * that contains the images will not be displayed if there is no image for an item.
				 * @param  {integer} index Ng-repeat's index of the item.
				 * @return {boolean}
				 */
				$scope.ideaHasImage = function(index){

					//it is possible that image may be "false"
					if('image' in $scope.appIdeas[index]){
						return $scope.appIdeas[index].image;
					}else{
						return false;
					}

				};

				//Detect Query Parameters for tags
				//$routeChangeStart
				//or use function(){return $location.search()}?? or deep watch?
				$scope.$on('$locationChangeStart', function(event, newLocation, oldLocation){

					var tags = $scope.$stateParams.tags;
					var limit = $scope.$stateParams.limit;

					if(tags){

						tags = decodeUriComponent(tags);

						//tags is decoded

					}

					if(limit && UtilitiesServ.isInteger(limit)){

						limit = abs(parseInt(limit));

						//limit is now absolute valued and parsed as an integer

					}

				});

				//we also need to execute this on startup, since the first page load there's no change of $locationChangeStart
				if($scope.$stateParams.tags){

				}

				//Detect Query Parameters for limit


				

				// var i = 1;

				//limit and offset may be optionally set on this page
				//if it is then limit will determine how many items to load at each scroll iteration
				//offset will be auto done based on the iterations!



				// //we need to get images and process them with the correct limit and offset
				// //limit offset
				// //load 10 more elements at each iteration
				// //the offset needs to kept track off, so we know what should be paginated to service
				// $scope.getImages = function(limit){

				// 	IdeasServ.query(
				// 		{
				// 			"limit": limit
				// 		},
				// 		function(response){

				// 			console.log(response);

				// 		},
				// 		function(response){

				// 			console.log(response);

				// 		}
				// 	);

				// 	// i = i+1;

				// 	// $scope.appIdeas.push({
				// 	// 	id: i,
				// 	// 	title: 'Hacker News App',
				// 	// 	link: 'hacker_news_app1-idea',
				// 	// 	image: 'img/2exampleimg.png', //'img/example_item_image.png',,
				// 	// 	description: '<p>An app to help read Hacker News on the mobile phone or ipad.</p>',
				// 	// 	authorId: 1,
				// 	// 	authorLink: 'roger_qiu1',
				// 	// 	author: 'Roger Qiu',
				// 	// 	feedback: 32,
				// 	// 	likes: 40,
				// 	// 	tags: [
				// 	// 		'iphone',
				// 	// 		'ipad',
				// 	// 		'android',
				// 	// 		'programming'
				// 	// 	]
				// 	// });


				// };

				// //get the initial images
				// $scope.getImages();

			}
		]);

});