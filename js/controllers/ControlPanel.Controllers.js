define(['angular', 'lodash'], function(angular, _){

	'use strict';

	angular.module('Controllers')
		.controller('ControlPanelCtrl', [
			'$scope',
			'$rootScope',
			'$state',
			'$location',
			'$dialog',
			'TagsServ',
			'SearchServ',
			'UtilitiesServ',
			'UsersServ',
			function($scope, $rootScope, $state, $location, $dialog, TagsServ, SearchServ, UtilitiesServ, UsersServ){

				////////////
				// SEARCH //
				////////////

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
				 * Opens an overlay for search in small screens
				 * @return {Void}
				 */
				$scope.openSearch = function(){

					var dialog = $dialog.dialog({
						backdrop: false,
						keyboard: true,
						dialogClass: 'modal overlay_backdrop no_scroll',
						templateUrl: 'search_modal.html',
						controller: 'SearchModalCtrl'
					});

					dialog.open().then(function(searchValue){
						if(searchValue){
							$scope.searchTag = searchValue;
							$scope.submitSearch();
						}
					});

				};

				/////////////
				// FILTERS //
				/////////////

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
					limit: 5
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

				$scope.openAddIdeaOverlay = function(){

					//smaller screen sizes should directly transition
					if(UtilitiesServ.checkMinimumOverlayWidth()){
						$state.transitionTo('addIdea');
						return;
					}

					var dialog = $dialog.dialog({
						backdrop: false,
						keyboard: true,
						dialogClass: 'modal overlay_backdrop',
						templateUrl: 'add_edit_idea.html',
						controller: 'AddEditIdeaCtrl',
						customOptions: {
							action: 'add'
						}
					});

					dialog.open();

				};

				//////////////////////////////////
				// SIGN IN & SIGN OUT & SIGN UP //
				//////////////////////////////////

				//POLYAUTH

				//this will bring up an overlay as well
				$scope.signIn = function(){

					var dialog = $dialog.dialog({
						backdrop: false,
						keyboard: true,
						dialogClass: 'modal overlay_backdrop no_scroll',
						templateUrl: 'signin_modal.html',
						controller: 'SignInModalCtrl'
					});

					dialog.open().then(function(loggedIn){
						$rootScope.loggedIn = loggedIn;
					});

				};

				//this does not bring up an overlay
				$scope.signOut = function(){
					//do the logout stuff
					$rootScope.loggedIn = false;
				};

				$scope.signUp = function(){

					var dialog = $dialog.dialog({
						backdrop: false,
						keyboard: true,
						dialogClass: 'modal overlay_backdrop',
						templateUrl: 'signup_modal.html',
						controller: 'SignUpModalCtrl'
					});

					//after signing up, should we allow auto sign in? nah, have to go and activate account first
					dialog.open();

				};

				$scope.$watch('loggedIn', function(value){

					if(value === true){
						
						//HERE you need to check if the logged in user is an admin account, if so set it on rootScope
						$rootScope.loggedInAdmin = true;

					}else{

						$rootScope.loggedInAdmin = false;						
					
					}

				});

			}
		])
		.controller('SearchModalCtrl', [
			'$scope',
			'dialog',
			function($scope, dialog){

				$scope.searchValue = '';

				$scope.closeOverlay = function(){
					dialog.close($scope.searchValue);
				};

				$scope.submitSearch = function(){
					$scope.closeOverlay();
				};

			}
		])
		.controller('SignInModalCtrl', [
			'$scope',
			'$rootScope',
			'dialog',
			function($scope, $rootScope, dialog){

				$rootScope.viewingOverlay = true;

				$scope.closeOverlay = function(){
					$rootScope.viewingOverlay = false;
					dialog.close(loggedIn);
				};

				var loggedIn = false;

				$scope.submitLogin = function(){
					//if successful
					loggedIn = true;
				};

			}
		])
		.controller('SignUpModalCtrl', [
			'$scope',
			'$rootScope',
			'UsersServ',
			'dialog',
			function($scope, $rootScope, UsersServ, dialog){

				$rootScope.viewingOverlay = true;

				$scope.closeOverlay = function(){
					$rootScope.viewingOverlay = false;
					dialog.close();
				};

				$scope.submitSignUp = function(){

					var newUser = {
						username: $scope.username,
						email: $scope.email,
						password: $scope.password,
						developer: $scope.developer,
						tac: $scope.tac
					};

					UsersServ.registerAccount(newUser, function(response){

						$scope.successSubmit = 'Successfully Registered. If you are a general member, you can login immediately. If you applied to be a developer, you need to await a response from Dream it App.';

					}, function(response){

						$scope.validationErrors = [];
						if(response.data.code = 'validation_error'){
							//the content would be an object of fields to errors
							for(var key in response.data.content){
								$scope.validationErrors.push(response.data.content[key]); 
							}
						}else{
							$scope.validationErrors = [response.data.content];
						}

					});

				};

			}
		]);

});