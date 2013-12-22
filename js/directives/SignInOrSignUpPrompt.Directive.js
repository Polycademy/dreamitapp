define(['angular', 'jquery', 'twitter-bootstrap'], function(angular, $){

	'use strict';

	angular.module('Directives')
		.directive('signInOrSignUpPromptDir', [
			'$rootScope',
			'$timeout',
			function($rootScope, $timeout){
				return {
					priority: 1, //runs before the ng-click, so it can intercept it
					link: function(scope, element, attributes){

						//this only runs when the user is NOT logged in, meaning trigger should be false

						var trigger,
							reopenIdea;

						attributes.$observe('signInOrSignUpPromptDir', function(loggedIn){
							//directive attribute comes in as as string
							loggedIn = (loggedIn == 'true');
							trigger = loggedIn;
							if(!loggedIn){
								element.tooltip({
									title: attributes.signInOrSignUpPromptMessage,
									trigger: 'manual'
								});
							}else{
								element.tooltip('destroy');
							}
						});

						element.bind('click', function(event){

							scope.disableOverlay = false;

							if(!trigger){

								element.tooltip('show');
								$timeout(function(){
									element.tooltip('hide');
								}, 1000);

								//close any possible overlay that is currently open, this most likely is the idea overlay
								//it won't work on a full page idea
								try{
									scope.closeOverlay();
								}catch(e){}

								if(attributes.signInOrSignUpPromptIdeaId && attributes.signInOrSignUpPromptIdeaUrl){
									reopenIdea = {
										ideaId: attributes.signInOrSignUpPromptIdeaId,
										titleUrl: attributes.signInOrSignUpPromptIdeaUrl
									};
								}else{
									reopenIdea = false;
								}

								$rootScope.$broadcast('openSignInOrSignUp', reopenIdea);

								//prevents the opening of the overlay
								scope.disableOverlay = true;

								//stops the event propagation to prevent the href from working
								return false;

							}

						});

					}
				};
			}
		]);

});