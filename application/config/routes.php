<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

Pigeon::map(function($r){
	
	//RESOURCES ROUTING
	$r->route('api', false, function($r){
		
		//services
		$r->resources('ideas');
		$r->resources('tags');
		$r->resources('blog');
		$r->resources('comments');

		//like resource only allows get and put (toggling)
		$r->get('like/(:num)', 'like/show/$1');
		$r->put('like/(:num)', 'like/update/$1');

		//sending emails
		$r->resource('email');
		
		//for authentication/authorisation
		$r->resources('accounts');
		$r->get('accounts/activate', 'accounts/activate');
		$r->resources('sessions');
		$r->resources('oauth');

		//FB login
		$r->resource('facebook');
		
	});

	//CLI ROUTING
	$r->route('cli', false , function($r){

		//cli requests go through route
		
		//php index.php cli migrate restart
		$r->route('migrate', 'migrate/index');
		$r->route('migrate/latest', 'migrate/latest');
		$r->route('migrate/current', 'migrate/current');
		$r->route('migrate/version/(:num)', 'migrate/version/$1');
		$r->route('migrate/restart',  'migrate/restart');
		$r->route('migrate/restart/(:num)',  'migrate/restart/$1');
		
	});
	
	//CLIENT SIDE ROUTING
	$r->route('(.*)', 'home#index');
	
});

$route = Pigeon::draw();

$route['default_controller'] = 'home';
$route['404_override'] = '';
$route['translate_uri_dashes'] = FALSE;