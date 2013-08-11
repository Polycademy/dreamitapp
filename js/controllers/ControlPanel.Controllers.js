define(['angular'], function(angular){

	'use strict';

	angular.module('Controllers')
		.controller('ControlPanelCtrl', [
			'$scope',
			'SearchServ',
			function($scope, SearchServ){

				$scope.submitSearch = function(){
					SearchServ.searchTag($scope.search);
				};

			}
		]);

});