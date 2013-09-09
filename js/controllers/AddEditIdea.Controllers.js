define(['angular'], function(angular){

	'use strict';

	angular.module('Controllers')
		.controller('AddEditIdeaCtrl', [
			'$scope',
			'$injector',
			'$rootScope',
			'$state',
			'AppIdeasServ',
			'IdeasServ',
			'TagsServ',
			function($scope, $injector, $rootScope, $state, AppIdeasServ, IdeasServ, TagsServ){

				/** Dialog service is an optional dependency. This will determine if this controller is for an overlay or not */
				var dialog;
				try{
					dialog = $injector.get('dialog');
				}catch(e){
					dialog = false;
				}

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
				$scope.uploadImage = function(imageObject){
					//we only want the first and only image uploaded
					$scope.addIdeaImage = imageObject[0].url;
					$scope.addIdeaImageBlob = JSON.stringify(imageObject[0]);
					$scope.$apply();
				};

				//need a corresponding replace image 

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

				if($state.current.data.action === 'add'){

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


				}else if($state.current.data.action === 'edit'){

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
							$scope.addIdeaImageBlob = JSON.parse(response.content.imageBlob);
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