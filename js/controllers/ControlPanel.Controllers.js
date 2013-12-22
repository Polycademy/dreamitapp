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
						var authorId = $rootScope.user.id;
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
				$scope.signIn = function(reopenIdea){

					var dialog = $dialog.dialog({
						backdrop: false,
						keyboard: false,
						dialogClass: 'modal',
						templateUrl: 'signin_modal.html',
						controller: 'SignInModalCtrl'
					});

					var finishFunction = function(shouldReopenIdea){
						if(reopenIdea && shouldReopenIdea){
							$state.transitionTo('idea', {
								ideaId: reopenIdea.ideaId, 
								ideaUrl: reopenIdea.titleUrl, 
								force: 'true'
							});
						}
					};

					dialog.open().then(finishFunction);

				};

				//this does not bring up an overlay
				$scope.signOut = function(){

					UsersServ.logoutSession(0, function(){
						$rootScope.$broadcast('reloadWall');
					});

				};

				$scope.signUp = function(reopenIdea){

					var dialog = $dialog.dialog({
						backdrop: false,
						keyboard: true,
						dialogClass: 'modal overlay_backdrop',
						templateUrl: 'signup_modal.html',
						controller: 'SignUpModalCtrl'
					});

					var finishFunction = function(shouldReopenIdea){
						if(reopenIdea && shouldReopenIdea){
							$state.transitionTo('idea', {
								ideaId: reopenIdea.ideaId, 
								ideaUrl: reopenIdea.titleUrl, 
								force: 'true'
							});
						}
					};

					//after signing up, should we allow auto sign in? nah, have to go and activate account first
					dialog.open().then(finishFunction);

				};

				$scope.signInOrSignUp = function(reopenIdea){

					var dialog = $dialog.dialog({
						backdrop: false,
						keyboard: false,
						dialogClass: 'modal',
						templateUrl: 'signin_or_signup_modal.html',
						controller: 'SignInOrSignUpModalCtrl',
						customOptions: {
							previousIdea: reopenIdea
						}
					});

					dialog.open();

				};

				var promptSignInOrUpListener = $rootScope.$on('openSignInOrSignUp', function(event, args){
					//assume args is an object containing id & titleUrl
					$scope.signInOrSignUp(args);
				});

				var signInListener = $rootScope.$on('openSignIn', function(event, args){
					$scope.signIn(args);
				});

				var signUpListener = $rootScope.$on('openSignUp', function(event, args){
					$scope.signUp(args);
				});

				//registering events on this controller can cause an event handling leak
				//the browser remembers all the event handlers, however this controller's instance may be destroyed
				//when switching pages
				//when it reinstantiates, it reregisters the event handlers
				//thie means on the destruction of this controller, we need to clean up the event handlers
				//in future this code should be reworked, since controllers shouldn't really have to register event handlers
				//and the manipulation of overlays should be handled by an overarching controller, or a service singleton
				$scope.$on('$destroy', function() {
					promptSignInOrUpListener();
					signInListener();
					signUpListener();
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
			'$timeout',
			'$dialog',
			'UsersServ',
			'dialog',
			function($scope, $rootScope, $timeout, $dialog, UsersServ, dialog){

				$scope.closeOverlay = function(shouldReopenIdea){
					shouldReopenIdea = (typeof shouldReopenIdea === 'undefined') ? true : shouldReopenIdea;
					dialog.close(shouldReopenIdea);
				};

				$scope.submitSignIn = function(){

					var credentials = {
						email: $scope.email,
						password: $scope.password
					};

					UsersServ.loginSession(credentials, function(response){

						$scope.successSubmit = 'Successfully Signed In';
						$timeout(function(){
							$scope.closeOverlay();
							$rootScope.$broadcast('reloadWall');
						}, 1000);

					}, function(response){

						$scope.validationErrors = [];
						if(response.data.code == 'validation_error'){
							//the content would be an object of fields to errors
							for(var key in response.data.content){
								$scope.validationErrors.push(response.data.content[key]); 
							}
						}else{
							$scope.validationErrors = [response.data.content];
						}

					});

				};

				$scope.forgotPassword = function(){

					//close this overlay but don't reopen the idea
					$scope.closeOverlay(false);

					//open up ForgotPasswordCtrl
					var dialog = $dialog.dialog({
						backdrop: false,
						keyboard: false,
						dialogClass: 'modal',
						templateUrl: 'forgot_password_modal.html',
						controller: 'ForgotPasswordCtrl'
					});

					dialog.open();

				};

			}
		])
		.controller('ForgotPasswordCtrl', [
			'$scope',
			'PasswordServ',
			'UtilitiesServ',
			'dialog',
			function($scope, PasswordServ, UtilitiesServ, dialog){

				$scope.closeOverlay = function(){
					dialog.close();
				};

				$scope.submitForgottenPassword = function(){

					var identity = $scope.email;

					PasswordServ.initiate.get({
						'identity': identity
					}, function(response){

						$scope.successSubmit = 'Sent the forgotten password email.';

					}, function(response){

						$scope.validationErrors = [];
						if(UtilitiesServ.type(response.data.content) === 'Array'){
							for(var key in response.data.content){
								$scope.validationErrors.push(response.data.content[key]); 
							}
						}else{
							$scope.validationErrors = [response.data.content];
						}

					});

				};

			}
		])
		.controller('SignUpModalCtrl', [
			'$scope',
			'$rootScope',
			'$timeout',
			'$state',
			'UsersServ',
			'dialog',
			function($scope, $rootScope, $timeout, $state, UsersServ, dialog){

				$rootScope.viewingOverlay = true;

				$scope.closeOverlay = function(shouldReopenIdea){
					//by default closing the signup overlay should reopen the idea if there was an action interception
					//but if we successfully logged in, then we are transitioning to the user, not the idea
					shouldReopenIdea = (typeof shouldReopenIdea === 'undefined') ? true : shouldReopenIdea;
					$rootScope.viewingOverlay = false;
					dialog.close(shouldReopenIdea);
				};

				//default parameters
				$scope.developer = 0;

				$scope.submitSignUp = function(){

					var newUser = {
						username: $scope.username,
						email: $scope.email,
						password: $scope.password,
						developer: $scope.developer,
						tac: $scope.tac,
						marketingDreamitapp: $scope.marketingDreamitapp,
						marketingDeveloper: $scope.marketingDeveloper,
						marketingBeta: $scope.marketingBeta
					};

					UsersServ.registerAccount(newUser, function(response){

						$scope.successSubmit = 'Successfully Registered. If you are a general member, you can login immediately. If you applied to be a developer, you need to await a response from Dream it App.';

						$timeout(function(){
							//if user did apply to be a developer, sign him in and transition them to their profile page
							if($scope.developer == '0'){
								UsersServ.loginSession({
									email: $scope.email,
									password: $scope.password
								}, function(response){
									$state.transitionTo('user', {userId: response.content});
								});
							}
							$scope.closeOverlay(false);
						}, 1000);

					}, function(response){

						$scope.validationErrors = [];
						if(response.data.code == 'validation_error'){
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
		])
		.controller('SignInOrSignUpModalCtrl', [
			'$scope',
			'$rootScope',
			'$state',
			'dialog',
			function($scope, $rootScope, $state, dialog){

				//this controller overlay only gets triggered from liking or trying to hit commenting buttons but not logged in

				var previousIdea = dialog.options.customOptions.previousIdea;

				$scope.closeOverlay = function(){
					dialog.close();
					//if it closes by itself, it needs to reopen the previous idea
					$state.transitionTo('idea', {
						ideaId: previousIdea.ideaId, 
						ideaUrl: previousIdea.titleUrl, 
						force: 'true'
					});
				};

				$scope.openSignIn = function(){

					$rootScope.$broadcast('openSignIn', previousIdea);
					dialog.close();

				};

				$scope.openSignUp = function(){

					$rootScope.$broadcast('openSignUp', previousIdea);
					dialog.close();

				};

			}
		]);

});