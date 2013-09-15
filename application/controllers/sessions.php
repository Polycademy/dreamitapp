<?php

class Sessions extends CI_Controller{

	public function __construct(){

		parent::__construct();
		$this->load->model('Sessions_model');
	
	}

	public function test(){

		$data['email'] = 'roger.qiu@polycademy.com';
		$data['password'] = 'long0810';
		$this->Sessions_model->create($data);

	}
	
	public function show($id){
		
		//start the session and the current session
		$query = $this->Sessions_model->read($id);

		//return user id if logged in
		if($query AND $query !== 0){

			$content = $query;
			$code = 'success';

		}else{

			$content = current($this->Sessions_model->get_errors());
			$code = key($this->Sessions_model->get_errors());
			
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

	public function create(){

		$data = $this->input->json(false);

		$query = $this->Sessions_model->create($data);
		
		if($query){
		
			$this->output->set_status_header('201');
			$content = $query; //resource id
			$code = 'success';
		
		}else{
		
			
			$content = current($this->Sessions_model->get_errors());
			$code = key($this->Sessions_model->get_errors());
			
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

		$query = $this->Sessions_model->delete($id);

		if($query){

			$content = $id;
			$code = 'success';

		}else{

			$content = current($this->Sessions_model->get_errors());
			$code = key($this->Sessions_model->get_errors());

		}

		$output = array(
			'content'	=> $content,
			'code'		=> $code,
		);
		
		Template::compose(false, $output, 'json');

	}

}