define(['angular'], function(angular){

	'use strict';

	angular.module('Directives')
		.service('DisqusServ', [
			'$window',
			function($window){

				var disqusLoaded = false;

				/**
				 * Setup the global configuration for Disqus.
				 * Use this before loading the Disqus script.
				 * This should only run once at the startup of the first Disqus module.
				 * Everything is optional except disqusShortname.
				 * Note that if you set these at the start, they will be replicated
				 * across every disqus modules whether they are on the same page or elsewhere.
				 * @param  {String}  disqusShortname   Forum name
				 * @param  {String}  disqusIdentifier  Thread id
				 * @param  {String}  disqusTitle       Title of the thread
				 * @param  {String}  disqusUrl         Absolute URL of the thread
				 * @param  {Integer} disqusCategoryId  Optional category ID.
				 * @param  {String}  disqusContainerId Optional container CSS id, defaults to disqus_thread. Not documented.
				 * @param  {Boolean} disqusDeveloper   Optional boolean to allow the usage of disqus when working on localhost
				 * @return {Void}
				 */
				this.setupInitialConfig = function(disqusShortname, disqusIdentifier, disqusTitle, disqusUrl, disqusCategoryId, disqusContainerId, disqusDeveloper){

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

				};

				/**
				 * Loads the Disqus script. Embeds it into the head or body.
				 * This has to be loaded after Disqus id and url are setup.
				 * Will only be loaded once.
				 * @param  {String} disqusShortname
				 * @return {Void}
				 */
				this.loadDisqusScript = function(disqusShortname){

					var disqus = document.createElement('script');
					disqus.type = 'text/javascript';
					disqus.async = true;
					disqus.src = '//' + disqusShortname + '.disqus.com/embed.js';
					(document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(disqus);
					disqusLoaded = true;

				};

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
				this.resetDisqus = function(disqusIdentifier, disqusTitle, disqusUrl){

					$window.DISQUS.reset({
						reload: true,
						config: function(){
							this.page.identifier = disqusIdentifier;
							this.page.title = disqusTitle;
							this.page.url = disqusUrl;
						}
					});

				};

				/**
				 * Implements the disqus thread. Recall this whenever you need to change to a different disqus thread.
				 * @param  {String}  disqusShortname   Forum name
				 * @param  {String}  disqusIdentifier  Thread id
				 * @param  {String}  disqusTitle       Title of the thread
				 * @param  {String}  disqusUrl         Absolute URL of the thread
				 * @param  {Integer} disqusCategoryId  Optional category ID.
				 * @param  {String}  disqusContainerId Optional container CSS id, defaults to disqus_thread. Not documented.
				 * @param  {Boolean} disqusDeveloper   Optional boolean to allow the usage of disqus when working on localhost
				 * @return {Void}
				 */
				this.implementDisqus = function(disqusShortname, disqusIdentifier, disqusTitle, disqusUrl, disqusCategoryId, disqusContainerId, disqusDeveloper){

					if(!disqusLoaded){
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
					}else{
						this.resetDisqus(
							disqusIdentifier,
							disqusTitle,
							disqusUrl
						);
					}

				};

			}
		])
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

						//this will check if any of the config object's properties are empty strings
						//if any of them are, the config object is therefore not ready
						//this is to allow for asynchronous configuration from AJAX loaded data or deferred data
						//of course you have to make sure all your directive properties are loaded with some value
						//or else disqus will never be implemented
						var isConfigObjectReady = function(object){

							for(var key in object){
								if(object[key] === ''){
									return false;
								}
							}
							return true;

						};

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
								if(isConfigObjectReady(disqusConfig)){

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
					link: function(scope, element, attributes){
					
						//either this uses the API
						//we won't be using the comment count scrip
						//have to use the API
						//this can also be done on the server side (perhaps that is a better place to provide it?)
					
					}
				};
			}
		]);

});