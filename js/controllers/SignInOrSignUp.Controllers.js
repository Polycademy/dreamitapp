define(['angular'], function(angular){

	'use strict';

	angular.module('Controllers')
		.controller('SignInOrSignUpModalCtrl', [
			'$scope',
			'$rootScope',
			'$state',
			'$window',
			'dialog',
			function($scope, $rootScope, $state, $window, dialog){

				var previousIdea = dialog.options.customOptions.previousIdea;

				if(previousIdea){
					$scope.redirect = '?idea_id=' + $window.encodeURIComponent(previousIdea.ideaId) + '&idea_url=' + $window.encodeURIComponent(previousIdea.ideaUrl);
				}

				$scope.closeOverlay = function(){

					dialog.close();

					if(previousIdea){
						//if it closes by itself, it needs to reopen the previous idea
						$state.transitionTo('idea', {
							ideaId: previousIdea.ideaId, 
							ideaUrl: previousIdea.ideaUrl, 
							force: 'true'
						});
					}

				};

				$scope.transitionToSignInOrSignUp = function(){

					dialog.close();
					
				};

			}
		]);

});