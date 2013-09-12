define(['angular'], function(angular){

	'use strict';

	angular.module('Services')
		.factory('BlogServ', [
			'$resource',
			function($resource){
			
				return $resource(
					'api/blog/:id',
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