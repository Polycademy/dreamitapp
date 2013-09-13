<?php

/**
 * This is the email controller.
 * This controller needs improvement.
 * Firstly the templating process of emails needs to be handled in a more modularised manner. It should be after
 * validation of properties required to send emails.
 * The Email_model also needs improvement, it requires more breaking down and modularisation of the functions.
 * This class should also be more transparent, it needs to specify what kind of data is being expected to allow to be sent.
 */
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
			//also check if the toEmail is one of the users that are registered on the site!
			//also check if the fromEmail is one of the users that are registered on the site!
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