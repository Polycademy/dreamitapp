define(['angular'], function(angular){

	'use strict';

	angular.module('Services')
		.service('LocationSearchServ', [
			'$location',
			function($location){

				/**
				 * Gets the value of query paramaters based on a variable number of keys.
				 * If passed nothing, it will return the total object of query parameters.
				 * If passed one or more keys, it will return an object relevant to the passed in keys.
				 * If the keys don't exist, they won't exist on the returned object.
				 * @param  {String} key... One or more query param keys
				 * @return {Object}        Query object containing keys to values
				 */
				this.getQuery = function(/* ... */){

					var queryObject = {};

					if(arguments.length === 0){

						return $location.search();

					}else{

						for(var i = 0; i < arguments.length; i++){
							if($location.search[arguments[i]]){
								queryObject[arguments[i]] = $location.search[arguments[i]];
							}
						}
						return queryObject;

					}

				};

				/**
				 * Deletes the key and value from the query parameters based on a variable number of keys.
				 * If passed nothing, it will delete all the keys and values on the query parameters.
				 * If passed one or more keys, it will delete them.
				 * @return {Void}
				 */
				this.deleteQuery = function(/* ... */){

					if(arguments.length === 0){

						$location.search({});

					}else{

						var current = $location.search();
						for(var i = 0; i < arguments.length; i++){
							delete current[arguments[i]];
						}
						$location.search(current);

					}

				};

				/**
				 * Sets or appends a query object with keys and values.
				 * Unlike replaceQuery or the native query parameter setting, will append the query parameters
				 * if other query parameters already exist. And of course replace it, if the key already exists.
				 * @param  {Object} queryObject Key to value query object
				 * @return {Void}
				 */
				this.setQuery = function(queryObject){

					//get the current parameters
					var current = $location.search();

					//set/replace the relevant parameters
					for(var key in queryObject){
						current[key] = queryObject[key];
					}

					//inject new query parameters object
					$location.search(current);

				};

				/**
				 * This is the same as the native query parameter setting.
				 * Equivalent to just $location.search(queryObject).
				 * It's only here for consistency.
				 * It will replace the entire query string with whatever you pass in.
				 * @param  {Object} queryObject Key to value query object
				 * @return {Void}
				 */
				this.replaceQuery = function(queryObject){

					$location.search(queryObject);

				};

			}
		]);

});