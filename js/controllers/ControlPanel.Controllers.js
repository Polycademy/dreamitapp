define(['angular', 'lodash'], function(angular, _){

	'use strict';

	angular.module('Controllers')
		.controller('ControlPanelCtrl', [
			'$scope',
			'SearchServ',
			function($scope, SearchServ){

				$scope.submitSearch = function(){
					SearchServ.searchTag($scope.searchTag);
				};

				//we want to run this only after someone has finished typing
				//we can't use debounce because ng-change doesn't trigger the debounce after typing stopped
				//but throttle only delays the function execution, it doesn't ignore it
				$scope.submitSearchThrottled = _.throttle($scope.submitSearch, 600);

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