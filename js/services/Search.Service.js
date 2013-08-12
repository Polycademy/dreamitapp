define(['angular'], function(angular){

	'use strict';

	angular.module('Services')
		.service('SearchServ', [
			'$location',
			function($location){

				this.searchTag = function(tag){
					$location.search({'tags': tag});
				};

			}
		]);

});