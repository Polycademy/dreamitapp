define(['angular'], function(angular){

	'use strict';

	angular.module('Services')
		.run([
			'$rootScope',
			'$location',
			'$timeout',
			'$anchorScroll',
			function($rootScope, $location, $timeout, $anchorScroll){

				//later on this can be improved to only happen after all HTTP requests have finished after a certain delay
				$rootScope.$on('$locationChangeSuccess', function(){
					if($location.hash()){
						$timeout(function(){
							$anchorScroll();
						}, 1000);
					}
				});

			}
		]);

});