define(['angular'], function(angular){

	'use strict';

	angular.module('Controllers')
		.controller('SignUpCtrl', [
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
		]);

});