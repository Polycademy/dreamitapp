define(['angular'], function(angular){

	'use strict';

	angular.module('Directives')
		.directive('likeToggleDir', [
			'$rootScope',
			'LikeServ',
			function($rootScope, LikeServ){
				return {
					link: function(scope, element, attributes){

						//likeId will need to be observed...
						var index,
							ideaId;

						attributes.$observe('likeIndex', function(value){
							index = value;
						});

						attributes.$observe('likeId', function(value){
							ideaId = value;
						});

						element.bind('click', function(){

							if(!$rootScope.loggedIn){
								return false;
							}

							LikeServ.update(
								{
									id: ideaId
								},
								false,
								function(response){

									LikeServ.get({
										id: ideaId
									}, function(response){

										scope.appIdeas[index].likes = response.content.likes;

									});

								}
							);

						});

					}
				};
			}
		]);

});