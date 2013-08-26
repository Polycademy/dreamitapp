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
								this.disqusApi = $resource('http://disqus.com/api/3.0/:resource/:action.json',
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
						 * 1. get(key, callback(key, value)) - where callback should be passed in with the (key, value) 
						 * of whatever that is being extracted from the cache, this is optional but recommended
						 * 2. put(key, value) - where value can be an object
						 * This directive does not set any expiry time on the cache, your cache
						 * service should either set a global expiry time for this particular
						 * cache section, or provide a wrapper/facade object that sets the expiry 
						 * time when put() is called.
						 * @type {Object}
						 */
						disqusCache: null,

						/**
						 * Sets up the cache object. Only one cache object will be used.
						 * So the cached object can be shared across all directive instances.
						 * @param  {Object} cache Cache object
						 * @return {Void}
						 */
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
		/**
		 * Disqus Thread Directive
		 * Just declare this directive whenever you want a disqus thread.
		 * Only one is allowed to exist at any point in the page.
		 * Intelligently resets this for single page applications.
		 * @attribute {Void}   disqus-thread-dir   Initialise Directive
		 * @attribute {String} disqus-shortname    Forum name
		 * @attribute {String} disqus-identifier   Thread identifier
		 * @attribute {String} disqus-title        Thread title
		 * @attribute {String} disqus-url          Thread url
		 * @attribute {String} disqus-category-id  Thread category - not changeable across disqus instances
		 * @attribute {String} disqus-container-id CSS container id - not changeable across disqus instances
		 * @attribute {String} disqus-developer    For localhost development - not changeable across disqus instances
		 */
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
		/**
		 * Disqus Comment Count Directive.
		 * You can use either link or ident, don't use both.
		 * This makes use of caching since Disqus limits their rate use to 1000 requests/hour.
		 * I recommend using angular-cache (http://jmdobry.github.io/angular-cache/)
		 * However it is up to you to pass in a cache object that fulfills the API requirements
		 * of: get(key, callback(key, value)) AND put(key, value)
		 * The callback function should be called with the key and value of whatever object is currently
		 * being requested. The cache is of course optional.
		 * Also make sure to write {{commentCount}} inside the template for the directive so you'll get
		 * an actual number.
		 * @attribute {Void}              disqus-comment-count-dir Initialise Directive
		 * @attribute {String}            disqus-shortname         Forum name
		 * @attribute {String}            disqus-api-key           Public API Disqus Key
		 * @attribute {String}            disqus-link              Link to be used as the thread identifier
		 * @attribute {String}            disqus-ident             ID to be used as the thread identifier
		 * @attribute {Object Expression} disqus-cache             Expression bound cache object
		 * @attribute {String}            disqus-log               Determine whether directive should log status messages (string true or false)
		 */
		.directive('disqusCommentCountDir', [
			'$log',
			'DisqusServ',
			function($log, DisqusServ){
				return {
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
								identifierConfig.logging = attributes.disqusLog;

								return identifierConfig;

							}, 
							function(identifierConfig){

								var cacheKey,
									previousCachedCommentCount;

								if(DisqusServ.isConfigObjectReady(identifierConfig)){

									//cancel logging if log was not passed as 'true'
									if(!identifierConfig.logging || identifierConfig.logging === 'false'){
										$log = {
											info: angular.noop,
											error: angular.noop
										};
									}

									DisqusServ.setupApi(identifierConfig.shortname, identifierConfig.apiKey);
									DisqusServ.setupDisqusCache(identifierConfig.cache());

									//if the cache exists, we're going to try to get the comment count from cache first
									if(DisqusServ.disqusCache){
										cacheKey = (identifierConfig.link || identifierConfig.ident);
										//CALLBACK HAS NOT YET BEEN IMPLEMENTED
										//assign the comment count and provide a callback that can be optionally 
										//called in order to allow the previously cached item
										//to be remembered in case we need it even though it expired
										scope.commentCount = DisqusServ.disqusCache.get(cacheKey, function(oldKey, oldValue){
											previousCachedCommentCount = oldValue;
										});

									}

									//if comment count was not extracted from the cache, we're going to call Disqus
									//commentCount may be 0 falsy value, so we're checking for undefined instead
									if(typeof scope.commentCount === 'undefined'){

										var successResponse = function(response){
											scope.commentCount = response.response.posts;
											//cache the comment
											if(DisqusServ.disqusCache){
												DisqusServ.disqusCache.put(cacheKey, response.response.posts);
											}
										};

										var failResponse = function(response){

											if(response.data.code == 2){
												$log.info('Disqus thread or forum has not yet been created. Therefore there are zero comment.');
												scope.commentCount = 0;
											}else if(response.data.code == 13 || response.data.code == 14){
												$log.info('Exceeded Disqus rate limit for comment count. Showing zero instead.');
												if(previousCachedCommentCount){
													scope.commentCount = previousCachedCommentCount;
												}else{
													scope.commentCount = 0;
												}
											}else if(response.data.code == 5){
												$log.error('Invalid Disqus API Key');
											}

										};

										//it is possible to use the link or ident, but don't use both
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

								}

							},
							true
						);

					}
				};
			}
		]);

});