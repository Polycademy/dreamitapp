define(['angular'], function(angular){

	'use strict';

	angular.module('Filters')
		.filter('BooleanFilter', [
			function(){
				return function(value){

					//string false would be false, but other strings would be true!
					//except for empty strings!
					if(typeof value === 'string'){
						if(value === 'false'){
							return false;
						}
					}

					return !!value;

				};
			}
		]);

});