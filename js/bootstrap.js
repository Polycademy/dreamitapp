/* ==========================================================================
   REQUIREJS BOOTSTRAPPER
   ========================================================================== */
define(function(){

	requirejs.config({
		enforceDefine: true,
		baseUrl: 'js/',
		urlArgs: 'bust=' +  (new Date()).getTime(),
		waitSeconds: 12,
		paths: {
			//FRAMEWORK
			'jquery': '../bower_components/jquery/jquery.min',
			'twitter-bootstrap': 'lib/bootstrap.min',
			'angular': '../bower_components/angular/angular.min',
			'angular-resource': '../bower_components/angular-resource/angular-resource.min',
			'angular-cookies': '../bower_components/angular-cookies/angular-cookies.min',
			'angular-sanitize': '../bower_components/angular-sanitize/angular-sanitize.min',
			'angular-ui': '../bower_components/angular-ui/build/angular-ui.min',
			'angular-bootstrap': '../bower_components/angular-bootstrap/ui-bootstrap-tpls.min',
			'angular-ui-router': '../bower_components/angular-ui-router/release/angular-ui-router.min',
			'angular-cache': '../bower_components/angular-cache/src/angular-cache',
			'angulartics': '../bower_components/angulartics/src/angulartics',
			'angulartics-google-analytics': '../bower_components/angulartics/src/angulartics-google-analytics',
			//ANGULAR UI SELECT2
			'select2': '../bower_components/select2/select2.min',
			'angular-ui-select2': '../bower_components/angular-ui-select2/src/select2',
			//SHIMS AND UTILITIES
			'domReady': 'lib/domReady.min',
			'lodash': '../bower_components/lodash/dist/lodash.min',
			'es5-shim':	'../bower_components/es5-shim/es5-shim.min',
			'es6-shim': '../bower_components/es6-shim/es6-shim',
			'json3': '../bower_components/json3/lib/json3.min',
			//JQUERY PLUGINS
			'jquery-resize': 'lib/jquery.ba-resize.min',
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
			//SHARETHIS
			'sharethis': '//w.sharethis.com/button/buttons',
			//FILEPICKER
			'filepicker': '//api.filepicker.io/v1/filepicker',
		},
		shim: {
			'twitter-bootstrap': {
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
			'angular-cache': {
				deps: ['angular'],
				exports: "angular"
			},
			'angulartics': {
				deps: ['angular'],
				exports: "angular"
			},
			'angulartics-google-analytics': {
				deps: ['angular', 'angulartics'],
				exports: "angular"
			},
			'select2': {
				deps: ['jquery'],
				exports: "$"
			},
			'angular-ui-select2': {
				deps: ['angular', 'select2'],
				exports: "angular"
			},
			'jquery-resize': {
				deps: ['jquery'],
				exports: "$"
			},
			'sharethis': {
				exports: "stLight"
			},
			'filepicker': {
				exports: "filepicker"
			}
		}
	});

	require(['app']);

});