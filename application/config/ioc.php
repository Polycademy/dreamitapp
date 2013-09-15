<?php

/**
 * Pimple uses anonymous functions (lambdas) so it can "lazy load" the classes.
 * The functions will not be processed when the PHP interpreter goes through this file.
 * They will be kept inside the function waiting to be called as part of the container array.
 * Once you call the functions, then the objects will be created! Thus "lazy loading", not "eager loading". Saves memory too!
 * The functions can also be "shared", so they are not executed everytime it is called, even more lazier loading!
 * Note Pimple is an object that acts like an array, see the actual Pimple code to see how this works.
 * This usage assumes that you have autoloading working, so that the references to the classes will be autoloaded!
 * "$this->config" corresponds to the config files. It can be accessed inside the closures in 5.4.
 */

$ioc = new Pimple;

/**
 * Setups a PDO Database Handle.
 * This is for libraries that will require database connection.
 */
$ioc['Database'] = $ioc->share(function($c){
	$CI = get_instance();
	$CI->load->database();
	$dbh = $CI->db->conn_id;
	return $dbh;
});

/**
 * Monolog Logger using FirePHP and StreamHandler for Libraries
 */
$ioc['Logger'] = $ioc->share(function($c){

	//$this is available inside the anonymous function in 5.4
	if($this->config['log_threshold'] !== 0){
	
		$log_path = APPPATH . 'logs/dev.php';
		
		//codeigniter's options is a maximum threshold, while monolog is a minimum threshold, we'll need to switch them around
		switch($this->config['log_threshold']){
			case 1:
				$log_threshold = Monolog\Logger::ERROR;
				break;
			case 2:
				$log_threshold = Monolog\Logger::NOTICE;
				break;
			case 3:
				$log_threshold = Monolog\Logger::INFO;
				break;
			case 4:
				$log_threshold = Monolog\Logger::DEBUG;
				break;
			default:
				$log_threshold = Monolog\Logger::DEBUG;
		}
		
		$logger = new Monolog\Logger('Monolog');
		$logger->pushHandler(new Monolog\Handler\StreamHandler($log_path, $log_threshold));
		$logger->pushHandler(new Monolog\Handler\FirePHPHandler($log_threshold));
	
	}else{
	
		//if the log_threshold was 0, then we should simply disable it, this is fine for libraries that accept a null parameter for optional classes
		$logger = null;
		
	}
	
	return $logger;
	
});

/**
 * PolyAuth Options
 */
$ioc['PolyAuth\Options'] = $ioc->share(function($c){
	return new PolyAuth\Options($this->config['polyauth']);
});

/**
 * PolyAuth Language
 */
$ioc['PolyAuth\Language'] = $ioc->share(function($c){
	return new PolyAuth\Language;
});

/**
 * PolyAuth Storage using MySQL Adapter
 */
$ioc['PolyAuth\Storage'] = $ioc->share(function($c){
	return new PolyAuth\Storage\MySQLAdapter($c['Database'], $c['PolyAuth\Options'], $c['Logger']);
});

$ioc['PolyAuth\Emailer'] = $ioc->share(function($c){
	return new PolyAuth\Emailer($c['PolyAuth\Options'], $c['PolyAuth\Language'], $c['Logger']);
});

/**
 * PolyAuth AccountsManager
 */
$ioc['PolyAuth\Accounts\AccountsManager'] = $ioc->share(function($c){

	$accounts_manager = new PolyAuth\Accounts\AccountsManager(
		$c['PolyAuth\Storage'], 
		$c['PolyAuth\Options'], 
		$c['PolyAuth\Language'], 
		$c['Logger']
	);

	return $accounts_manager;

});

$ioc['PolyAuth\Accounts\Rbac'] = $ioc->share(function($c){

	$rbac = new PolyAuth\Accounts\Rbac(
		$c['PolyAuth\Storage'], 
		$c['PolyAuth\Language'], 
		$c['Logger']
	);

	return $rbac;

});

//we need to pass the $ioc into the global $config variable, so now it can be accessed by Codeigniter
$config['ioc'] = $ioc;