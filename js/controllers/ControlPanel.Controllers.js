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

				//it watches the search query
				//if they come in with the correct query parameters
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

				//////////////////
				// PROFILE LINK //
				//////////////////

				// wait until user data is working... also this depends on the person being logged in!
				// var userData = UsersServ.getUserData();
				// var $scope.authorId = userData.id;
				// var $scope.authorUrl = userData.url;
				$scope.authorId = 1;
				$scope.authorUrl = 'roger_qiu';

				////////////////////
				// ACTION OVERLAY //
				////////////////////

				//these are the overlays
				$scope.openAddIdeaOverlay = function(){

					var dialog = $dialog.dialog({
						backdrop: false,
						keyboard: true,
						dialogClass: 'modal overlay_backdrop',
						templateUrl: 'add_idea_overlay.html',
						controller: 'AddIdeaOverlayCtrl'
					});

					dialog.open();

				};

				////////////////////////
				// SIGN IN & SIGN OUT //
				////////////////////////

				//should start false
				$scope.loggedIn = true;

				//this will bring up an overlay as well
				$scope.signIn = function(){

					var dialog = $dialog.dialog({
						backdrop: false,
						keyboard: true,
						dialogClass: 'modal overlay_backdrop',
						templateUrl: 'signin_overlay.html',
						controller: 'SignInOverlayCtrl'
					});

					dialog.open().then(function(loggedIn){
						$scope.loggedIn = loggedIn;
					});

				};

				//this does not bring up an overlay
				$scope.signOut = function(){
					//do the logout stuff
					$scope.loggedIn = false;
				};

			}
		])
		.controller('AddIdeaOverlayCtrl', [
			'$scope',
			'$rootScope',
			'dialog',
			'AppIdeasServ',
			'IdeasServ',
			function($scope, $rootScope, dialog, AppIdeasServ, IdeasServ){

				$rootScope.viewingOverlay = true;

				$scope.closeOverlay = function(){
					$rootScope.viewingOverlay = false;
					dialog.close();
				};

				$scope.validationErrors = false;
				$scope.addIdeaPrivacy = 'privacy';

				$scope.uploadImage = function(imageObject){
					//imageObject is apparently an array, so we're only allowing one image
					$scope.addIdeaImage = imageObject[0].url;
					$scope.addIdeaImageBlob = JSON.stringify(imageObject[0]);
					$scope.$apply();
				};

				$scope.submitIdea = function(){

					var newIdea = {};

					newIdea.title = $scope.addIdeaTitle;
					newIdea.descriptionShort = $scope.addIdeaDescriptionShort;
					newIdea.image = $scope.addIdeaImage;
					newIdea.imageBlob = $scope.addIdeaImageBlob;
					newIdea.description = $scope.addIdeaDescription;
					newIdea.privacy = $scope.addIdeaPrivacy;

					IdeasServ.save(
						{},
						newIdea,
						function(response){

							IdeasServ.get(
								{
									id: response.content
								},
								function(response){

									AppIdeasServ.prependIdeas(response.content);
									$scope.closeOverlay();

								},
								function(response){

									//dont close the overlay, show the error via the validation errors, and allow resubmitting
									$scope.validationErrors = ['Was not able to read the new idea. Try submitting again.'];

								}
							);

						},
						function(response){

							$scope.validationErrors = [];
							if(response.data.code = 'validation_error'){
								//the content would be an object of fields to errors
								for(var key in response.data.content){
									$scope.validationErrors.push(response.data.content[key]); 
								}
							}

						}
					);

				};

			}
		])
		.controller('SignInOverlayCtrl', [
			'$scope',
			'$rootScope',
			'dialog',
			function($scope, $rootScope, dialog){

				var loggedIn = false;

				$rootScope.viewingOverlay = true;

				$scope.closeOverlay = function(){
					$rootScope.viewingOverlay = false;
					dialog.close(loggedIn);
				};

				$scope.submitLogin = function(){
					//if successful
					loggedIn = true;
				};

			}
		]);

});