<?php

class Home extends CI_Controller{

	protected $interceptor;

	public function __construct(){
	
		parent::__construct();
		$ioc = $this->config->item('ioc');
		$this->interceptor = $ioc['SnapSearchClientPHP'];
	
	}
	
	public function index(){

		//interception should only occur in production
		$response = false;
		if(ENVIRONMENT == 'production'){
			try{
				$response = $this->interceptor->intercept();
			}catch(SnapSearchClientPHP\SnapSearchException $e){}
		}

		if($response){

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