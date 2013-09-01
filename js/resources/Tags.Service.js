define(['angular'], function(angular){

	'use strict';

	angular.module('Services')
		.factory('TagsServ', [
			'$resource',
			function($resource){
			
				return $resource(
					'api/tags/:id',
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