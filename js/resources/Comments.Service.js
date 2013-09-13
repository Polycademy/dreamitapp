define(['angular'], function(angular){

	'use strict';

	angular.module('Services')
		.factory('CommentsServ', [
			'$resource',
			function($resource){
			
				return $resource(
					'api/comments/:id',
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