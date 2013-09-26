define(['angular'], function(angular){

	'use strict';

	angular.module('Services')
		.factory('AboutServ', [
			'$resource',
			function($resource){
			
				return $resource(
					'api/about',
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