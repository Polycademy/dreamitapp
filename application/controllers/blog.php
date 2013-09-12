<?php

class Blog extends CI_Controller{

	public function __construct(){
		parent::__construct();
		$this->load->model('Blog_model');
	}

	public function index(){

		$limit = $this->input->get('limit', true);
		$offset = $this->input->get('offset', true);
		
		$query = $this->Blog_model->read_all($limit, $offset);
		
		if($query){
			
			$content = $query; //assign query
			$code = 'success'; //assign code
			
		}else{
		
			$this->output->set_status_header('404');
			$content = current($this->Blog_model->get_errors());
			$code = key($this->Blog_model->get_errors());
			
		}
		
		$output = array(
			'content'	=> $content,
			'code'		=>$code,
		);
		
		Template::compose(false, $output, 'json');

	}
	
	public function show($id){

		$query = $this->Blog_model->read($id);		
		
		if($query){
			
			$content = $query;
			$code = 'success';
		
		}else{
		
			$this->output->set_status_header('404');
			$content = current($this->Blog_model->get_errors());
			$code = key($this->Blog_model->get_errors());
		
		}
		
		$output = array(
			'content'	=> $content,
			'code'		=> $code,
		);
		
		Template::compose(false, $output, 'json');
		
	}

	public function create(){

		$data = $this->input->json(false);

		//based on PolyAuth
		//currently hardcoded,
		//ONLY ALLOW ADMIN USER TO CREATE BLOGS
		$data['authorId'] = 1;
		
		$query = $this->Blog_model->create($data);
		
		if($query){
		
			$this->output->set_status_header('201');
			$content = $query; //resource id
			$code = 'success';
		
		}else{
		
			
			$content = current($this->Blog_model->get_errors());
			$code = key($this->Blog_model->get_errors());
			
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
		
		$query = $this->Blog_model->update($id, $data);
		
		if($query){
		
			$content = $id;
			$code = 'success';
			
		}else{
		
			$content = current($this->Blog_model->get_errors());
			$code = key($this->Blog_model->get_errors());

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

		$query = $this->Blog_model->delete($id);
		
		if($query){
		
			$content = $id;
			$code = 'success';
			
		}else{
		
			$content = current($this->Blog_model->get_errors());
			$code = key($this->Blog_model->get_errors());
		
		}
		
		$output = array(
			'content'	=> $content,
			'code'		=> $code,
		);
		
		Template::compose(false, $output, 'json');

	}

}