define(['angular'], function(angular){

	'use strict';

	angular.module('Controllers')
		.controller('PasswordCtrl', [
			'$scope',
			'$rootScope',
			'$stateParams',
			'PasswordServ'
			function($scope, $rootScope, $stateParams, PasswordServ){

				var userId = $stateParams.user_id;
				var forgottenCode = $stateParams.forgotten_code;


				$scope.resetPassword =  function(){

				};
				

			}
		]);

});