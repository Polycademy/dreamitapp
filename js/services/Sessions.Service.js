define(['angular', 'deps'], function(angular){

	'use strict';

	angular.module('Services')
		.factory('SessionsServ', [
			'$resource',
			function($resource){
			
				return $resource(
					'api/sessions/:id',
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