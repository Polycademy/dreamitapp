define(['angular'], function(angular){

	'use strict';

	angular.module('Controllers')
		.controller('SignUpCtrl', [
			'$scope',
			'$rootScope',
			'$timeout',
			'$state',
			'$analytics',
			'UsersServ',
			'dialog',
			function($scope, $rootScope, $timeout, $state, $analytics, UsersServ, dialog){

				var ideaId = $state.params.idea_id;
				var ideaUrl = $state.params.idea_url;

				//if modal, we need to setup the overlay functions
				if(dialog){

					$rootScope.viewingOverlay = true;
					$scope.closeOverlay = function(){
						$rootScope.viewingOverlay = false;
						dialog.close();
					};
					$analytics.pageTrack('users/signup');

				}else{

					$rootScope.viewingOverlay = false;
					$scope.closeOverlay = angular.noop;

				}
				
				$scope.finishSignUp = function(userId){

					$scope.closeOverlay();

					if(ideaId && ideaUrl){

						//transition to idea if ideaId and ideaUrl were passed in
						$state.transitionTo('idea', {'ideaId': ideaId, 'ideaUrl': ideaUrl, 'force': true});

					}else if($scope.developer == 0){

						//transition to profile page if not signed up as a developer
						$state.transitionTo('user', {'userId': userId});

					}else{

						//transition to home if signed up as a developer or other situations
						$state.transitionTo('home');

					}

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
							if($scope.developer == '0'){
								UsersServ.loginSession({
									email: $scope.email,
									password: $scope.password
								}, function(response){
									$scope.finishSignUp(response.content);
								});
							}else{
								$scope.finishSignUp();
							}
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