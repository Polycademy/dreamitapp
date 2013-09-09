define(['angular'], function(angular){

	'use strict';

	angular.module('Controllers')
		.controller('IdeaCtrl', [
			'$scope',
			'$state',
			'$location',
			'IdeasServ',
			'LikeServ',
			function($scope, $state, $location, IdeasServ, LikeServ){

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
								'ideas' 
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

				$scope.likeAction = function(ideaId){

					LikeServ.update(
						{
							id: ideaId
						},
						false,
						function(response){

							LikeServ.get({
								id: ideaId
							}, function(response){

								$scope.idea.likes = response.content.likes;

							});

						}
					);

				};

			}
		]);

});