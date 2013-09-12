define(['angular'], function(angular){

	'use strict';

	/**
	 * Add Edit Idea Controller. This is a controller for adding and editing ideas. This is for both
	 * the overlay and the full page.
	 * When using modal dialog to open this controller, make sure to set customOptions.action = 'add'/'edit'
	 * on the dialog options.
	 * When using the state router to open this controller, make sure to set data.action = 'add'/'edit' and 
	 * set a resolve.dialog to a function that returns null. This is make sure the dependency injector doesn't 
	 * fail when it doesn't receive the dialog service instance that is used by the overlay.
	 */
	angular.module('Controllers')
		.controller('AddEditIdeaCtrl', [
			'$scope',
			'$rootScope',
			'$state',
			'$location',
			'$timeout',
			'AppIdeasServ',
			'IdeasServ',
			'TagsServ',
			'dialog',
			function($scope, $rootScope, $state, $location, $timeout, AppIdeasServ, IdeasServ, TagsServ, dialog){

				/** If dialog is available, switch on overlay and provide a closeOverlay function */
				if(dialog){
					$rootScope.viewingOverlay = true;
					$scope.closeOverlay = function(){
						$rootScope.viewingOverlay = false;
						dialog.close();
					};
				}else{
					$rootScope.viewingOverlay = false;
					$scope.closeOverlay = angular.noop;
				}

				/** Action of "edit" or "add" must either come from the state, or the dialog. */
				try{
					//this will cause a deep type error if the $state object does not exist
					$scope.action = $state.current.data.action;
				}catch(e){
					$scope.action = dialog.options.customOptions.action;
				}

				/** If the action is "edit" we'll need to grab the ideaId either from state params or dialog options. */
				if($scope.action === 'edit'){
					try{
						var ideaId = dialog.options.customOptions.ideaId;
						var ideaUrl = dialog.options.customOptions.ideaUrl;
					}catch(e){
						var ideaId = $state.params.ideaId;
						var ideaUrl = $state.params.ideaUrl;
					}
				}

				/** Default field parameters */
				$scope.notFoundError = false;
				$scope.addIdeaTags = [];
				$scope.addIdeaTagsOptions = {
					tags: [],
					maximumInputLength: 20
				};
				$scope.addIdeaPrivacy = 'public';
				$scope.validationErrors = false;

				/** This will fill up the tags field with a list of suggested tags */
				TagsServ.get({
					popular: true,
					trending: true,
					limit: 20
				}, function(response){
					for(var i = 0; i < response.content.length; i++){
						$scope.addIdeaTagsOptions.tags.push(response.content[i].tag);
					}
				});

				/**
				 * Upload image function for FilePicker.
				 * This function will be executed inside the scope of FilePicker, requiring a digest loop.
				 * @param  {Array} imageObject Array of FilePicker InkBlob image objects
				 * @return {Void}
				 */
				$scope.processImage = function(imageObject){

					$scope.addIdeaImage = imageObject[0].url;
					$scope.addIdeaImageBlob = JSON.stringify(imageObject[0]);

					//once we have the new image, we're going to switch to updating in case the user decides to change the image while creating a new idea
					$scope.filePickerAction = 'update';

					$scope.$apply();

				};

				/**
				 * Querys the fields and creates a payload object for creating or updating ideas.
				 * @return {Object}
				 */
				var fillUpPayload = function(){

					var newIdea = {
						title: $scope.addIdeaTitle,
						descriptionShort: $scope.addIdeaDescriptionShort,
						image: $scope.addIdeaImage,
						imageBlob: $scope.addIdeaImageBlob,
						description: $scope.addIdeaDescription,
						tags: [],
						privacy: $scope.addIdeaPrivacy
					};

					//addIdeaTags is an array of objects containg the "text" property
					for(var i=0; i<$scope.addIdeaTags.length; i++){
						newIdea.tags.push($scope.addIdeaTags[i].text);
					}

					return newIdea;

				};

				if($scope.action === 'add'){

					$scope.addAction = true;
					$scope.filePickerAction = 'pickAndStore';

					$scope.submitIdea = function(){

						var newIdea = fillUpPayload();

						var successSave = function(response){

							var newIdeaId = response.content;

							IdeasServ.get(
								{
									id: newIdeaId
								},
								function(response){

									$scope.successSubmit = 'Successfully Added Idea';
									$timeout(function(){
										if(dialog){
											AppIdeasServ.prependIdea(response.content);
											$scope.closeOverlay();
										}else{
											//if in full page, just transition to the full page idae
											$state.transitionTo('idea', {ideaId: newIdeaId, ideaUrl: response.content.titleUrl});
										}
									}, 1000);

								},
								function(response){

									$scope.validationErrors = ['Was not able to read the new idea. Try submitting again.'];

								}
							);

						};

						var failedSave = function(response){

							$scope.validationErrors = [];
							if(response.data.code = 'validation_error'){
								//the content would be an object of fields to errors
								for(var key in response.data.content){
									$scope.validationErrors.push(response.data.content[key]); 
								}
							}else{
								$scope.validationErrors = [response.data.content];
							}

						};

						IdeasServ.save(
							{},
							newIdea,
							successSave,
							failedSave
						);

					};


				}else if($scope.action === 'edit'){

					$scope.editAction = true;
					$scope.filePickerAction = 'update';

					IdeasServ.get(
						{
							id: ideaId
						},
						function(response){

							//if we're in fullpage, the titleUrl should match the true url
							if(!dialog){
								if(response.content.titleUrl !== ideaUrl){
									$location.path(
										'ideas/edit' 
										+ '/' 
										+ ideaId 
										+ '/' 
										+ response.content.titleUrl
									);
								}
							}

							$scope.addIdeaTitle = response.content.title;
							$scope.addIdeaDescriptionShort = response.content.descriptionShort;
							$scope.addIdeaImage = response.content.image;
							$scope.addIdeaImageBlob = response.content.imageBlob;
							$scope.addIdeaDescription = response.content.description;
							$scope.addIdeaPrivacy = response.content.privacy;
							var tagObjectArray = [];
							for(var i=0;i<response.content.tags.length;i++){
								tagObjectArray.push({
									id: response.content.tags[i],
									text: response.content.tags[i]
								});
							}
							$scope.addIdeaTags = tagObjectArray;

						},
						function(response){

							$scope.notFoundError = response.data.content;

						}
					);

					$scope.submitIdea = function(){

						var updatedIdea = fillUpPayload();

						var successUpdate = function(response){

							var updatedIdeaId = response.content;

							//if it was a success response, but with code error, then that just means nothing needed to be updated
							if(response.code !== 'error'){

								IdeasServ.get(
									{
										id: updatedIdeaId
									},
									function(response){

										$scope.successSubmit = 'Successfully Updated Idea';
										$timeout(function(){
											//if in full page, just transition to the full page idea
											$state.transitionTo('idea', {ideaId: updatedIdeaId, ideaUrl: response.content.titleUrl});
										}, 1000);

									},
									function(response){

										$scope.validationErrors = ['Was not able to read the updated idea. Try submitting again.'];

									}
								);

							}else{

								$scope.validationErrors = [response.content];

							}

						};

						var failedUpdate = function(response){

							$scope.validationErrors = [];
							if(response.data.code = 'validation_error'){
								for(var key in response.data.content){
									$scope.validationErrors.push(response.data.content[key]); 
								}
							}else{
								$scope.validationErrors = [response.data.content];
							}

						};

						IdeasServ.update(
							{
								id: ideaId
							},
							updatedIdea,
							successUpdate,
							failedUpdate
						);

					};

					$scope.deleteIdea = function(){

						IdeasServ.delete(
							{
								id: ideaId
							},
							function(response){

								if(response.code == 'error'){

									$scope.validationErrors = ['Failed to delete idea. ID does not exist.'];

								}else{

									$scope.successSubmit = 'Successfully Deleted Idea';
									$timeout(function(){
										$state.transitionTo('home');
									}, 1000);

								}

							},
							function(response){

								$scope.validationErrors = [response.data.content];

							}
						)
						
					};

				}

			}
		]);

});