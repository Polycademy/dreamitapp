<?php

class Email extends CI_Controller{

	public function __construct(){
	
		parent::__construct();

		$this->load->model('Email_model');
	
	}
	
	public function send(){

		$data = $this->input->json(false);

		$to = $data['toEmail'];
		$from = $this->config->item('sitemeta')['email'];
		$reply_to = $data['fromEmail'];

		//if the toEmail is the same as the app's email, then it's an enquiry email
		if($data['toEmail'] == $this->config->item('sitemeta')['email']){

			//enquiry emails have no markup
			$message = $data['message'];
			$html = false;

		//else it's a custom email to an idea author, we need them to be logged in
		}else{

			//check if the user is logged in, if not, don't allow it
			//POLYAUTH!
			
			$message = $this->load->view('emails/developer_contact_email', $data, true);
			$html = true;

		}

		$query = $this->Email_model->send($to, $from, $reply_to, $message, $html);

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