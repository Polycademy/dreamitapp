<?php

class Oauth extends CI_Controller{

	public function __construct(){

		parent::__construct();
		$this->load->model('Oauth_model');

	}

	public function create(){

		$data = $this->input->json(false);
		
		$query = $this->Oauth_model->create($data);
		
		if($query){
		
			$this->output->set_status_header('201');
			$content = $query; //resource id
			$code = 'success';
		
		}else{
		
			
			$content = current($this->Oauth_model->get_errors());
			$code = key($this->Oauth_model->get_errors());
			
			if($code == 'validation_error'){
				$this->output->set_status_header(400);
			}elseif($code == 'system_error'){
				$this->output->set_status_header(500);
			}
			
		}
		
		$output = array(
			'content'	=> $content,
			'code'		=> $code,
		);
		
		Template::compose(false, $output, 'json');

	}

}