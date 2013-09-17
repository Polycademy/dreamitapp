<?php

class Accounts extends CI_Controller{

	public function __construct(){

		parent::__construct();
		$this->load->model('Accounts_model');

	}
	
	public function show($id){

		//this should only show public information, no private information
		$query = $this->Accounts_model->read($id);
		
		if($query){
			
			$content = $query;
			$code = 'success';
		
		}else{
		
			$this->output->set_status_header('404');
			$content = current($this->Accounts_model->get_errors());
			$code = key($this->Accounts_model->get_errors());
		
		}
		
		$output = array(
			'content'	=> $content,
			'code'		=> $code,
		);
		
		Template::compose(false, $output, 'json');
		
	}

	public function create(){

		$data = $this->input->json(false);

		$query = $this->Accounts_model->create($data);
		
		if($query){
		
			$this->output->set_status_header('201');
			$content = $query; //resource id
			$code = 'success';
		
		}else{
		
			
			$content = current($this->Accounts_model->get_errors());
			$code = key($this->Accounts_model->get_errors());
			
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

	public function update($id){

		$data = $this->input->json(false);

		$query = $this->Accounts_model->update($id, $data);
		
		if($query){
		
			$content = $id;
			$code = 'success';
			
		}else{
		
			$content = current($this->Accounts_model->get_errors());
			$code = key($this->Accounts_model->get_errors());

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

	public function delete($id){

		$query = $this->Accounts_model->delete($id);
		
		if($query){
		
			$content = $id;
			$code = 'success';
			
		}else{
		
			$content = current($this->Accounts_model->get_errors());
			$code = key($this->Accounts_model->get_errors());
		
		}
		
		$output = array(
			'content'	=> $content,
			'code'		=> $code,
		);
		
		Template::compose(false, $output, 'json');

	}

	public function activate(){

		$activation_code = $this->input->get('activate');
		$user_id = $this->input->get('user');

		$query = $this->Accounts_model->activate($user_id, $activation_code);

		if($query){
		
			echo 'Ok!';
		
		}else{
		
			echo implode('', $this->get_errors());

		}

	}

}