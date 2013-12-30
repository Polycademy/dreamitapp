define(['angular'], function(angular){

	'use strict';

	angular.module('Controllers')
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
		]);
		
});