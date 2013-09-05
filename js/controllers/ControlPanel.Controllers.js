define(['angular', 'lodash'], function(angular, _){

	'use strict';

	angular.module('Controllers')
		.controller('ControlPanelCtrl', [
			'$scope',
			'$location',
			'$dialog',
			'TagsServ',
			'SearchServ',
			'UtilitiesServ',
			'UsersServ',
			function($scope, $location, $dialog, TagsServ, SearchServ, UtilitiesServ, UsersServ){

				////////////////////////
				// FILTERS AND SEARCH //
				////////////////////////

				/**
				 * Submits a tag query parameter to be searched in real time
				 * @return {Void}
				 */
				$scope.submitSearch = function(){
					SearchServ.searchTag($scope.searchTag);
				};

				/**
				 * Debounced version of submit search. To reduce load and to prevent ng-repeat from overheating.
				 * This is not using lodash because lodash's debounce is somewhat buggy with interacting with 
				 * ng-change
				 * @return {Void}
				 */
				$scope.submitSearchDebounced = UtilitiesServ.createDebouncedFunction(
					function(){
						SearchServ.searchTag($scope.searchTag);
					},
					400
				);

				/**
				 * Determines whether we are showing popular ideas or not
				 * @type {Boolean}
				 */
				$scope.viewingPopularIdeas = false;

				/**
				 * Toggles whether to show popular ideas.
				 * This is done via popular query parameter
				 * @return {Void}
				 */
				$scope.viewPopularIdeas = function(){

					$scope.viewingPopularIdeas = !$scope.viewingPopularIdeas;
					SearchServ.searchPopular($scope.viewingPopularIdeas);
				
				};

				/**
				 * Determines whether we are showing my ideas or not.
				 * @type {Boolean}
				 */
				$scope.viewingMyIdeas = false;

				/**
				 * Toggles whether to show logged in user's own ideas.
				 * This is done via the author query parameter.
				 * @return {Void}
				 */
				$scope.myIdeas = function(){

					$scope.viewingMyIdeas = !$scope.viewingMyIdeas;

					if($scope.viewingMyIdeas){
						//hardcoded author id, can only be used once we are "logged in"
						var authorId = 1;
						SearchServ.searchAuthor(authorId);
					}else{
						SearchServ.searchAuthor('');
					}

				};

				//this part is pretty awesome
				//it watches the search query
				//if they come in with the correct parameters
				//it will show them in the page representation
				//this is for the tags, popular toggling and author toggling
				$scope.$watch(function(){

					return $location.search();

				}, function(queryObject){

					if(queryObject.tags){
						$scope.searchTag = queryObject.tags;
					}

					if(queryObject.popular){
						$scope.viewingPopularIdeas = true;
					}else{
						$scope.viewingPopularIdeas = false;
					}

					if(queryObject.author){
						$scope.viewingMyIdeas = true;
					}else{
						$scope.viewingMyIdeas = false;
					}

				});

				////////////////////
				// ACTION OVERLAY //
				////////////////////

				//these are the overlays
				$scope.openAddIdeaOverlay = function(){

					var dialog = $dialog.dialog({
						backdrop: false,
						keyboard: true,
						dialogClass: 'modal overlay_backdrop small_overlay',
						templateUrl: 'add_idea_overlay.html',
						controller: 'AddIdeaOverlayCtrl'
					});

					dialog.open();

				};

				//////////////////
				// PROFILE LINK //
				//////////////////

				// wait until user data is working... also this depends on the person being logged in!
				// var userData = UsersServ.getUserData();
				// var $scope.authorId = userData.id;
				// var $scope.authorUrl = userData.url;
				$scope.authorId = 1;
				$scope.authorUrl = 'roger_qiu';

				////////////////////////
				// SIGN IN & SIGN OUT //
				////////////////////////

				//should start false
				$scope.loggedIn = true;

				//this will bring up an overlay as well
				$scope.signIn = function(){

				};

				//this does not bring up an overlay
				$scope.signOut = function(){

				};

				//////////////////
				// POPULAR TAGS //
				//////////////////

				$scope.popularTags = [];

				TagsServ.get({
					popular: true,
					trending: true,
					limit: 10
				}, function(response){

					for(var i = 0; i < response.content.length; i++){
						$scope.popularTags.push(response.content[i].tag);
					}

				});

			}
		])
		.controller('AddIdeaOverlayCtrl', [
			'$scope',
			'dialog',
			'AppIdeasServ',
			function($scope, dialog, AppIdeasServ){

				$scope.closeOverlay = function(){
					dialog.close();
				};

				$scope.submitIdea = function(){

					//once it finishes, we need to add the idea to the ng-repeat...
					//unshift the product into ng-repeat
					//the appIdeas array will need to be put inside a service
					//query the API for the date and author...?
					//this won't be a close, but in the submit...
					//which will then close it

				};

			}
		]);

});