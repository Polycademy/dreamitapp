<?php

class Home extends CI_Controller{

	protected $interceptor;

	public function __construct(){
	
		parent::__construct();
		$ioc = $this->config->item('ioc');
		$this->interceptor = $ioc['SnapSearchClientPHP'];
	
	}
	
	public function index(){

		// ACCESS LOGGING (currently disabled)
		// $real_ip = null;
		// if(isset($_SERVER['X_FORWARDED_FOR'])){
		// 	$real_ip = $_SERVER['X_FORWARDED_FOR'];
		// }

		// file_put_contents(FCPATH . '/access_logs/access_log.txt', 
		// 	json_encode(
		// 		array(
		// 			$_SERVER['HTTP_USER_AGENT'],
		// 			$_SERVER['REMOTE_ADDR'],
		// 			$real_ip,
		// 			$_SERVER['REQUEST_URI'],
		// 			time()
		// 		),
		// 		JSON_PRETTY_PRINT
		// 	)
		// , FILE_APPEND | LOCK_EX);

		//interception should only occur in production
		$response = false;
		if(ENVIRONMENT == 'production'){
			try{
				$response = $this->interceptor->intercept();
				var_dump($response);
				exit;
			}catch(SnapSearchClientPHP\SnapSearchException $e){}
		}

		if($response){

			if(!empty($response['headers'])){
				foreach($response['headers'] as $header){
					if($header['name'] == 'Location'){
						header($header['name'] . ': ' . $header['value']);
					}
				}
			}

			$this->output->set_status_header($response['status']);

			echo $response['html'];

		}else{

			//when we're in production we can cache the main page for 48 hrs, this requires the cache to be writable, or else this won't work!
			if(ENVIRONMENT == 'production'){
				$this->output->cache(2880);
			}
			
			//due to single page app, we're just going with a default layout, no need for server side templating libraries
			$this->load->view('layouts/default_layout', $this->config->item('sitemeta'));	
		
		}
	
	}

}