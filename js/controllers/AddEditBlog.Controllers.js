define(['angular'], function(angular){

	'use strict';

	angular.module('Controllers')
		.controller('AddEditBlogCtrl', [
			'$scope',
			'$rootScope',
			'$state',
			'$location',
			'$timeout',
			'BlogDataServ',
			'BlogServ',
			'dialog',
			function($scope, $rootScope, $state, $location, $timeout, BlogDataServ, BlogServ, dialog){

				//NEEDS POLYAUTH (this person must be logged in to access this stuff) loggedInAdmin!!

				if(dialog){
					$rootScope.viewingOverlay = true;
					$scope.closeOverlay = function(value){
						$rootScope.viewingOverlay = false;
						dialog.close(value);
					};
				}else{
					$rootScope.viewingOverlay = false;
					$scope.closeOverlay = angular.noop;
				}

				try{
					//this will cause a deep type error if the $state object does not exist
					$scope.action = $state.current.data.action;
				}catch(e){
					$scope.action = dialog.options.customOptions.action;
				}

				if($scope.action === 'edit'){
					try{
						var blogId = $state.params.blogId;
						var blogUrl = $state.params.blogUrl;
					}catch(e){
						var blogId = dialog.options.customOptions.blogId;
						var blogUrl = dialog.options.customOptions.blogUrl;
					}
				}

				$scope.notFoundError = false;
				$scope.validationErrors = false;

				var fillUpPayload = function(){

					var newBlog = {
						title: $scope.addBlogTitle,
						description: $scope.addBlogDescription
					};

					return newBlog;

				};

				if($scope.action === 'add'){

					$scope.addAction = true;

					$scope.submitBlog = function(){

						var newBlog = fillUpPayload();

						var successSave = function(response){

							var newBlogId = response.content;

							BlogServ.get(
								{
									id: newBlogId
								},
								function(response){

									$scope.successSubmit = 'Successfully Added Blog';
									$timeout(function(){
										if(dialog){
											BlogDataServ.prependBlog(response.content);
											$scope.closeOverlay();
										}else{
											$state.transitionTo('blog', {blogId: newBlogId, blogUrl: response.content.titleUrl});
										}
									}, 1000);

								},
								function(response){

									$scope.validationErrors = ['Was not able to read the new blog. Try submitting again.'];

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

						BlogServ.save(
							{},
							newBlog,
							successSave,
							failedSave
						);

					};

				}else if($scope.action === 'edit'){

					$scope.editAction = true;

					BlogServ.get(
						{
							id: blogId
						},
						function(response){

							if(!dialog){
								if(response.content.titleUrl !== blogUrl){
									$location.path(
										'blog/edit' 
										+ '/' 
										+ blogId 
										+ '/' 
										+ response.content.titleUrl
									);
								}
							}

							$scope.addBlogTitle = response.content.title;
							$scope.addBlogDescription = response.content.description;

						},
						function(response){

							$scope.notFoundError = response.data.content;

						}
					);

					$scope.submitBlog = function(){

						var updatedBlog = fillUpPayload();

						var successUpdate = function(response){

							var updatedBlogId = response.content;

							//if it was a success response, but with code error, then that just means nothing needed to be updated
							if(response.code !== 'error'){

								$scope.successSubmit = 'Successfully Updated Blog';
								$timeout(function(){
									if(dialog){
										//passing true to the finishing function will make the blog post reget the updated post
										$scope.closeOverlay(true);
									}else{
										$state.transitionTo('blog', {blogId: updatedBlogId, blogUrl: response.content.titleUrl});
									}
								}, 1000);

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

						BlogServ.update(
							{
								id: blogId
							},
							updatedBlog,
							successUpdate,
							failedUpdate
						);

					};

					$scope.deleteBlog = function(){

						BlogServ.delete(
							{
								id: blogId
							},
							function(response){

								if(response.code == 'error'){

									$scope.validationErrors = ['Failed to delete blog. ID does not exist.'];

								}else{

									$scope.successSubmit = 'Successfully Deleted Blog Post';
									$timeout(function(){
										if(dialog){
											$scope.closeOverlay();
										}else{
											$state.transitionTo('blog');
										}
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