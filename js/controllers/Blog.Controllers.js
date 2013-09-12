define(['angular'], function(angular){

	'use strict';

	angular.module('Controllers')
		.controller('BlogCtrl', [
			'$scope',
			'$location',
			'$dialog',
			'UtilitiesServ',
			'BlogDataServ',
			'BlogServ',
			function($scope, $location, $dialog, UtilitiesServ, BlogDataServ, BlogServ){

				var defaultLimit = 20;

				var counterOffset = 0;

				BlogDataServ.clearBlogData();

				$scope.blog = BlogDataServ.getBlogData();

				$scope.blogServiceBusy = false;

				$scope.getBlog = function(limit){

					$scope.blogServiceBusy = true;

					var queryParameters = {
						limit: limit,
						offset: counterOffset
					};

					BlogServ.get(
						queryParameters,
						function(response){

							//increase the counterOffset
							counterOffset = counterOffset + limit;
							//concat doesn't preserve the reference, this push.apply() will
							$scope.blog.push.apply($scope.blog, response.content);
							$scope.blogServiceBusy = false;

						},
						function(response){

							$scope.blogServiceBusy = false;

						}
					);

				};

				var parseLimit = function(limit){

					if(!UtilitiesServ.empty(limit) && UtilitiesServ.isInteger(limit)){
						//limit is absolute valued and parsed as an integer
						limit = Math.abs(_.parseInt(limit));
					}else{
						limit = defaultLimit;
					}
					return limit;

				};

				//watches the query parameters for a potential limit
				$scope.$watch(function(){

						return $location.search();

					}, function(queryObject){

						$scope.limit = parseLimit(queryObject.limit);

					}, 
					true
				);

				$scope.openAddEditBlog = function(){

					if(UtilitiesServ.checkMinimumOverlayWidth()){
						$state.transitionTo('addBlog');
						return;
					}

					var dialog = $dialog.dialog({
						backdrop: false,
						keyboard: true,
						dialogClass: 'modal overlay_backdrop',
						templateUrl: 'add_edit_blog.html',
						controller: 'AddEditBlogCtrl',
						customOptions: {
							action: 'add'
						}
					});

					dialog.open();

				};

			}
		])
		.controller('PostCtrl', [
			'$scope',
			'$state',
			'BlogServ',
			function($scope, $state, BlogServ){

				$scope.post = {};

				$scope.getBlogPost = function(){

					BlogServ.get(
						{
							id: $state.params.blogId
						},
						function(response){

							if($state.params.blogUrl !== response.content.titleUrl){
								$location.path('blog' + '/' + $state.params.blogId + '/' + response.content.titleUrl);
							}

							$scope.post = response.content;


						},
						function(response){

							$scope.notFoundError = response.data.content;

						}
					);

				};

				$scope.getBlogPost();

				$scope.openAddEditBlog = function(){

					if(UtilitiesServ.checkMinimumOverlayWidth()){
						$state.transitionTo('editBlog', {blogId: $state.params.blogId, blogUrl: $state.params.blogUrl});
						return;
					}

					var dialog = $dialog.dialog({
						backdrop: false,
						keyboard: true,
						dialogClass: 'modal overlay_backdrop',
						templateUrl: 'add_edit_blog.html',
						controller: 'AddEditBlogCtrl',
						customOptions: {
							action: 'edit',
							blogId: $state.params.blogId,
							blogUrl: $state.params.blogUrl
						}
					});

					dialog.open().then(function(blogPostHasBeenUpdated){

						if(blogPostHasBeenUpdated){
							$scope.getBlogPost();
						}

					});

				};
				
			}
		]);

});