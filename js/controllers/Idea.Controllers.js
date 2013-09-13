define(['angular'], function(angular){

	'use strict';

	angular.module('Controllers')
		.controller('IdeaCtrl', [
			'$scope',
			'$rootScope',
			'$state',
			'$location',
			'$dialog',
			'IdeasServ',
			'LikeServ',
			'dialog',
			function($scope, $rootScope, $state, $location, $dialog, IdeasServ, LikeServ, dialog){

				//if dialog is passed in, we're inside an overlay and we need the ideaId and locationParamsAndHash
				if(dialog){

					$rootScope.viewingOverlay = true;
					var ideaId = dialog.options.customOptions.ideaId;
					var ideaUrl = dialog.options.customOptions.ideaUrl;
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
					$scope.closeOverlay = angular.noop;

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

				$scope.contactAuthor = function(authorId, ideaId){

					var dialog = $dialog.dialog({
						backdrop: false,
						keyboard: false,
						dialogClass: 'modal',
						templateUrl: 'developer_contact.html',
						controller: 'DeveloperContactCtrl',
						customOptions: {
							ideaId: ideaId,
							ideaUrl: ideaUrl,
							ideaTitle: $scope.idea.title,
							author: $scope.idea.author,
							authorId: $scope.idea.authorId
						}
					});

					dialog.open();

				};

				//////////////////
				// EDIT OVERLAY //
				//////////////////

				//this will be dependent upon being logged in and owning the current idea, you will send a request to see if it is true
				$scope.loggedInAndOwns = true;

				$scope.openEditIdeaOverlay = function(){

					if(dialog){
						$scope.closeOverlay();
					}
					$state.transitionTo('editIdea', {ideaId: ideaId, ideaUrl: ideaUrl});

				};

			}
		])
		.controller('DeveloperContactCtrl', [
			'$scope',
			'$timeout',
			'EmailServ',
			'dialog',
			function($scope, $timeout, EmailServ, dialog){

				var author = dialog.options.customOptions.author,
					authorId = dialog.options.customOptions.authorId,
					ideaId = dialog.options.customOptions.ideaId,
					ideaUrl = dialog.options.customOptions.ideaUrl,
					ideaTitle = dialog.options.customOptions.ideaTitle;

				$scope.closeOverlay = function(){
					dialog.close();
				};

				//for the template
				$scope.author = dialog.options.customOptions.author;

				//getting author details using authorId (POLYAUTH)
				var authorEmail = 'roger.qiu@polycademy.com';
				var currentUser = 'Roger Qiu';
				var currentUserEmail = 'cmcdragonkai@gmail.com'

				$scope.submitContact = function(){

					var newEmail = {
						toEmail: authorEmail,
						fromEmail: currentUserEmail,
						message: $scope.contactMessage,
						authorName: author,
						senderName: currentUser,
						ideaId: ideaId,
						ideaUrl: ideaUrl,
						ideaTitle: ideaTitle
					};

					EmailServ.save({}, newEmail, function(response){

						$scope.successSubmit = 'Successfully sent message!';
						$timeout(function(){
							dialog.close();
						}, 1000);

					}, function(response){

						$scope.validationErrors = [];
						if(response.data.code = 'validation_error'){
							for(var key in response.data.content){
								$scope.validationErrors.push(response.data.content[key]); 
							}
						}else{
							$scope.validationErrors = [response.data.content];
						}

					});

				};

			}
		]);

});