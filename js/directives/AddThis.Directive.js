define(['angular', 'addthis'], function(angular, addthis){

	'use strict';

	/**
	 * Implements an addthis button on the element. Works with dynamically produced elements.
	 * You can provide addThisConfig and addThisShare as JSON or evaluated objects to configure the buttons
	 */
	angular.module('Directives')
		.directive('addThisDir', [
			'$filter',
			function($filter){
				return {
					scope: true,
					link: function(scope, element, attributes){

						var addThisConfig = scope.$eval(attributes.addThisConfig),
							addThisShare = scope.$eval(attributes.addThisShare);

						if(addThisShare.description){
							//filter out description's html tags
							addThisShare.description = $filter('StripHtml')(addThisShare.description);
						}

						addthis.init();

						addthis.button(element[0], addThisConfig, addThisShare);

					}
				};
			}
		]);

});