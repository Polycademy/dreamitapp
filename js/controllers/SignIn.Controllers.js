define(['angular'], function(angular){

	'use strict';

	angular.module('Controllers')
		.controller('SignInCtrl', [
			'$scope',
			'$rootScope',
			'$timeout',
			'$dialog',
			'UsersServ',
			'dialog',
			function($scope, $rootScope, $timeout, $dialog, UsersServ, dialog){

				//Follow the Users controller
				//this can be both a modal dialog
				//or a single page
				//also template needs to be changed

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
						templateUrl: 'forgot_password.html',
						controller: 'ForgotPasswordCtrl'
					});

					dialog.open();

				};

			}
		]);

});