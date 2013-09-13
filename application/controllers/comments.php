<?php

class Comments extends CI_Controller{

	public function __construct(){
		parent::__construct();
		$this->load->model('Comments_model');
	}

	public function index(){

		$limit = $this->input->get('limit', true);
		$offset = $this->input->get('offset', true);
		$idea_id = $this->input->get('idea', true);
		
		$query = $this->Comments_model->read_all($limit, $offset, $idea_id);
		
		if($query){
			
			$content = $query;
			$code = 'success';
			
		}else{
		
			$this->output->set_status_header('404');
			$content = current($this->Comments_model->get_errors());
			$code = key($this->Comments_model->get_errors());
			
		}
		
		$output = array(
			'content'	=> $content,
			'code'		=>$code,
		);
		
		Template::compose(false, $output, 'json');

	}

	public function create(){

		$data = $this->input->json(false);

		//based on PolyAuth
		//currently hardcoded,
		$data['authorId'] = 1;
		
		$query = $this->Comments_model->create($data);
		
		if($query){
		
			$this->output->set_status_header('201');
			$content = $query; //resource id
			$code = 'success';
		
		}else{
			
			$content = current($this->Comments_model->get_errors());
			$code = key($this->Comments_model->get_errors());
			
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