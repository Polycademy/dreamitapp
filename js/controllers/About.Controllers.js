define(['angular'], function(angular){

	'use strict';

	angular.module('Controllers')
		.controller('AboutCtrl', [
			'$scope',
			function($scope){

				$scope.searchTag = '';

				$scope.doSomething = function(){
					console.log($scope);
					console.log($scope.searchTag);
				};

			}
		]);

});