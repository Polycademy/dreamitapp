define(['angular', 'addthis'], function(angular, addthis){

	'use strict';

	/**
	 * Implements an addthis button on the element. Works with dynamically produced elements.
	 * You can provide addThisConfig and addThisShare as JSON or evaluated objects to configure the buttons
	 */
	angular.module('Directives')
		.directive('addThisDir', [
			function(){
				return {
					scope:{
						addThisUrl: '@',
						addThisTitle: '@',
						addThisDescription: '@'
					},
					link: function(scope, element, attributes){

						var addThisConfig = scope.$eval(attributes.addThisConfig), 
							addThisShare = {};

						var isObjectReady = function(object){

							for(var key in object){
								if(object[key] === ''){
									return false;
								}
							}
							return true;

						};

						scope.$watch(function(){

							addThisShare.url = scope.addThisUrl;
							addThisShare.title = scope.addThisTitle;
							addThisShare.description = scope.addThisDescription;
							
							return addThisShare;

						}, function(addThisShare){

							if(isObjectReady(addThisShare)){

								addthis.init();
								addthis.button(element[0], addThisConfig, addThisShare);
							
							}
						
						}, true);

					}
				};
			}
		]);

});