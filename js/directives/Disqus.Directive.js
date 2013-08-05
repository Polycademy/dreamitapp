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
			'$location',
			'$window',
			function($location, $window){

				var disqusLoaded = false,
					disqusCountLoaded = false;

				/**
				 * Setup the global configuration for Disqus.
				 * Use this before loading the Disqus script.
				 * This should only run once at the startup of the first Disqus module.
				 * Everything is optional except disqusShortname.
				 * Note that if you set these at the start, they will be replicated
				 * across every disqus modules whether they are on the same page or elsewhere.
				 * @param  {String}  disqusShortname   Forum name
				 * @param  {String}  disqusIdentifier  Thread id, this is not optional if you want comment counts using data-disqus-identifier
				 * @param  {String}  disqusTitle       Title of the thread
				 * @param  {String}  disqusUrl         Absolute URL of the thread
				 * @param  {Integer} disqusCategoryId  Optional category ID.
				 * @param  {String}  disqusContainerId Optional container CSS id, defaults to disqus_thread. Not documented.
				 * @return {Void}
				 */
				this.setupInitialConfig = function(disqusShortname, disqusIdentifier, disqusTitle, disqusUrl, disqusCategoryId, disqusContainerId){

					disqusContainerId = (typeof disqusContainerId === "undefined") ? 'disqus_thread' : disqusContainerId;

					$window.disqus_shortname = disqusShortname;

					if(disqusIdentifier){
						$window.disqus_identifier = disqusIdentifier;
					}

					if(disqusTitle){
						$window.disqus_title = disqusIdentifier;
					}

					if(disqusUrl){
						$window.disqus_url = disqusUrl;
					}

					if(disqusCategoryId){
						$window.disqus_category_id = disqusCategoryId;
					}

					$window.disqus_container_id = disqusContainerId;

				};

				/**
				 * Loads the Disqus script. Embeds it into the head or body.
				 * This has to be loaded after Disqus id and url are setup.
				 * Will only be loaded once.
				 * @param  {String} disqusShortname
				 * @return {Void}
				 */
				this.loadDisqusScript = function(disqusShortname){

					if(!disqusLoaded){
						var disqus = document.createElement('script');
						disqus.type = 'text/javascript';
						disqus.async = true;
						disqus.src = '//' + disqusShortname + '.disqus.com/embed.js';
						(document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(disqus);
						disqusLoaded = true;
					}

				};

				/**
				 * Loads the Disqus Count script. Embeds it into the head or body.
				 * This should only be loaded once for a particular page.
				 * @param  {String} disqusShortname
				 * @return {Void}
				 */
				this.loadDisqusCountScript = function(disqusShortname){

					if(!disqusCountLoaded){
						var disqus = document.createElement('script');
						disqus.type = 'text/javascript';
						disqus.async = true;
						disqus.src = '//' + disqusShortname + '.disqus.com/count.js';
						(document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(disqus);
						disqusCountLoaded = true;
					}

				};

				this.resetDisqus





			}
		])
		.directive('disqusThread', [
			'DisqusServ',
			function(DisqusServ){
				return {
					scope: true,
					link: function(scope, element, attributes){
					
						//show the disqus thread, and reshow it everytime it is called
						//that is to reset it!
					
					}
				};
			}
		])
		.directive('disqusCommentsCount', [
			'DisqusServ',
			function(DisqusServ){
				return {
					scope: true,
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