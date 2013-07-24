'use strict';

/* ==========================================================================
   BOOTSTRAPPER
   ========================================================================== */

//app is an module that is dependent on several top level modules
var app = angular.module('App', [
	'Controllers',
	'Filters',
	'Services',
	'Directives',
	'ngResource',
	'ngCookies',
	'ngSanitize',
	'ui',
	'ui.bootstrap',
	'ui.state'
]);

//Define all the page level controllers (Application Logic)
angular.module('Controllers', []);
//Define all shared filters (UI Filtering)
angular.module('Filters', []);
//Define all shared services (Interaction with Backend)
angular.module('Services', []);
//Define all shared directives (UI Logic)
angular.module('Directives', []);

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
						url: '/',
						templateUrl: 'home.html',
						controller: 'HomeCtrl'
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
				);
			
			//redirect anything else to home page
			$urlRouterProvider.otherwise('/');
			
		}
	]
);

/* ==========================================================================
   CONFIGURE ANGULAR UI
   ========================================================================== */
/*
//not using currently
app.value('ui.config', {
	select2: {
		allowClear: true
	}
});
*/

/* ==========================================================================
   GLOBAL FEATURES
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
		
	}
]);