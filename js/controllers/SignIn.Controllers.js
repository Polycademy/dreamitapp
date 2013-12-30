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

				//if ideaId and titleUrl is passed, redirect and transition to the idea
				//if they are not passed, redirect and transition him to his profile page
				//if the user applied to a be developer, transition back to home page
				//facebook should get the finish function (not a close overlay function)

				var ideaId = $state.params.idea_id;
				var titleUrl = $state.params.title_url;

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
						templateUrl: 'forgot_password.html',
						controller: 'ForgotPasswordCtrl'
					});

					dialog.open();

				};

			}
		]);

});