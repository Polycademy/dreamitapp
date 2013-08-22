define(['angular'], function(angular){

	'use strict';

	angular.module('Services')
		.service('CachServ', [
			'$angularCacheFactory',
			function($angularCacheFactory){

				//this needs to be singleton, only declare a cache once!
				this.commentCache = $angularCacheFactory('commentCache', {
					capacity: 500,
					maxAge: 21600000, //cache comments for 6 hours
					cacheFlushInterval: 43200000, //flush all of the cache every 12 hours
					storageMode: 'localStorage', //will probably need a localStorage polyfill passed into this eventually
					onExpire: function(key, value, callback){
						callback(value);
					}
				});

			}
		]);

});