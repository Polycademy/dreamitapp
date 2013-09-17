define(['angular'], function(angular){

	'use strict';

	angular.module('Services')
		.factory('OauthServ', [
			'$resource',
			function($resource){
			
				return $resource(
					'api/oauth',
					{},
					{
						update: {
							method: 'PUT'
						}
					}
				);
			
			}
		]);

});