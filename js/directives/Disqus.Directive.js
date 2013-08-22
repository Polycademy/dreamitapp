define(['angular'], function(angular){

	'use strict';

	angular.module('Directives')
		.provider('DisqusServ', function(){

			var disqusGlobalConfig = {};

			/**
			 * Setup "backup" global configuration for Disqus from the run 
			 * portion of AngularJS. It means you don't have to define 
			 * common parameters everytime you declare a disqus directive. 
			 * This is the backup configuration object. If you miss any parameters 
			 * in the directive declaration, the directives/service will look into this 
			 * object to see if they exist. If you declare parameters, they will take 
			 * precedence over this object.
			 * @param  {object} params Object can only contain: 
			 *                         {shortname, apiKey, categoryId, containerId, developer, cache}
			 * @return {Void}
			 */
			this.setupGlobalConfiguration = function(params){
				disqusGlobalConfig = params;
			};

			this.$get = [
				'$window',
				'$document',
				'$resource',
				function($window, $document, $resource){

					var disqusService = {

						/**
						 * Boolean switch for whether Disqus config and script has been loaded
						 * @type {Boolean}
						 */
						disqusLoaded: false,

						/**
						 * Setup the global configuration for Disqus.
						 * Use this before loading the Disqus script.
						 * This should only run once at the startup of the first Disqus thread module.
						 * Everything is optional except disqusShortname.
						 * @param  {String}  disqusShortname   Forum name
						 * @param  {String}  disqusIdentifier  Thread id
						 * @param  {String}  disqusTitle       Title of the thread
						 * @param  {String}  disqusUrl         Absolute URL of the thread
						 * @param  {Integer} disqusCategoryId  Optional category ID.
						 * @param  {String}  disqusContainerId Optional container CSS id, defaults to disqus_thread. Not documented.
						 * @param  {Boolean} disqusDeveloper   Optional boolean to allow the usage of disqus when working on localhost
						 * @return {Void}
						 */
						setupInitialConfig: function(disqusShortname, disqusIdentifier, disqusTitle, disqusUrl, disqusCategoryId, disqusContainerId, disqusDeveloper){

							$window.disqus_shortname = disqusShortname;

							if(disqusIdentifier){
								$window.disqus_identifier = disqusIdentifier;
							}

							if(disqusTitle){
								$window.disqus_title = disqusTitle;
							}

							if(disqusUrl){
								$window.disqus_url = disqusUrl;
							}

							if(disqusCategoryId){
								$window.disqus_category_id = disqusCategoryId;
							}

							if(disqusContainerId){
								$window.disqus_container_id = disqusContainerId;
							}

							if(disqusDeveloper){
								$window.disqus_developer = 1;
							}

						},

						/**
						 * Loads the Disqus script. Embeds it into the head or body.
						 * This has to be loaded after Disqus id and url are setup.
						 * Will only be loaded once.
						 * @param  {String} disqusShortname
						 * @return {Void}
						 */
						loadDisqusScript: function(disqusShortname){

							var disqus = $document[0].createElement('script');
							disqus.type = 'text/javascript';
							disqus.async = true;
							disqus.src = '//' + disqusShortname + '.disqus.com/embed.js';
							($document[0].getElementsByTagName('head')[0] || $document[0].getElementsByTagName('body')[0]).appendChild(disqus);

						},

						/**
						 * Resets disqus upon each iteration of the disqus directive executing. Thus allowing dynamic disqus 
						 * changing in a single page application. Note that it is currently impossible to have more than
						 * one disqus comments thread run at the same page. Currently it seems only identifier, title and
						 * url can be refreshed. The other parameters will stay permanent across the application.
						 * @param  {String} disqusIdentifier Thread id
						 * @param  {String} disqusTitle      Thread title
						 * @param  {String} disqusUrl        Absolute url to the thread
						 * @return {Void}
						 */
						resetDisqus: function(disqusIdentifier, disqusTitle, disqusUrl){

							$window.DISQUS.reset({
								reload: true,
								config: function(){
									this.page.identifier = disqusIdentifier;
									this.page.title = disqusTitle;
									this.page.url = disqusUrl;
								}
							});

						},

						/**
						 * Implements the disqus thread. Recall this whenever you need to change to a different disqus thread.
						 * This will take backup parameters from the backup config.
						 * @param  {String}  disqusShortname   Forum name
						 * @param  {String}  disqusIdentifier  Thread id
						 * @param  {String}  disqusTitle       Title of the thread
						 * @param  {String}  disqusUrl         Absolute URL of the thread
						 * @param  {Integer} disqusCategoryId  Optional category ID.
						 * @param  {String}  disqusContainerId Optional container CSS id, defaults to disqus_thread. Not documented.
						 * @param  {Boolean} disqusDeveloper   Optional boolean to allow the usage of disqus when working on localhost
						 * @return {Void}
						 */
						implementDisqus: function(disqusShortname, disqusIdentifier, disqusTitle, disqusUrl, disqusCategoryId, disqusContainerId, disqusDeveloper){

							if(typeof disqusShortname === 'undefined') disqusShortname = disqusGlobalConfig.shortname;
							if(typeof disqusCategoryId === 'undefined') disqusCategoryId = disqusGlobalConfig.categoryId;
							if(typeof disqusContainerId === 'undefined') disqusContainerId = disqusGlobalConfig.containerId;
							if(typeof disqusDeveloper === 'undefined') disqusDeveloper = disqusGlobalConfig.developer;

							if(!this.disqusLoaded){
								this.setupInitialConfig(
									disqusShortname,
									disqusIdentifier,
									disqusTitle,
									disqusUrl,
									disqusCategoryId,
									disqusContainerId,
									disqusDeveloper
								);
								this.loadDisqusScript(disqusShortname);
								this.disqusLoaded = true;
							}else{
								this.resetDisqus(
									disqusIdentifier,
									disqusTitle,
									disqusUrl
								);
							}

						},

						/**
						 * Resource container for the Disqus API.
						 * @type {Object}
						 */
						disqusApi: null,

						/**
						 * Setup the disqus API resource.
						 * This will take parameters from the global config if none are passed in.
						 * @param  {String} disqusShortname
						 * @param  {String} disqusApiKey
						 * @return {Void}
						 */
						setupApi: function(disqusShortname, disqusApiKey){

							if(typeof disqusShortname === 'undefined') disqusShortname = disqusGlobalConfig.shortname;
							if(typeof disqusApiKey === 'undefined') disqusApiKey = disqusGlobalConfig.apiKey;

							if(!this.disqusApi){
								this.disqusApi = $resource('https://disqus.com/api/3.0/:resource/:action.json',
									{
										'api_key': disqusApiKey,
										'forum': disqusShortname
									}
								);
							}

						},

						/**
						 * Object container for the Disqus Cache. You can use any cache service 
						 * you want as long as the object contains 2 methods:
						 * 1. get(key)
						 * 2. put(key, value) - where value can be an object
						 * This directive does not set any expiry time on the cache, your cache
						 * service should either set a global expiry time for this particular
						 * cache section, or provide a wrapper/facade object that sets the expiry 
						 * time when put() is called.
						 * @type {Object}
						 */
						disqusCache: null,

						setupDisqusCache: function(cache){

							if(typeof cache === 'undefined') cache = disqusGlobalConfig.cache;
							if(!this.disqusCache){
								this.disqusCache = cache;
							}

						},

						/**
						 * This will check if any of the config object's properties are empty strings, 
						 * if any of them are, the config object is therefore not ready.
						 * This is to allow for asynchronous configuration from AJAX loaded data or deferred data.
						 * Of course you have to make sure all your directive properties are loaded with some value
						 * or else disqus will never be implemented.
						 * @param  {Object} object The combined config object
						 * @return {Boolean}
						 */
						isConfigObjectReady: function(object){

							for(var key in object){
								if(object[key] === ''){
									return false;
								}
							}
							return true;

						}

					};

					return disqusService;

				}
			];

		})
		.directive('disqusThreadDir', [
			'$location', 
			'$timeout', 
			'DisqusServ',
			function($location, $timeout, DisqusServ){
				return {
					replace: true,
					template: '<div id="{{disqusContainerId}}"></div>',
					scope:{
						disqusShortname: '@',
						disqusIdentifier: '@',
						disqusTitle: '@',
						disqusUrl: '@',
						disqusCategoryId: '@',
						disqusContainerId: '@',
						disqusDeveloper: '@'
					},
					link: function(scope, element, attributes){

						var disqusConfig = {};

						scope.$watch(
							function(){

								//default url
								if(!scope.disqusUrl){
									scope.disqusUrl = $location.absUrl();
								}

								//default container id
								if(!scope.disqusContainerId){
									scope.disqusContainerId = 'disqus_thread';
								}

								disqusConfig.shortname = scope.disqusShortname;
								disqusConfig.identifier = scope.disqusIdentifier;
								disqusConfig.title = scope.disqusTitle;
								disqusConfig.url = scope.disqusUrl;
								disqusConfig.categoryId = scope.disqusCategoryId;
								disqusConfig.containerId = scope.disqusContainerId;
								disqusConfig.developer = scope.disqusDeveloper;

								return disqusConfig;

							}, 
							function(disqusConfig){

								//make sure the config object is populated
								if(DisqusServ.isConfigObjectReady(disqusConfig)){

									//run disqus after the template has been replaced
									//or else the container id would not have been rendered
									//by the time disqus executes
									$timeout(function(){
										DisqusServ.implementDisqus(
											disqusConfig.shortname,
											disqusConfig.identifier,
											disqusConfig.title,
											disqusConfig.url,
											disqusConfig.categoryId,
											disqusConfig.containerId,
											disqusConfig.developer
										);
									}, 0, false);

								}

							},
							true
						);

					}
				};
			}
		])
		.directive('disqusCommentsCountDir', [
			'DisqusServ',
			function(DisqusServ){
				return {
					template: '{{commentCount}}',
					scope: {
						disqusShortname: '@',
						disqusApiKey: '@',
						disqusLink: '@',
						disqusIdent: '@',
						disqusCache: '&'
					},
					link: function(scope, element, attributes){

						var identifierConfig = {};

						scope.$watch(
							function(){

								identifierConfig.shortname = scope.disqusShortname;
								identifierConfig.apiKey = scope.disqusApiKey;
								identifierConfig.link = scope.disqusLink;
								identifierConfig.ident = scope.disqusIdent;
								identifierConfig.cache = scope.disqusCache;

								return identifierConfig;

							}, 
							function(identifierConfig){

								if(DisqusServ.isConfigObjectReady(identifierConfig)){

									DisqusServ.setupApi(identifierConfig.shortname, identifierConfig.apiKey);
									DisqusServ.setupDisqusCache(identifierConfig.cache());

									//if there was a cache!
									if(DisqusServ.disqusCache){

										console.log(DisqusServ.disqusCache);

									}

									//DISQUS cache needs to be an object with these properties:
									//get(key)
									//put(key, value)
									//the expiry time should be determined globally for this particular cache object...

									//get the cached comment count
									//if the comment count is invalidated (do not delete previous), proceed with the request
									//if request succeeds, cache the comment count
									//if the request fails, get the previous cached comment count


									var successResponse = function(response){
										scope.commentCount = response.response.posts;
										//cache the comment
									};

									var failResponse = function(response){

										console.log(response);
										if(response.data.code == 2){
											console.log('Disqus thread or forum has not yet been created. Therefore there are zero comments.');
											scope.commentCount = 0;
										}else if(response.data.code == 13 || response.data.code == 14){
											console.log('Exceeded Disqus rate limit for comments count. Retrieving from cache instead.');
											//retrieve cached comment count
										}else if(response.data.code == 5){
											console.log('Invalid Disqus API Key');
										}

									};

									if(identifierConfig.link){

										DisqusServ.disqusApi.get(
											{
												resource: 'threads',
												action: 'details',
												thread: 'link:' + identifierConfig.link
											},
											successResponse,
											failResponse
										);

									}else if(identifierConfig.ident){

										DisqusServ.disqusApi.get(
											{
												resource: 'threads',
												action: 'details',
												thread: 'ident:' + identifierConfig.ident
											},
											successResponse,
											failResponse
										);

									}

								}

							},
							true
						);

					}
				};
			}
		]);

});