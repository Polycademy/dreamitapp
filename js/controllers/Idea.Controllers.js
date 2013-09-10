define(['angular'], function(angular){

	'use strict';

	angular.module('Controllers')
		.controller('IdeaCtrl', [
			'$scope',
			'$rootScope',
			'$state',
			'$location',
			'IdeasServ',
			'LikeServ',
			'dialog',
			function($scope, $rootScope, $state, $location, IdeasServ, LikeServ, dialog){

				//if dialog is passed in, we're inside an overlay and we need the ideaId and locationParamsAndHash
				if(dialog){

					$rootScope.viewingOverlay = true;
					var ideaId = dialog.options.customOptions.ideaId;
					var locationParamsAndHash = dialog.options.customOptions.locationParamsAndHash;
					$scope.closeOverlay = function(){
						$rootScope.viewingOverlay = false;
						dialog.close(locationParamsAndHash);
					};

				//else we only need ideaId and ideaUrl
				}else{

					$rootScope.viewingOverlay = false;
					var ideaId = $state.params.ideaId;
					var ideaUrl = $state.params.ideaUrl;

				}

				$scope.idea = {};

				IdeasServ.get(
					{
						id: ideaId
					},
					function(response){

						//if the url passed into stateParams was different, we're going to make sure its the correct url
						if(!dialog && ideaUrl !== response.content.titleUrl){
							$location.path('ideas' + '/' + ideaId + '/' + response.content.titleUrl);
						}

						$scope.idea = response.content;

					},
					function(response){

						$scope.notFoundError = response.data.content;

					}
				);

				/**
				 * Plus one or minus one like
				 * @param  {Integer} ideaId Id of the idea
				 * @return {Void}
				 */
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

				/**
				 * Handles the tag links, if it's in an overlay, it will implement the tag query parameter and close
				 * the overlay. This will happen at the home. If not in an overlay, it will just do nothing. And the
				 * link will redirect to the home.
				 * @param  {String} tag Tag string
				 * @return {Void}
				 */
				$scope.tagAction = function(tag){

					if(dialog){
						locationParamsAndHash.tags = tag;
						$scope.closeOverlay();
					}

				};

			}
		]);

});