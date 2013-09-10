define(['angular'], function(angular){

	'use strict';

	angular.module('Services')
		.factory('EmailServ', [
			'$resource',
			function($resource){
			
				return $resource('api/email');
			
			}
		]);

});