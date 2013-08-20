define(['angular', 'jquery'], function(angular){

	'use strict';

	/**
	 * Anchor Scroll directive that works for HTML5 mode urls and normal hash bang urls.
	 * This only works on a single page. There is no routing allowed here. It cannot navigate 
	 * to another page and scroll there. To do so, use a routing method like: 
	 * http://plnkr.co/edit/De6bBrkHpojgAbEvHszu or href="page#hash" (not hash mode compatible)
	 * or just use a custom function to open up the page, then scroll to the hash.
	 * 
	 */
	angular.module('Directives')
		.directive('anchorScrollDir', [
			'$location',
			'$anchorScroll',
			function($location, $anchorScroll){
				return {
					link: function(scope, element, attributes){

						var id = scope.$eval(attributes.anchorScrollDir);

						element.bind('click', function(){
							$location.hash(id);
							$anchorScroll();
						});

					}
				};
			}
		]);

});