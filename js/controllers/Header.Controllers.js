define(['angular'], function(angular){

	'use strict';

	angular.module('Controllers')
		.controller('HeaderCtrl', [
			'$scope',
			'$rootScope',
			'$dialog',
			'$timeout',
			function($scope, $rootScope, $dialog, $timeout){

				$scope.reloadWall = function(){
					$rootScope.$broadcast('reloadWall');
				};

				/**
				 * Open Sign In or Sign Up Modal
				 * @param  {Object} reopenIdea An object containing {id, titleUrl}
				 */
				var openSignInOrSignUpModal = function(reopenIdea){

					var dialog = $dialog.dialog({
						backdrop: false,
						keyboard: false,
						dialogClass: 'modal',
						templateUrl: 'signin_or_signup_modal.html',
						controller: 'SignInOrSignUpModalCtrl',
						customOptions: {
							previousIdea: reopenIdea
						}
					});

					//delay the execution to allow the DOM to finish updating or other important work
					//could cause bugs if this is not done
					$timeout(function(){
						dialog.open();
					}, 0);

				};

				var signInOrUpModalListener = $rootScope.$on('openSignInOrSignUp', function(event, args){
					openSignInOrSignUpModal(args);
				});

				//clear any possible event memory leak
				$scope.$on('$destroy', function() {
					signInOrUpModalListener();
				});

			}
		]);

});