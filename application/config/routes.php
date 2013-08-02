<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

Pigeon::map(function($r){
	
	//RESOURCES ROUTING
	$r->route('api', false, function($r){
	
		//for migrations, these should be commented out when you've done your migration!
		$r->get('migrate', 'migrate/index');
		$r->get('migrate/latest', 'migrate/latest');
		$r->get('migrate/current', 'migrate/current');
		$r->get('migrate/version/(:num)', 'migrate/version/$1');
		$r->get('migrate/restart',  'migrate/restart');
		$r->get('migrate/restart/(:num)',  'migrate/restart/$1');
		
		//services
		$r->resources('ideas');
		
		//for user accounts
		$r->resources('accounts');
		
		//for logging in and out
		$r->resources('sessions');
		
	});
	
	//CLIENT SIDE ROUTING
	$r->route('(.*)', 'home#index');
	
});

$route = Pigeon::draw();

$route['default_controller'] = 'home';
$route['404_override'] = '';
$route['translate_uri_dashes'] = FALSE;