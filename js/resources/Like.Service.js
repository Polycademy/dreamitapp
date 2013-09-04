define(['angular'], function(angular){

	'use strict';

	angular.module('Services')
		.factory('LikeServ', [
			'$resource',
			function($resource){
			
				return $resource(
					'api/like/:id',
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