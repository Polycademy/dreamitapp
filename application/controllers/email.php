<?php

class Email extends CI_Controller{

	public function __construct(){
	
		parent::__construct();

		$this->load->model('Email_model');
	
	}
	
	/**
	 * Sends either an enquiry email to ourselves or sends to an idea author.
	 * @param json $data JSON post data that can include toEmail, fromEmail, message, authorName, senderName, ideaId, ideaUrl, ideaTitle  
	 * @return [type] [description]
	 */
	public function send(){

		$data = $this->input->json(false);

		//reassign fromEmail to always be from the app, but the replyTo will be the sender's email
		$data['replyTo'] = $data['fromEmail'];
		$data['fromEmail'] = $this->config->item('sitemeta')['email'];

		//if the toEmail is the same as the app's email, then it's an enquiry email
		if(isset($data['toEmail']) AND $data['toEmail'] == $this->config->item('sitemeta')['email']){

			$query = $this->Email_model->send_enquiry($data);

		//else it's a custom email to an idea author, we need them to be logged in
		}else{
			
			$query = $this->Email_model->send_developer_contact($data);

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