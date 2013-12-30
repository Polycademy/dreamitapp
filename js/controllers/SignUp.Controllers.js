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
					$analytics.pageTrack('users/signup');

				}else{

					$rootScope.viewingOverlay = false;
					$scope.closeOverlay = angular.noop;

				}

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
							$scope.closeOverlay();
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