var dependencyFallbackList = {
	'jquery': 'bower_components/jquery/jquery.min.js',
	'bootstrap': 'js/lib/bootstrap.min.js',
	'angular': 'bower_components/angular/angular.min.js',
	'angular-resource': 'bower_components/angular-resource/angular-resource.min.js',
	'angular-cookies': 'bower_components/angular-cookies/angular-cookies.min.js',
	'angular-sanitize': 'bower_components/angular-sanitize/angular-sanitize.min.js',
	'angular-ui': 'bower_components/angular-ui/build/angular-ui.min.js',
	'angular-bootstrap': 'bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js',
	'angular-ui-router': 'bower_components/angular-ui-router/release/angular-ui-router.min.js',
	'es5-shim': 'bower_components/es5-shim/es5-shim.min.js'
};

var fallback = function(depsNotFound){
	var name = depsNotFound[0];
	$script(dependencyFallbackList[name], name);
};

//third party scripts from CDNs and fallbacks
$script('//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js', 'jquery', null, fallback);
$script.ready('jquery', function(){
	$script('//cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/2.3.2/js/bootstrap.min.js', 'bootstrap', null, fallback);
});
$script('//ajax.googleapis.com/ajax/libs/angularjs/1.0.7/angular.min.js', 'angular', null, fallback);
$script.ready('angular', function(){
	$script('//cdnjs.cloudflare.com/ajax/libs/angular.js/1.0.7/angular-resource.min.js', 'angular-resource', null, fallback);
	$script('//cdnjs.cloudflare.com/ajax/libs/angular.js/1.0.7/angular-cookies.min.js', 'angular-cookies', null, fallback);
	$script('//cdnjs.cloudflare.com/ajax/libs/angular.js/1.0.7/angular-sanitize.min.js', 'angular-sanitize', null, fallback);
	$script('//cdnjs.cloudflare.com/ajax/libs/angular-ui/0.4.0/angular-ui.min.js', 'angular-ui', null, fallback);
	$script('//cdnjs.cloudflare.com/ajax/libs/angular-ui-bootstrap/0.4.0/ui-bootstrap-tpls.min.js', 'angular-bootstrap', null, fallback);
	$script('//cdnjs.cloudflare.com/ajax/libs/angular-ui-router/0.0.1/angular-ui-router.min.js', 'angular-ui-router', null, fallback);
});
$script('//cdn.jsdelivr.net/es5.shim/2.1.0/es5-shim.min.js', 'es5-shim', null, fallback);

//third party scripts should be finished before proceeding
$script.ready([
	'jquery',
	'angular',
	'angular-resource',
	'angular-cookies',
	'angular-sanitize',
	'angular-ui',
	'angular-bootstrap',
	'angular-ui-router'
], function(){

	//certain local vendors may require jquery, some may not, regardless we'll load all of them here
	$script([
		'bower_components/es6-shim/es6-shim.js',
		'bower_components/json3/lib/json3.min.js'
	]);

	//the app.js front controller needs to be loaded before the rest
	//this will be replaced with main.min.XXX.js in production with app.js as the first one
	$script('js/app.js', function(){

		$script([
			'js/controllers/Home.Controllers.js',
			'js/controllers/Header.Controllers.js',
			'js/services/Users.Service.js',
			'js/services/Accounts.Service.js',
			'js/services/Sessions.Service.js',
			'js/directives/EqualiseHeights.Directive.js'
		], function(){

			angular.bootstrap(document, ['App']);

		});

	});

});