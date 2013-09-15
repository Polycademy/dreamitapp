<?php

class Sessions extends CI_Controller{

	public function __construct(){

		parent::__construct();
		$this->load->model('Sessions_model');
	
	}

	// public function index(){

	// }
	
	public function show($id){
		
	}

	public function create(){

		$data = $this->input->json(false);

		$query = $this->Session_model->create($data);
		
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

	public function update($id){

	}

	public function delete($id){

	}

}