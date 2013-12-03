define(['angular'], function(angular){

	'use strict';

	angular.module('Controllers')
		.controller('PasswordCtrl', [
			'$scope',
			'$rootScope',
			'$stateParams',
			'PasswordServ',
			'UtilitiesServ',
			function($scope, $rootScope, $stateParams, PasswordServ, UtilitiesServ){

				var userId = $stateParams.user_id;
				var forgottenCode = $stateParams.forgotten_code;

				$scope.notFoundError = false;
				$scope.validationErrors = false;

				if(!userId || !forgottenCode){
					$scope.notFoundError = 'This is page is for resetting passwords, you should go back to Home.';
				}

				var fillUpPayload = function(){

					var newPassword = {
						userId: userId,
						forgottenCode: forgottenCode,
						newPassword: $scope.newPassword,
						newPasswordConfirm: $scope.newPasswordConfirm
					};

					return newPassword;

				};

				$scope.resetPassword =  function(){

					var newPassword = fillUpPayload();

					PasswordServ.complete.save({}, newPassword, function(response){

						$scope.successSubmit = 'Successfully Reset Password.';

					}, function(response){

						$scope.validationErrors = [];
						//detect if response.data.content is an array (if so cycle and push)
						//else just equate
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
		]);

});