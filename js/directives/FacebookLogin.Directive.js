define(['angular'], function(angular){

	'use strict';

	angular.module('Directives')
		.service('FacebookLoginServ', [
			'$window',
			'$document',
			'$rootScope',
			function($window, $document, $rootScope){

				this.facebookSetup = false;

				this.FB = {};

				this.setupFacebookScript = function(){

					var that = this;
					$window.fbAsyncInit = function(){

						//once FB is loaded, FB object will be available
						$window.FB.init({
							appId : $rootScope.dreamItAppConfig.apiKeys.facebook, // App ID
							channelUrl : $rootScope.baseUrl + 'api/facebook', // Channel File
							status : true, // check login status
							cookie : true, // enable cookies to allow the server to access the session
							xfbml : true  // parse XFBML
						});

						that.FB = $window.FB;

					};

					var facebook = $document[0].createElement('script');
					facebook.id = 'facebook-jssdk';
					facebook.async = true;
					facebook.src = '//connect.facebook.net/en_US/all.js';
					($document[0].getElementsByTagName('head')[0] || $document[0].getElementsByTagName('body')[0]).appendChild(facebook);

					this.facebookSetup = true;

				};

			}
		])
		.directive('facebookLoginDir', [
			'$rootScope',
			'FacebookLoginServ',
			'OauthServ',
			'UsersServ',
			function($rootScope, FacebookLoginServ, OauthServ, UsersServ){
				return {
					scope: {
						facebookOverlayClose: '&'
					},
					link: function(scope, element, attributes){

						if(!FacebookLoginServ.facebookSetup){
							FacebookLoginServ.setupFacebookScript();
						}

						element.bind('click', function(){
							
							//login asking for the scope of email
							FacebookLoginServ.FB.login(
								function(response){

									if(response.authResponse){

										var accessToken = response.authResponse.accessToken;

										//send the accessToken to the Oauth resource,
										//if successfully got the user object back, broadcast the authenticationProvided event
										OauthServ.save({}, {
											accessToken: accessToken
										}, function(response){

											UsersServ.getAccount(response.content, function(response){

												//this close overlay is not working currently
												//http://stackoverflow.com/questions/12729122/prevent-error-digest-already-in-progress-when-calling-scope-apply
												scope.facebookOverlayClose();
												$rootScope.$broadcast('reloadWall');

											});

										});

									}

								}, 
								{ scope: 'email' }
							);

						});

					}
				};
			}
		]);

});