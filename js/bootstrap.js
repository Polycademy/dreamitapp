/* ==========================================================================
   REQUIREJS BOOTSTRAPPER
   ========================================================================== */

requirejs.config({
	enforceDefine: true,
	baseUrl: 'js/',
	paths: {
		'domReady': 'lib/domReady.min',
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
		//MASONRY
		'eventie': '../bower_components/eventie',
		'doc-ready': '../bower_components/doc-ready',
		'eventEmitter': '../bower_components/eventEmitter',
		'get-style-property': '../bower_components/get-style-property',
		'get-size': '../bower_components/get-size',
		'matches-selector': '../bower_components/matches-selector',
		'outlayer': '../bower_components/outlayer',
		'imagesLoaded': '../bower_components/imagesloaded/imagesloaded',
		'masonry': '../bower_components/masonry/masonry',
		//ADDTHIS (this may need to be shimmed? or moved towards something else)
		'addthis': '//s7.addthis.com/js/300/addthis_widget.js#' + dreamItAppConfig.apiKeys.addThis
	},
	shim: {
		'bootstrap': {
			deps: ['jquery'],
			exports: "$"
		},
		'angular': {
			deps: ['jquery'],
			exports: "angular"
		},
		'angular-resource': {
			deps: ['angular'],
			exports: "angular"
		},
		'angular-cookies': {
			deps: ['angular'],
			exports: "angular"
		},
		'angular-sanitize': {
			deps: ['angular'],
			exports: "angular"
		},
		'angular-ui': {
			deps: ['angular'],
			exports: "angular"
		},
		'angular-bootstrap': {
			deps: ['angular'],
			exports: "angular"
		},
		'angular-ui-router': {
			deps: ['angular'],
			exports: "angular"
		},
		'addthis': {
			exports: "addthis"
		}
	}
});

require(['app']);