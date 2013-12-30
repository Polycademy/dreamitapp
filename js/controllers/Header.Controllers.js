define(['angular'], function(angular){

	'use strict';

	angular.module('Controllers')
		.controller('HeaderCtrl', [
			'$scope',
			'$rootScope',
			'$dialog',
			function($scope, $rootScope, $dialog){

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

					dialog.open();

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