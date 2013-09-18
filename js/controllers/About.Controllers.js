define(['angular'], function(angular){

	'use strict';

	angular.module('Controllers')
		.controller('AboutCtrl', [
			'$scope',
			'EmailServ',
			function($scope, EmailServ){

				$scope.submitContact = function(){

					var newEmail = {
						toEmail: dreamItAppConfig.sitemeta.email,
						fromEmail: $scope.contactEmail,
						message: $scope.contactMessage
					};

					EmailServ.save({}, newEmail, function(response){

						$scope.successSubmit = true;

					}, function(response){

						$scope.validationErrors = [];
						if(response.data.code == 'validation_error'){
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