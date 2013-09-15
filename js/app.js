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
			'angular-ui-select2',
			'angular-cache',
			'angulartics',
			'angulartics-google-analytics'
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
				'ui.select2',
				'angular-cache',
				'angulartics',
				'angulartics.google.analytics'
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
				'controllers/AddEditIdea.Controllers',
				'controllers/AddEditBlog.Controllers',
				'controllers/EditUser.Controllers',
				//DIRECTIVES
				'directives/EqualiseHeights.Directive',
				'directives/EqualiseHeightTo.Directive',
				'directives/MasonryWall.Directive',
				'directives/InfiniteScroll.Directive',
				'directives/Affix.Directive',
				'directives/PullDownToWindow.Directive',
				'directives/ShareButton.Directive',
				'directives/OverlayClose.Directive',
				'directives/AnchorScroll.Directive',
				'directives/Disqus.Directive',
				'directives/ImageCentering.Directive',
				'directives/ShareThis.Directive',
				'directives/LikeToggle.Directive',
				'directives/FilePicker.Directive',
				'directives/InputFocus.Directive',
				'directives/WhenScrolled.Directive',
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
				'services/BlogData.Service',
				//RESOURCES
				'resources/Accounts.Service',
				'resources/Sessions.Service',
				'resources/Ideas.Service',
				'resources/Tags.Service',
				'resources/Like.Service',
				'resources/Email.Service',
				'resources/Blog.Service',
				'resources/Comments.Service'
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
									'idea',
									{
										url: '/ideas/{ideaId:[0-9]+}/{ideaUrl:.*}',
										templateUrl: 'idea.html',
										controller: 'IdeaCtrl',
										resolve: {
											dialog: angular.noop
										}
									}
								)
								.state(
									'addIdea',
									{
										url: '/ideas/create',
										templateUrl: 'add_edit_idea.html',
										controller: 'AddEditIdeaCtrl',
										data: {
											action: 'add'
										},
										resolve: {
											dialog: angular.noop
										}
									}
								)
								.state(
									'editIdea',
									{
										url: '/ideas/edit/{ideaId:[0-9]+}/{ideaUrl:.*}',
										templateUrl: 'add_edit_idea.html',
										controller: 'AddEditIdeaCtrl',
										data: {
											action: 'edit'
										},
										resolve: {
											dialog: angular.noop
										}
									}
								)
								.state(
									'user',
									{
										url: '/users/{userId:[0-9]+}/{userUrl:.*}',
										templateUrl: 'user.html',
										controller: 'UserCtrl'
									}
								)
								.state(
									'editUser',
									{
										url: '/users/edit/{userId:[0-9]+}/{userUrl:.*}',
										templateUrl: 'edit_user.html',
										controller: 'EditUserCtrl',
										resolve: {
											dialog: angular.noop
										}
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
										url: '/blog/{blogId:[0-9]+}/{blogUrl:.*}',
										templateUrl: 'post.html',
										controller: 'PostCtrl'
									}
								)
								.state(
									'addBlog',
									{
										url: '/blog/create',
										templateUrl: 'add_edit_blog.html',
										controller: 'AddEditBlogCtrl',
										data: {
											action: 'add'
										},
										resolve: {
											dialog: angular.noop
										}
									}
								)
								.state(
									'editBlog',
									{
										url: '/blog/edit/{blogId:[0-9]+}/{blogUrl:.*}',
										templateUrl: 'add_edit_blog.html',
										controller: 'AddEditBlogCtrl',
										data: {
											action: 'edit'
										},
										resolve: {
											dialog: angular.noop
										}
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
					'UsersServ',
					function($rootScope, $cookies, $http, $state, $stateParams, UsersServ){
					
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

						$rootScope.loggedIn = false;
						$rootScope.loggedInAdmin = false;
						$rootScope.loggedInDeveloper = false;
						$rootScope.user = {};

						$rootScope.$on('authenticationProvided', function(event, args){

							$rootScope.user = args;
							$rootScope.loggedIn = true;
							if($rootScope.user.type === 'Site Administrator'){
								$rootScope.loggedInAdmin = true;
								$rootScope.loggedInDeveloper = true;
							}else if($rootScope.user.type === 'Developer'){
								$rootScope.loggedInDeveloper = true;
							}

						});

						$rootScope.$on('authenticationLogout', function(event, args){

							$rootScope.loggedIn = false;
							$rootScope.loggedInAdmin = false;
							$rootScope.loggedInDeveloper = false;
							$rootScope.user = {};

						});

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