//this directive needs to be able to maintain multiple disqus elements here!
//also requires support of comments
//http://help.disqus.com/customer/portal/articles/565624
//http://dreamitapp.disqus.com/admin/universalcode/
//http://help.disqus.com/customer/portal/articles/472098#disqus_shortname
//http://stackoverflow.com/questions/4963505/several-disqus-threads-on-one-page
//https://github.com/kirstein/angular-disqus/blob/master/angular-disqus.js
//https://github.com/kirstein/angular-disqus
//http://stackoverflow.com/questions/15823047/what-is-the-best-approach-to-use-disqus-in-a-single-page-application

define(['angular'], function(angular){

	'use strict';

	angular.module('Directives')
		.service('DisqusServ', [
			'$window',
			'$location',
			function($window, $location){

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
					}else if(disqusLoaded){
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
			'DisqusServ',
			function($location, DisqusServ){
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
						diqusDeveloper: '@'
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
								if(disqusConfig){

									console.log(disqusConfig);

									//link is incorrect (it should come from a permalink!)
									//we need a link creator (hostname/state/substate/id/url_friendly_title)
									//the server needs to generate a perma link
									//also add in the option for disqus_developer
									
									//run disqus!
									// DisqusServ.implementDisqus(
									// 	disqusConfig.shortname,
									// 	disqusConfig.identifier,
									// 	disqusConfig.title,
									// 	disqusConfig.url,
									// 	disqusConfig.categoryId,
									// 	disqusConfig.containerId,
									// 	disqusConfig.developer
									// );

								}
							}
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
					
						//show comment count
						//this might be a problem if the count.js is loaded and ran, and then these #disqus_thread and data-disqus-identifier is loaded afterwards through client side templating and AJAX.
						//in that case, either count.js works (which i dont think it will)
						//or you will need reload the count.js script (by adding in the script to the head, and removing it)
						//use this: http://stackoverflow.com/questions/9642205/how-to-force-a-script-reload-and-re-execute
						//or jQuery.getScript
						//inserting than removing the script may be more useful than using Eval because Eval is sandboxed in chrome
						//Also this may result in some burden, due to the fact that this is being removed and added constantly on each load
						//Oh well.
						//Also I think caching can be used.
						//Also make sure to add in data-disqus-identifier and #disqus_thread to the end of the URL
						//Well actually, perhaps these both can be passed in as parameters to the directive.
						//Like
						//disqus-comments-count: "url" data-disqus-identifier: "blahblah"
						//or just a ng-href="{url}" disqus-comments-count: "thread id" (this would allow the url to be anything)
						//If the url already has #disqus_thread, then we're using something else
						//Also perhaps the container will require different id
						//http://stackoverflow.com/questions/15823047/what-is-the-best-approach-to-use-disqus-in-a-single-page-application
						//#disqus_thread OR #{disqus_container_id}
					
					}
				};
			}
		]);

});