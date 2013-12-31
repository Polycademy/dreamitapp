define(['angular'], function(angular){

	'use strict';

	angular.module('Controllers')
		.controller('SignInCtrl', [
			'$scope',
			'$rootScope',
			'$timeout',
			'$state',
			'$analytics',
			'$dialog',
			'UsersServ',
			'dialog',
			function($scope, $rootScope, $timeout, $state, $analytics, $dialog, UsersServ, dialog){

				var ideaId = $state.params.idea_id;
				var ideaUrl = $state.params.idea_url;

				if(dialog){

					$rootScope.viewingOverlay = true;
					$scope.closeOverlay = function(){
						$rootScope.viewingOverlay = false;
						dialog.close();
					};
					$analytics.pageTrack('users/signin');

				}else{

					$rootScope.viewingOverlay = false;
					$scope.closeOverlay = angular.noop;

				}

				$scope.finishSignIn = function(){

					$scope.closeOverlay();

					if(ideaId && ideaUrl){

						//transition to idea if ideaId and ideaUrl were passed in
						$state.transitionTo('idea', {'ideaId': ideaId, 'ideaUrl': ideaUrl, 'force': true});

					}else{

						//transition to home if signed up as a developer or other situations
						$state.transitionTo('home');

					}

				};

				$scope.submitSignIn = function(){

					var credentials = {
						email: $scope.email,
						password: $scope.password
					};

					UsersServ.loginSession(credentials, function(response){

						$scope.successSubmit = 'Successfully Signed In';
						$timeout(function(){
							$scope.finishSignIn();
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

					//close this overlay if this was a modal
					$scope.closeOverlay();

					//open up ForgotPasswordCtrl
					var dialog = $dialog.dialog({
						backdrop: false,
						keyboard: false,
						dialogClass: 'modal',
						templateUrl: 'forgot_password.html',
						controller: 'ForgotPasswordCtrl'
					});

					dialog.open();

				};

			}
		]);

});