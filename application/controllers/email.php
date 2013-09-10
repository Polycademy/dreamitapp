<?php

class Email extends CI_Controller{

	public function __construct(){
	
		parent::__construct();

		$this->load->model('Email_model');
	
	}
	
	public function send(){

		$data = $this->input->json(false);

		//if the data's email is not equal to the main email, then we need them to be logged in to be able to use this service
		if($data['toEmail'] != $this->config->item('sitemeta')['email']){
			//check if they are logged in using polyauth
		}

		$query = $this->Email_model->send($data);

		if($query){
		
			$this->output->set_status_header('201');
			$content = $query;
			$code = 'success';
		
		}else{
		
			$content = current($this->Ideas_model->get_errors());
			$code = key($this->Ideas_model->get_errors());
			$this->output->set_status_header(400);
			
		}
		
		$output = array(
			'content'	=> $content,
			'code'		=> $code,
		);
		
		Template::compose(false, $output, 'json');
	
	}

}