define(['angular'], function(angular){

	'use strict';

	angular.module('Controllers')
		.controller('BlogCtrl', [
			'$scope',
			'$location',
			'UtilitiesServ',
			'BlogDataServ',
			'BlogServ',
			function($scope, $location, UtilitiesServ, BlogDataServ, BlogServ){

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

			}
		])
		.controller('PostCtrl', [
			'$scope',
			'$state',
			'BlogServ',
			function($scope, $state, BlogServ){

				$scope.post = {};

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
				
			}
		]);

});