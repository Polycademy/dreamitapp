/*
	Filters out HTML, based off php.js. Can be used like StripHtml:'<p><b>'
 */
define(['angular'], function(angular){

	'use strict';

	angular.module('Filters')
		.filter('StripHtml', [
			function(){
				return function(text, allowed){

					// making sure the allowed arg is a string containing only tags in lowercase (<a><b><c>)
					allowed = (((allowed || "") + "").toLowerCase().match(/<[a-z][a-z0-9]*>/g) || []).join('');
					
					var tags = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi;
					var commentsAndPhpTags = /<!--[\s\S]*?-->|<\?(?:php)?[\s\S]*?\?>/gi;

					return text.replace(commentsAndPhpTags, '').replace(tags, function ($0, $1) {
						return allowed.indexOf('<' + $1.toLowerCase() + '>') > -1 ? $0 : '';
					});

				};
			}
		]);

});