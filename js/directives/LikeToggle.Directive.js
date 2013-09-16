define(['angular', 'bootstrap'], function(angular){

	'use strict';

	angular.module('Directives')
		.directive('likeToggleDir', [
			'$rootScope',
			'$timeout',
			'LikeServ',
			function($rootScope, $timeout, LikeServ){
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

						if(!$rootScope.loggedIn){
							element.tooltip({
								title: 'Sign in to like ideas!',
								trigger: 'manual'
							});
						}

						element.bind('click', function(){

							if(!$rootScope.loggedIn){
								element.tooltip('show');
								$timeout(function(){
									element.tooltip('hide');
								}, 1000);
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