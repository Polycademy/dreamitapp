define(['angular', 'lodash'], function(angular, _){

	'use strict';

	angular.module('Controllers')
		.controller('HomeCtrl', [
			'$scope',
			'$rootScope',
			'$location',
			'$filter',
			'$dialog',
			'UtilitiesServ',
			'IdeasServ',
			'SearchServ',
			function($scope, $rootScope, $location, $filter, $dialog, UtilitiesServ, IdeasServ, SearchServ){

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
				$scope.getIdeas = function(limit, tags, author){

					$scope.ideasServiceBusy = true;

					var queryParameters = {
						limit: limit,
						offset: counterOffset
					};

					if(tags){
						queryParameters.tags = tags;
					}

					if(author){
						queryParameters.author = author;
					}

					IdeasServ.get(
						queryParameters,
						function(response){

							//increase the counterOffset
							counterOffset = counterOffset + limit;

							//adding in a filtered decription property for addThis
							for(var i = 0; i < response.content.length; i++){
								response.content[i].descriptionFiltered = $filter('StripHtml')(response.content[i].description);
							}

							$scope.appIdeas = $scope.appIdeas.concat(response.content);
							$scope.ideasServiceBusy = false;

						},
						function(response){

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

					SearchServ.searchTag(tag);
				
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

					var limit = $location.search().limit;

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

					return $location.search().tags;

				};

				var setupAuthorSearch = function(){

					return $location.search().author;

				};

				//grab the initial limit and tags
				$scope.limit = setupLimit();
				$scope.tags = setupTagsSearch();
				$scope.author = setupAuthorSearch();

				//watch for changes to the tags and limit and adjust accordingly
				$scope.$watch(
					function(){

						return $location.search();

					}, 
					function(){

						$scope.limit = setupLimit();
						$scope.tags = setupTagsSearch();
						$scope.author = setupAuthorSearch();

						//only reload if there are tags or author
						if($scope.tags || $scope.tags == '' || $scope.author || $scope.author == ''){
							//reset masonry, appIdeas and offset
							$scope.appIdeas = [];
							counterOffset = 0;
							$scope.getIdeas($scope.limit, $scope.tags, $scope.author);
						}

					}, 
					true
				);

				//setting up the overlay options
				var dialog = $dialog.dialog({
					backdrop: false,
					keyboard: true,
					dialogClass: 'modal idea_overlay',
					templateUrl: 'idea_overlay.html',
					controller: 'IdeaOverlayCtrl'
				});

				$scope.openIdeaOverlay = function(ideaId){

					//you might want to see if you can remember the URL parameters

					//we need to pass in the ideaId to the modal controller
					//and it has to use resolved functions
					dialog.options.resolve = {
						ideaId: function(){ return ideaId }
					};
					
					dialog.open().then(function(){
						$rootScope.viewingOverlay = false;
					});

				};

			}
		])
		.controller('IdeaOverlayCtrl', [
			'$scope',
			'$rootScope',
			'dialog',
			'ideaId',
			function($scope, $rootScope, dialog, ideaId){

				$rootScope.viewingOverlay = true;

				$scope.closeOverlay = function(){
					dialog.close();
				};

			}
		]);

});