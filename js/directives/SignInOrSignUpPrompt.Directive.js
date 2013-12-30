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
							trigger = (loggedIn == 'true');
						});

						element.bind('click', function(event){

							//allow the overlay
							scope.disableOverlay = false;

							if(!trigger){

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

								//prevent the idea overlay from opening up
								scope.disableOverlay = true;

								//if there was a reopen idea, then we need to cancel the href change event
								//if there wasn't a reopen idea, then there's probably no href change event
								//most likely from the I Have An Idea button
								//stopPropagation() actually stops AngularJS from changing the URL because the anchor element is a directive
								if(reopenIdea){
									event.preventDefault();
									event.stopPropagation();
								}

							}

						});

					}
				};
			}
		]);

});