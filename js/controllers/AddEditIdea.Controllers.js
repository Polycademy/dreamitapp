define(['angular'], function(angular){

	'use strict';

	angular.module('Controllers')
		.controller('AddEditIdeaCtrl', [
			'$scope',
			'$state',
			function($scope, $state){

				//this will be a federated controller for both adding and editing (depending on the data's action)
				//will eventually be federated towards the overlay aswell!

				console.log($state.current.data.action);

			}
		]);

});