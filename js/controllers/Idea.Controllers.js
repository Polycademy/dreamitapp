define(['angular'], function(angular){

	'use strict';

	angular.module('Controllers')
		.controller('IdeaCtrl', [
			'$scope',
			'$state',
			'$location',
			'IdeasServ',
			function($scope, $state, $location, IdeasServ){

				var stateParams = $state.params;

				$scope.idea = {};

				IdeasServ.get(
					{
						id: stateParams.ideaId
					},
					function(response){

						//if the url passed into stateParams was different, we're going to make sure its the correct url
						if(response.content.titleUrl !== stateParams.ideaUrl){
							$location.path(
								$state.current.name 
								+ '/' 
								+ stateParams.ideaId 
								+ '/' 
								+ response.content.titleUrl
							);
						}

						$scope.idea = response.content;

					},
					function(response){

						$scope.idea.errorMessage = response.data.content;

					}
				);

			}
		]);

});