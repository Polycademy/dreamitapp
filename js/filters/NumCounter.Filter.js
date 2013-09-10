define(['angular'], function(angular){

	'use strict';

	/**
	 * NumCounter filters out integers so integers greater than a certain number of characters will be
	 * limited with a '+' sign.
	 */
	angular.module('Filters')
		.filter('NumCounter', [
			function(){
				return function(integer, cutoff){

					var output = '',
						length = (integer + '').length;

					//if length is greater than the cutoff
					//then we need to find the maximum number that is below the cutoff
					//and add an '+' sign to the right of it
					if(integer && length > cutoff){

						for(var i = 0; i < cutoff; i++){
							output += '9';
						}

						output += '+';

						return output;

					//if the integer was undefined or null, then it's going to be zero
					}else if(typeof integer === 'undefined' || integer === null){

						return 0;

					}else{

						return integer;

					}

				};
			}
		]);

});