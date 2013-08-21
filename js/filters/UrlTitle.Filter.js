define(['angular'], function(angular){

	'use strict';

	angular.module('Filters')
		.filter('UrlTitle', [
			'$filter',
			function($filter){
				return function(text, separator, lowercase){

					var output,
						q_separator,
						translation = {},
						key,
						replacement,
						leadingTrailingSeparators;

					//default separator
					if(!separator){
						separator = '_';
					}

					//escape all possible regex characters in the separator to create a "searchable" separator
					//equivalent to preg_quote in php
					q_separator = (separator + '').replace(new RegExp('[.\\\\+*?\\[\\^\\]$(){}=!<>|:\\-]', 'g'), '\\$&');

					console.log(separator);
					console.log(lowercase);
					console.log(q_separator);

					//these keys are meant to be regexes
					translation['&.+?;'] = '';
					translation['[^a-z0-9 _-]'] = '';
					translation['\s+'] = separator;
					translation['(' + q_separator + ')+'] = separator;

					console.log(translation);

					//strip html tags from the title
					output = $filter('StripHtml')(text);

					for(key in translation){
						replacement = translation[key];
						output = output.replace(new RegExp(key, 'i'), replacement);
					}

					if(lowercase){
						output = output.toLowerCase();
					}

					//trim leading and trailing separators in case there was multiple spaces
					leadingTrailingSeparators = new RegExp('^' + q_separator + '+|' + q_separator + '+$');
					output = output.replace(leadingTrailingSeparators, '');

					//es5 trim out whitespace, make sure to polyfill this for older browsers
					output = output.trim();

					return output;

				};
			}
		]);

});