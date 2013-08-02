define(['angular', 'lodash'], function(angular, _){

	'use strict';

	angular.module('Services')
		.service('UtilitiesServ', [
			function(){

				/**
				 * Finds out what the true type is, giving back capitalised "Array" or "Object" or "Function"... etc
				 * see http://juhukinners.wordpress.com/2009/01/11/typeof-considered-useless-or-how-to-write-robust-type-checks/
				 */
				this.type = function(value){
					return Object.prototype.toString.call(value).slice(8, -1);
				};

				this.isInteger = function(mixedVar){
					return (typeof(mixedVar) === 'number' || typeof(mixedVar) === 'string') && mixedVar !== '' && !isNaN(mixedVar);
				};

				/**
				 * Determines whether a variable is empty. Works just like PHP's empty!
				 * @param  {mixed}   mixedVar
				 * @param  {boolean} ownProperty Boolean for whether you want to check for own properties in objects
				 * @return {boolean}
				 */
				this.empty = function(mixedVar, ownProperty){

					ownProperty = (typeof ownProperty === 'undefined') ? false : ownProperty;

					var undef, key, i, len;
					var emptyValues = [undef, null, false, 0, "", "0"];
					for(i = 0, len = emptyValues.length; i < len; i++){
						if(mixedVar === emptyValues[i]){
							return true;
						}
					}

					if(typeof mixedVar === "object"){
						for (key in mixedVar) {
							if(ownProperty){
								if(mixedVar.hasOwnProperty(key)){
									return false;
								}
							}else{
								return false;
							}
						}
						return true;
					}

					return false;

				};

				/**
				 * Compares and returns the difference between arrays based on their values.
				 * It will subtract the duplicate values from subsequent arrays from the first array.
				 * It operates similarly to array_diff in PHP, but works for arrays of objects.
				 * An optional compare function callback is allowed, make sure to prebind a context if required.
				 * This only works on the first dimension, not multidimensional arrays.
				 * @param  function compare Optional compare callback called with func(a, b), where "a" 
				 *                          is a value from the first array, and "b" is a value from
				 *                          subsequent arrays
				 * @return array            Array of values that were unique in the first array
				 */
				this.arrayDifference = function(compare){

					var arrays = Array.prototype.slice.call(arguments, 0);

					//if compare is a function, we'll use it as the callback
					//and also remove it from the arrays list to compare
					if(this.type(compare) === 'Function'){
						compare = arrays.shift();
					}else{
						compare = false;
					}

					//we're subtracting the other values off the first array, this array will therefore be modified
					//also we're cloning it to prevent affecting a potential pass by reference
					var firstArray = _.cloneDeep(arrays.shift());

					//i is the iteration of arrays
					//j is the iteration of the firstArray
					//k is the iteration of subsequent arrays values
					for(var i = 0; i < arrays.length; i++){

						//reverse iteration to prevent splicing from affecting the iterative index
						var j = firstArray.length;
						while(j--){

							var primaryValue = firstArray[j];

							for(var k = 0; k < arrays[i].length; k++){

								var secondaryValue = arrays[i][k];

								//if it is a match, we remove it from the firstArray
								if(_.isEqual(primaryValue, secondaryValue, compare)){
									firstArray.splice(j, 1);
									break;
								}

							}

						}

					}

					return firstArray;

				};

			}
		]);

});