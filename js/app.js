/* ==========================================================================
   ANGULAR BOOTSTRAPPER
   ========================================================================== */

define([
	'require',
	'angular',
	'domReady', 
	//shims!
	'es5-shim', 
	'es6-shim', 
	'json3'
	], function(require, angular, domReady){

		'use strict';

		/* ==========================================================================
		   MODULES
		   ========================================================================== */

		var app;

		require([
			'angular-resource',
			'angular-cookies',
			'angular-sanitize',
			'angular-ui',
			'angular-bootstrap',
			'angular-ui-router',
			'angular-cache'
		], function(){

			//app is an module that is dependent on several top level modules
			app = angular.module('App', [
				'Controllers',
				'Filters',
				'Services',
				'Directives',
				'ngResource',
				'ngCookies',
				'ngSanitize',
				'ui',
				'ui.bootstrap',
				'ui.state',
				'angular-cache'
			]);

			//parent core modules for the registry, they have the [] allowing functions to be appended to them
			angular.module('Controllers', []);
			angular.module('Filters', []);
			angular.module('Services', []);
			angular.module('Directives', []);

			/* ==========================================================================
			   REGISTRY
			   ========================================================================== */

			require([
				//CONTROLLERS
				'controllers/Header.Controllers',
				'controllers/Home.Controllers',
				'controllers/ControlPanel.Controllers',
				'controllers/Users.Controllers',
				'controllers/About.Controllers',
				'controllers/Blog.Controllers',
				'controllers/Idea.Controllers',
				//DIRECTIVES
				'directives/EqualiseHeights.Directive',
				'directives/EqualiseHeightTo.Directive',
				'directives/MasonryWall.Directive',
				'directives/InfiniteScroll.Directive',
				'directives/Affix.Directive',
				'directives/PullDownToWindow.Directive',
				'directives/ShareButton.Directive',
				'directives/Overlay.Directive',
				'directives/AnchorScroll.Directive',
				'directives/Disqus.Directive',
				'directives/ImageCentering.Directive',
				'directives/ShareThis.Directive',
				'directives/LikeToggle.Directive',
				//FILTERS
				'filters/StripHtml.Filter',
				'filters/UrlFriendly.Filter',
				'filters/NumCounter.Filter',
				'filters/Truncate.Filter',
				//SERVICES
				'services/Utilities.Service',
				'services/Users.Service',
				'services/Search.Service',
				'services/Cache.Service',
				'services/LocationSearch.Service',
				'services/AppIdeas.Service',
				//RESOURCES
				'resources/Accounts.Service',
				'resources/Sessions.Service',
				'resources/Ideas.Service',
				'resources/Tags.Service',
				'resources/Like.Service'
			], function(){

				/* ==========================================================================
				   ROUTER
				   ========================================================================== */

				//Define all routes here and which page level controller should handle them
				app.config(
					[
						'$stateProvider',
						'$urlRouterProvider',
						'$locationProvider',
						'UsersServProvider',
						function($stateProvider, $urlRouterProvider, $locationProvider, UsersServProvider) {
							
							//setting up the authentication/register page (before any instantiation)
							UsersServProvider.setLoginPage = '/auth';
							
							//HTML5 Mode URLs
							$locationProvider.html5Mode(true).hashPrefix('!');
							
							//when we are using ui-router, we have to understand our user interface as a hierarchical state machine
							//each state can have multiple view components, these components are always present in that particular state
							//each state can have sub states which represent a whole new state, which would bring in new view components and transitions
							
							$stateProvider
								.state(
									'home',
									{
										url: '/', //not implementing the query parameters, as this makes ui-router refresh the entire view, and clearing any form inputs! This means we need to implement our own watch!
										templateUrl: 'home.html',
										controller: 'HomeCtrl'
									}
								)
								.state(
									'ideas',
									{
										url: '/ideas/{ideaId:[0-9]+}/{ideaUrl:.+}',
										templateUrl: 'idea.html',
										controller: 'IdeaCtrl',
										reloadOnSearch: false
									}
								)
								.state(
									'users',
									{
										url: '/users',
										templateUrl: 'users.html',
										controller: 'UsersCtrl'
									}
								)
								.state(
									'user',
									{
										url: '/users/{userId:[0-9]+}/{userUrl:.+}',
										templateUrl: 'user.html',
										controller: 'UserCtrl'
									}
								)
								.state(
									'about',
									{
										url: '/about',
										templateUrl: 'about.html',
										controller: 'AboutCtrl'
									}
								)
								.state(
									'blog',
									{
										url: '/blog',
										templateUrl: 'blog.html',
										controller: 'BlogCtrl'
									}
								)
								.state(
									'post',
									{
										url: '/blog/{blogId:[0-9]+}/{blogUrl:.+}',
										templateUrl: 'post.html',
										controller: 'PostCtrl'
									}
								);
							
							//redirect anything else to home page
							$urlRouterProvider.otherwise('/');
							
						}
					]
				);

				/* ==========================================================================
				   INITIALISATION
				   ========================================================================== */

				app.run([
					'$rootScope',
					'$cookies',
					'$http',
					'$state',
					'$stateParams',
					function($rootScope, $cookies, $http, $state, $stateParams){
					
						//XSRF INTEGRATION
						$rootScope.$watch(
							function(){
								return $cookies[serverVars.csrfCookieName];
							},
							function(){
								$http.defaults.headers.common['X-XSRF-TOKEN'] = $cookies[serverVars.csrfCookieName];
							}
						);
						
						//PROVIDING STATE ON ROOTSCOPE
						$rootScope.$state = $state;
						$rootScope.$stateParams = $stateParams;

						//ADDING DREAM IT APP CONFIG TO ROOTSCOPE
						$rootScope.dreamItAppConfig = dreamItAppConfig;

						//PROVIDING BASE URL IN CASE IT ISN'T AUTOMATIC (such as addthis)
						$rootScope.baseUrl = serverVars.baseUrl;
						
					}
				]);

				/* ==========================================================================
				   DOM READY
				   ========================================================================== */

				domReady(function(){
					angular.bootstrap(document, ['App']);
				});

			});

		});

		return app;

});