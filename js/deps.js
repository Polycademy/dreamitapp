define([
	'angular',
	'angular-resource',
	'angular-cookies',
	'angular-sanitize',
	'angular-ui',
	'angular-bootstrap',
	'angular-ui-router',
	], function(angular){

		'use strict';

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

		//These become the parent modules for all other Angular modules. Notice that
		//angular controller don't have the [] at the 2nd parameter
		//This means they simply attach themselves to the controllers.
		//Define all the page level controllers (Application Logic)
		angular.module('Controllers', []);
		//Define all shared filters (UI Filtering)
		angular.module('Filters', []);
		//Define all shared services (Interaction with Backend)
		angular.module('Services', []);
		//Define all shared directives (UI Logic)
		angular.module('Directives', []);

		return app;

});