define(['angular', 'jquery', 'twitter-bootstrap'], function(angular, $){

	'use strict';

	angular.module('Directives')
		.directive('signInPromptDir', [
			'$rootScope',
			'$timeout',
			function($rootScope, $timeout){
				return {
					link: function(scope, element, attributes){

						var trigger;

						attributes.$observe('signInPromptDir', function(value){
							value = (value == 'true');
							trigger = value;
							if(!value){
								element.tooltip({
									title: attributes.signInPromptMessage,
									trigger: 'manual'
								});
							}else{
								element.tooltip('destroy');
							}
						});

						element.bind('click', function(){

							if(!trigger){
								element.tooltip('show');
								$timeout(function(){
									element.tooltip('hide');
								}, 1000);

								//crap code but who cares anymore
								try{
									scope.closeOverlay();
								}catch(e){}
								$rootScope.$broadcast('closeIdeaOpenSignUp', {
									ideaId: attributes.signInPromptIdeaId,
									titleUrl: attributes.signInPromptIdeaUrl
								});

								return false;
							}

						});

					}
				};
			}
		]);

});