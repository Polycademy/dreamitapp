define(['angular'], function(angular){

	'use strict';

	angular.module('Controllers')
		.controller('HeaderCtrl', [
			'$scope',
			'$rootScope',
			function($scope, $rootScope){

				$scope.reloadWall = function(){
					$rootScope.$broadcast('reloadWall');
				};

			}
		]);

});