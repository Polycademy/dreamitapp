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

$script('//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js', 'jquery', null, fallback);

$script.ready('jquery', function(){

	$script('//cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/2.3.2/js/bootstrap.min.js', 'bootstrap', null, fallback);
	$script('//ajax.googleapis.com/ajax/libs/angularjs/1.0.7/angular.min.js', 'angular', null, fallback);
	$script('//cdnjs.cloudflare.com/ajax/libs/angular.js/1.0.7/angular-resource.min.js', 'angular-resource', null, fallback);
	$script('//cdnjs.cloudflare.com/ajax/libs/angular.js/1.0.7/angular-cookies.min.js', 'angular-cookies', null, fallback);
	$script('//cdnjs.cloudflare.com/ajax/libs/angular.js/1.0.7/angular-sanitize.min.js', 'angular-sanitize', null, fallback);
	$script('//cdnjs.cloudflare.com/ajax/libs/angular-ui/0.4.0/angular-ui.min.js', 'angular-ui', null, fallback);
	$script('//cdnjs.cloudflare.com/ajax/libs/angular-ui-bootstrap/0.4.0/ui-bootstrap-tpls.min.js', 'angular-bootstrap', null, fallback);
	$script('//cdnjs.cloudflare.com/ajax/libs/angular-ui-router/0.0.1/angular-ui-router.min.js', 'angular-ui-router', null, fallback);
	$script('//cdn.jsdelivr.net/es5.shim/2.1.0/es5-shim.min.js', 'es5-shim', null, fallback);

	$script([
		'bower_components/es6-shim/es6-shim.js',
		'bower_components/json3/lib/json3.min.js'
	], 'local-vendors');

	//this will require manual adding of all local js scripts
	//grunt will need to concatenate and minify into a main.min.js
	//then it will need to replace this code with main.min.12343455.js into the build directory
	//oh and then minify this script itself!
	$script([
		'js/app.js'
	], 'local-scripts');

	$script.ready([
		'jquery', 
		'bootstrap', 
		'angular',
		'angular-resource',
		'angular-cookies',
		'angular-sanitize',
		'angular-ui',
		'angular-bootstrap',
		'angular-ui-router',
		'es5-shim',
		'local-vendors',
		'local-scripts'
	], function(){
		angular.bootstrap(document, ['App']);
	});

});