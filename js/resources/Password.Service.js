define(['angular'], function(angular){

	'use strict';

	angular.module('Services')
		.factory('PasswordServ', [
			'$resource',
			function($resource){

				//pass an identifier via GET
				var initiateForgottenPassword = $resource('api/accounts/forgotten_password/:identity');
				//pass userId, forgottenCode, newPassword, newPasswordConfirm via POST
				var completeForgottenPassword = $resource('api/accounts/confirm_forgotten_password');

				return {
					'initiate': initiateForgottenPassword,
					'complete': completeForgottenPassword
				};

			}
		]);

});