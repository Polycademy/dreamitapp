<?php

class About extends CI_Controller{

	public function __construct(){
		parent::__construct();
		$this->load->model('About_model');
	}

	public function show(){

		$query = $this->About_model->read();

		if($query){
			
			$content = $query;
			$code = 'success';
		
		}else{
		
			$this->output->set_status_header('404');
			$content = current($this->About_model->get_errors());
			$code = key($this->About_model->get_errors());
		
		}
		
		$output = array(
			'content'	=> $content,
			'code'		=> $code,
		);
		
		Template::compose(false, $output, 'json');

	}

	public function update($id){

		$data = $this->input->json(false);
		
		$query = $this->About_model->update($id, $data);
		
		if($query){
		
			$content = $id;
			$code = 'success';
			
		}else{
		
			$content = current($this->About_model->get_errors());
			$code = key($this->About_model->get_errors());

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