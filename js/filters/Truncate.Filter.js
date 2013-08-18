define(['angular'], function(angular){

	'use strict';

	/**
	 * Truncates characters or words. Truncate characters by default does not truncates on a word.
	 */
	angular.module('Filters')
		.filter('TruncateCharacters', [
			function(){
				return function(input, chars, breakOnWord){

					if (isNaN(chars)) return input;
					if (chars <= 0) return '';
					if (input && input.length >= chars) {
						input = input.substring(0, chars);
						if (!breakOnWord) {
							var lastspace = input.lastIndexOf(' ');
							//get last space
							if (lastspace !== -1) {
								input = input.substr(0, lastspace);
							}
						}else{
							while(input.charAt(input.length-1) == ' '){
								input = input.substr(0, input.length -1);
							}
						}
						return input + '...';
					}
					return input;

				};
			}
		])
		.filter('TruncateWords', [
			function(){
				return function(input, words){

					if (isNaN(words)) return input;
					if (words <= 0) return '';
					if (input) {
						var inputWords = input.split(/\s+/);
						if (inputWords.length > words) {
							input = inputWords.slice(0, words).join(' ') + '...';
						}
					}
					return input;

				};
			}
		]);

});