define(['angular', 'lodash'], function(angular, _){

	'use strict';

	angular.module('Controllers')
		.controller('HomeCtrl', [
			'$scope',
			'$location',
			'UtilitiesServ',
			'IdeasServ',
			'$timeout',
			function($scope, $location, UtilitiesServ, IdeasServ, $timeout){

				/**
				 * The default limit of app ideas to load on each scroll iteration
				 * and initial load. This may have to be changed in the future
				 * depending on browser screen width so to accomodate mobile
				 * screens and their connections
				 * @type {integer}
				 */
				var defaultLimit = 20;

				/**
				 * This counter offsets the items to be queried on each iteration of getIdeas
				 * If you reload based on new search criteria or tags, this needs to be reset to 0.
				 * @type {Integer}
				 */
				var counterOffset = 0;

				// $scope.appIdeas.push({
				// 	id: i,
				// 	title: 'Hacker News App',
				// 	link: 'hacker_news_app1-idea',
				// 	image: 'img/2exampleimg.png', //'img/example_item_image.png',,
				// 	description: '<p>An app to help read Hacker News on the mobile phone or ipad.</p>',
				// 	authorId: 1,
				// 	authorLink: 'roger_qiu1',
				// 	author: 'Roger Qiu',
				// 	feedback: 32, //this is extracted from the disqus api
				// 	likes: 40,
				// 	tags: [
				// 		'iphone',
				// 		'ipad',
				// 		'android',
				// 		'programming'
				// 	]
				// });

				/**
				 * This is the array of app ideas to be repeated across the wall.
				 * @type {Array}
				 */
				$scope.appIdeas = [];

				/**
				 * This is to throttle the retrieving of idea items due to infinite scroll pagination.
				 * When set to true, the infinite scroll will stop activating the getIdeas.
				 * It will only be reset to false, once a response comes back from the resource query.
				 * @type {Boolean}
				 */
				$scope.ideasServiceBusy = false;

				/**
				 * Boolean for whether to show an error.
				 * This could happen if there are no more ideas to show.
				 * But it's also going to store the error message.
				 * @type {Boolean}
				 */
				$scope.ideasServiceError = false;

				/**
				 * Addthis plugin uses this to create links since it can't recognise the base tag.
				 * @type {String}
				 */
				$scope.baseUrl = angular.element('base')[0].href;

				/**
				 * This grabs app idea items from the service. It accepts a limit
				 * and tags parameter to filter the results. This will be passed
				 * to ng-repeat. It will maintain the counter offset.
				 * @param  {Integer} limit
				 * @param  {String} tags
				 * @return {Array}
				 */
				$scope.getIdeas = function(limit, tags){

					var returnedIdeas = [];

					$scope.ideasServiceBusy = true;

					var queryParameters = {
						"limit": limit,
						"offset": counterOffset
					};

					if(tags){
						queryParameters.tags = tags;
					}

					IdeasServ.get(
						queryParameters,
						function(response){

							//increase the counterOffset
							counterOffset = counterOffset + limit;
							$scope.appIdeas = $scope.appIdeas.concat(response.content);
							$scope.ideasServiceBusy = false;

						},
						function(response){

							$scope.ideasServiceError = response.data.content;
							$scope.ideasServiceBusy = false;

						}
					);

				};

				/**
				 * Increase the amount of likes of an item by one.
				 * A user is only allowed to like it once.
				 * If this is executed again on the same item, the original like will be deducted.
				 * It requires a user to be logged in before this will work.
				 * @param  {Integer} ideaId Id of the idea item
				 * @return {Void}
				 */
				$scope.likeAction = function(ideaId){

					// $scope.appIdeas.push({
					// 	id: 3,
					// 	title: 'Hacker News App',
					// 	link: 'hacker_news_app1-idea',
					// 	image: 'img/2exampleimg.png', //'img/example_item_image.png',,
					// 	description: '<p>An app to help read Hacker News on the mobile phone or ipad.</p>',
					// 	authorId: 1,
					// 	authorLink: 'roger_qiu1',
					// 	author: 'Roger Qiu',
					// 	feedback: 32, //this is extracted from the disqus api
					// 	likes: 40,
					// 	tags: [
					// 		'iphone',
					// 		'ipad',
					// 		'android',
					// 		'programming'
					// 	]
					// },
					// {
					// 	id: 4,
					// 	title: 'Hacker News App',
					// 	link: 'hacker_news_app1-idea',
					// 	image: 'img/2exampleimg.png', //'img/example_item_image.png',,
					// 	description: '<p>An app to help read Hacker News on the mobile phone or ipad.</p>',
					// 	authorId: 1,
					// 	authorLink: 'roger_qiu1',
					// 	author: 'Roger Qiu',
					// 	feedback: 32, //this is extracted from the disqus api
					// 	likes: 40,
					// 	tags: [
					// 		'iphone',
					// 		'ipad',
					// 		'android',
					// 		'programming'
					// 	]
					// });

				};

				/**
				 * When click on any tag links. This will set them as query parameters
				 * on the url, and then reload the items based on these tag parameters.
				 * This function should be called when any query parameters are detected.
				 * This only allows on tag to be used.
				 * @param  {String} tag Name of the tag
				 * @return {Void}
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
				 * @param  {Integer} index Ng-repeat's index of the item.
				 * @return {Boolean}
				 */
				$scope.ideaHasImage = function(index){

					//it is possible that image may be "false"
					if('image' in $scope.appIdeas[index]){
						return $scope.appIdeas[index].image;
					}else{
						return false;
					}

				};

				/**
				 * This gets the limit query parameter and validates it.
				 * It then either sets the new limit, or defaults to the default limit.
				 * @return {Integer}
				 */
				var setupLimit = function(){

					var limit = $scope.$stateParams.limit;

					if(!UtilitiesServ.empty(limit) && UtilitiesServ.isInteger(limit)){

						//limit is absolute valued and parsed as an integer
						limit = Math.abs(_.parseInt(limit));

					}else{

						limit = defaultLimit;

					}

					return limit;

				};

				/**
				 * This gets the tag query parameter and validates it.
				 * It resets the counter if there are proper tags.
				 * @return {String}
				 */
				var setupTagsSearch = function(){

					var tags = $scope.$stateParams.tags;

					if(!UtilitiesServ.empty(tags)){

						counterOffset = 0;

					}else{

						tags = false;

					}

					return tags;

				};

				//grab the initial limit and tags
				$scope.limit = setupLimit();
				$scope.tags = setupTagsSearch();

				//load up the ideas
				$scope.getIdeas($scope.limit, $scope.tags);

				//detect query parameter change, and reload the app ideas or adjust the limit
				// $scope.$on('$locationChangeStart', function(){

				// 	//try $routeChangeStart
				// 	//or function(){return $location.search()} and deep watch

				// 	//if the limit gets changed, this will be reflected in the next load iteration
				// 	$scope.limit = setupLimit();
				// 	$scope.tags = setupTagsSearch();

				// 	//if there tags, we should reload the ideas, otherwise we don't do anything
				// 	if(tags){
				// 		$scope.appIdeas = $scope.getIdeas($scope.limit, $scope.tags);
				// 	}

				// });

				//infinite load directive needs to push ideas into it
				//$scope.appIdeas.push($scope.getIdeas(limit));

			}
		]);

});