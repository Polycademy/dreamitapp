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
			'AppIdeasServ',
			'IdeasServ',
			'TagsServ',
			'dialog',
			function($scope, $rootScope, $state, AppIdeasServ, IdeasServ, TagsServ, dialog){

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
				var action = '';
				try{
					//this will cause a deep type error if the $state object does not exist
					action = $state.current.data.action;
				}catch(e){
					action = dialog.options.customOptions.action;
				}

				/** Default field parameters */
				$scope.notFoundError = false;
				$scope.addIdeaTags = [];
				$scope.addIdeaTagsOptions = {
					tags: [],
					maximumInputLength: 20
				};
				$scope.addIdeaPrivacy = 'privacy';
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

				if(action === 'add'){

					$scope.filePickerAction = 'pickAndStore';

					$scope.submitIdea = function(){

						var newIdea = fillUpPayload();

						var successSave = function(response){

							IdeasServ.get(
								{
									id: response.content
								},
								function(response){

									AppIdeasServ.prependIdeas(response.content);
									$scope.closeOverlay();

								},
								function(response){

									//dont close the overlay, show the error via the validation errors, and allow resubmitting
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
							}

						};

						IdeasServ.save(
							{},
							newIdea,
							successSave,
							failedSave
						);

					};


				}else if(action === 'edit'){

					$scope.filePickerAction = 'update';

					//first we're going to try to get the idea's properties before 
					var ideaId = $state.params.ideaId;

					IdeasServ.get(
						{
							id: ideaId
						},
						function(response){

							$scope.addIdeaTitle = response.content.title;
							$scope.addIdeaDescriptionShort = response.content.descriptionShort;
							$scope.addIdeaImage = response.content.image;
							$scope.addIdeaImageBlob = response.content.imageBlob;
							$scope.addIdeaDescription = response.content.description;
							$scope.addIdeaPrivacy = response.content.privacy;
							$scope.addIdeaTags = response.content.tags; //will this work?

						},
						function(response){

							$scope.notFoundError = response.data.content;

						}
					);

					$scope.submitIdea = function(){

						var updatedIdea = fillUpPayload();

						var successUpdate = function(response){

							var updatedIdeaId = response.content;

							IdeasServ.get(
								{
									id: updatedIdeaId
								},
								function(response){

									//update it on the wall, if the wall contains the relevant item
									AppIdeasServ.replaceIdea(updatedIdeaId, response.content);
									$scope.closeOverlay();

								},
								function(response){

									$scope.validationErrors = ['Was not able to read the updated idea. Try submitting again.'];

								}
							);

						};

						var failedUpdate = function(response){

							$scope.validationErrors = [];
							if(response.data.code = 'validation_error'){
								for(var key in response.data.content){
									$scope.validationErrors.push(response.data.content[key]); 
								}
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

				}

			}
		]);

});