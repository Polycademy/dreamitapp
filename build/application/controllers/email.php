<?php

class Email extends CI_Controller{

	public function __construct(){
	
		parent::__construct();

		$this->load->model('Email_model');
	
	}

	//then test as a developer to send mail! (using cmcdragonkai@gmail.com
	public function create(){

		$data = $this->input->json(false);

		//reassign fromEmail to always be from the app, but the replyTo will be the sender's email
		$data['replyTo'] = $data['fromEmail'];
		$data['fromEmail'] = $this->config->item('sitemeta')['email'];

		if(isset($data['intention']) AND $data['intention'] == 'enquiry'){
			$query = $this->Email_model->send_enquiry($data);
		}else{
			$query = $this->Email_model->send($data);
		}

		if($query){
		
			$this->output->set_status_header('201');
			$content = $query;
			$code = 'success';
		
		}else{
		
			$content = current($this->Email_model->get_errors());
			$code = key($this->Email_model->get_errors());
			$this->output->set_status_header(400);
			
		}
		
		$output = array(
			'content'	=> $content,
			'code'		=> $code,
		);
		
		Template::compose(false, $output, 'json');
	
	}

}