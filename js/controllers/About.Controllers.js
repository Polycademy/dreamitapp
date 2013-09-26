define(['angular'], function(angular){

	'use strict';

	angular.module('Controllers')
		.controller('AboutCtrl', [
			'$scope',
			'EmailServ',
			'AboutServ',
			function($scope, EmailServ, AboutServ){

				AboutServ.get({}, function(response){
					//the object contains a content property!
					$scope.aboutContent = response.content.content;
				});

				$scope.submitContact = function(){

					var newEmail = {
						fromEmail: $scope.contactEmail,
						message: $scope.contactMessage,
						intention: 'enquiry' //this make sure to send to admin rather than standard contact
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