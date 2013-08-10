/**
 * NumCounter filters out integers so integers greater than a certain number of characters will be
 * limited with a '+' sign.
 */
define(['angular'], function(angular){

	'use strict';

	angular.module('Filters')
		.filter('NumCounter', [
			function(){
				return function(integer, cutoff){

					var output = '',
						length = (integer + '').length;

					//if length is greater than the cutoff
					//then we need to find the maximum number that is below the cutoff
					//and add an '+' sign to the right of it
					if(typeof integer !== 'undefined' && length > cutoff){

						for(var i = 0; i < cutoff; i++){
							output += '9';
						}

						output += '+';

						return output;

					}else{

						return integer;

					}

				};
			}
		]);

});