define(['angular'], function(angular){

	'use strict';

	angular.module('Services')
		.factory('IdeasServ', [
			'$resource',
			function($resource){
			
				return $resource(
					'api/ideas/:id',
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