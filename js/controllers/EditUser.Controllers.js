define(['angular'], function(angular){

	'use strict';

	angular.module('Controllers')
		.controller('EditUserCtrl', [
			'$scope',
			'$rootScope',
			'$state',
			'$location',
			'$timeout',
			'AccountsServ',
			'dialog',
			function($scope, $rootScope, $state, $location, $timeout, AccountsServ, dialog){

				if(dialog){
					$rootScope.viewingOverlay = true;
					$scope.closeOverlay = function(value){
						$rootScope.viewingOverlay = false;
						dialog.close(value);
					};
				}else{
					$rootScope.viewingOverlay = false;
					$scope.closeOverlay = angular.noop;
				}

				try{
					var userId = $state.params.userId;
					var userUrl = $state.params.userUrl;
				}catch(e){
					var userId = dialog.options.customOptions.userId;
					var userUrl = dialog.options.customOptions.userUrl;
				}

				$scope.notFoundError = false;
				$scope.validationErrors = false;

				var fillUpPayload = function(){

					//password and passwordConfirm will always start undefined
					//this means these values do not get passed to the API, so empty password values won't hurt
					//however null or empty strings will be passed
					//so the GET part of this controller needs to get null/empty and update accordingly
					var newUser = {
						username: $scope.username,
						email: $scope.email,
						password: $scope.password,
						passwordConfirm: $scope.passwordConfirm,
						phone: $scope.phone,
						operatingSystem: $scope.operatingSystem,
						age: $scope.age,
						gender: $scope.gender
					};

					return newUser;

				};

				AccountsServ.get(
					{
						id: userId
					},
					function(response){

						if(!dialog){
							if(response.content.usernameUrl !== userUrl){
								$location.path(
									'users/edit' 
									+ '/' 
									+ userId 
									+ '/' 
									+ response.content.usernameUrl
								);
							}
						}

						$scope.username = response.content.username;
						$scope.email = response.content.email;
						$scope.phone = response.content.phone;
						$scope.operatingSystem = response.content.operatingSystem;
						$scope.age = response.content.age;
						$scope.gender = response.content.gender;

					},
					function(response){

						$scope.notFoundError = response.data.content;

					}
				);

				$scope.submitUser = function(){

					var updatedUser = fillUpPayload();

					var successUpdate = function(response){

						//if it was a success response, but with code error, then that just means nothing needed to be updated
						if(response.code !== 'error'){

							$scope.successSubmit = 'Successfully Updated User';
							$timeout(function(){
								if(dialog){
									$scope.closeOverlay(true);
								}else{
									$state.transitionTo('user', {userId: userId, userUrl: response.content.usernameUrl});
								}
							}, 1000);

						}else{

							$scope.validationErrors = [response.content];

						}

					};

					var failedUpdate = function(response){

						$scope.validationErrors = [];
						if(response.data.code = 'validation_error'){
							for(var key in response.data.content){
								$scope.validationErrors.push(response.data.content[key]); 
							}
						}else{
							$scope.validationErrors = [response.data.content];
						}

					};

					AccountsServ.update(
						{
							id: userId
						},
						updatedUser,
						successUpdate,
						failedUpdate
					);

				};

				$scope.deleteUser = function(){

					UsersServ.deleteAccount(userId, function(response){

						if(response.code == 'error'){

							$scope.validationErrors = ['Failed to delete user. ID does not exist.'];

						}else{

							$scope.successSubmit = 'Successfully Deleted User';
							$timeout(function(){
								if(dialog){
									$scope.closeOverlay();
								}else{
									$state.transitionTo('home');
								}
							}, 1000);

						}

					}, function(response){

						$scope.validationErrors = [response.data.content];

					});
					
				};

			}
		]);

});