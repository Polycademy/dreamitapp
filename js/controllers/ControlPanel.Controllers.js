define(['angular'], function(angular){

	'use strict';

	angular.module('Controllers')
		.controller('ControlPanelCtrl', [
			'$scope',
			'SearchServ',
			function($scope, SearchServ){

				$scope.searchTag = '';

				$scope.submitSearch = function(){
					console.log($scope.searchTag);
					SearchServ.searchTag($scope.search);
				};

				$scope.popularTags = [
					'popular',
					'tags',
					'are',
					'listed',
					'here'
				];

				$scope.loggedIn = true;

			}
		]);

});