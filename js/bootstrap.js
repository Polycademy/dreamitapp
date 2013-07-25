/* ==========================================================================
   REQUIREJS BOOTSTRAPPER
   ========================================================================== */

requirejs.config({
	//enforceDefine: true, //this may have problems with scripts that don't export things
	baseUrl: 'js/',
	paths: {
		'jquery': [
			'//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min',
			'../bower_components/jquery/jquery.min'
		],
		'bootstrap': [
			'//cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/2.3.2/js/bootstrap.min',
			'lib/bootstrap.min'
		],
		'angular': [
			'//ajax.googleapis.com/ajax/libs/angularjs/1.0.7/angular.min',
			'../bower_components/angular/angular.min'
		],
		'angular-resource': [
			'//cdnjs.cloudflare.com/ajax/libs/angular.js/1.0.7/angular-resource.min',
			'../bower_components/angular-resource/angular-resource.min'
		],
		'angular-cookies': [
			'//cdnjs.cloudflare.com/ajax/libs/angular.js/1.0.7/angular-cookies.min',
			'../bower_components/angular-cookies/angular-cookies.min'
		],
		'angular-sanitize': [
			'//cdnjs.cloudflare.com/ajax/libs/angular.js/1.0.7/angular-sanitize.min',
			'../bower_components/angular-sanitize/angular-sanitize.min'
		],
		'angular-ui': [
			'//cdnjs.cloudflare.com/ajax/libs/angular-ui/0.4.0/angular-ui.min',
			'../bower_components/angular-ui/build/angular-ui.min'
		],
		'angular-bootstrap': [
			'//cdnjs.cloudflare.com/ajax/libs/angular-ui-bootstrap/0.4.0/ui-bootstrap-tpls.min',
			'../bower_components/angular-bootstrap/ui-bootstrap-tpls.min'
		],
		'angular-ui-router': [
			'//cdnjs.cloudflare.com/ajax/libs/angular-ui-router/0.0.1/angular-ui-router.min',
			'../bower_components/angular-ui-router/release/angular-ui-router.min'
		],
		'es5-shim': [
			'//cdn.jsdelivr.net/es5.shim/2.1.0/es5-shim.min',
			'../bower_components/es5-shim/es5-shim.min'
		],
		'es6-shim': '../bower_components/es6-shim/es6-shim',
		'json3': '../bower_components/json3/lib/json3.min',
		'domReady': 'lib/domReady.min'
	},
	shim: {
		'bootstrap': {
			deps: ['jquery'],
			exports: '$.fn.popover'
		},
		'angular': {
			exports: 'angular',
			deps: ['jquery']
		},
		'angular-resource': {
			deps: ['angular']
		},
		'angular-cookies': {
			deps: ['angular']
		},
		'angular-sanitize': {
			deps: ['angular']
		},
		'angular-ui': {
			deps: ['angular']
		},
		'angular-bootstrap': {
			deps: ['angular']
		},
		'angular-ui-router': {
			deps: ['angular']
		}
	}
});

define([
		'angular', //angular needs to be ready
		'domReady', //the dom is loaded
		'app',
	], function(angular, domReady){

		'use strict';

		domReady(function(){
			return angular.bootstrap(document, ['App']);
		});

});