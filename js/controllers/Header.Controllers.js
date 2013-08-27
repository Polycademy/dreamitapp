define(['angular'], function(angular){

	'use strict';

	angular.module('Controllers')
		.controller('HeaderCtrl', [
			'$scope',
			'$rootScope',
			'$location',
			function($scope, $rootScope, $location){

				$scope.reloadWall = function(){
					$rootScope.$broadcast('reloadWall');
				};

			}
		]);

});