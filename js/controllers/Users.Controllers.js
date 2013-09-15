define(['angular', 'lodash'], function(angular, _){

	'use strict';

	angular.module('Controllers')
		.controller('UserCtrl', [
			'$scope',
			'$state',
			'$location',
			'AccountsServ',
			function($scope, $state, $location, AccountsServ){

				//requires POLYAUTH! we need to see if they own this resource
				$scope.loggedInAndOwns = true;

				$scope.user = {};

				$scope.getUser = function(){

					AccountsServ.get({
						id: $state.params.userId
					}, function(response){

						if($state.params.userUrl !== response.content.usernameUrl){
							$location.path('users' + '/' + $state.params.userId + '/' + response.content.usernameUrl);
						}

						$scope.user = response.content;

					}, function(response){

						$scope.notFoundError = response.data.content;

					});

				};

				$scope.getUser();

				$scope.openEditProfile = function(){

					if(UtilitiesServ.checkMinimumOverlayWidth()){
						$state.transitionTo('editProfile', {userId: $state.params.userId, userUrl: $state.params.userUrl});
						return;
					}

					var dialog = $dialog.dialog({
						backdrop: false,
						keyboard: true,
						dialogClass: 'modal overlay_backdrop',
						templateUrl: 'edit_user.html',
						controller: 'EditUserCtrl',
						customOptions: {
							userId: $state.params.userId,
							userUrl: $state.params.userUrl
						}
					});

					dialog.open().then(function(userHasBeenUpdated){

						if(userHasBeenUpdated){
							$scope.getUser();
						}

					});

				};

			}
		]);

});