<?php

class Ideas extends CI_Controller{

	public function __construct(){

		//THIS STILL REQUIRES the loading of the PolyAuth
		parent::__construct();
		$this->load->model('Ideas_model');

	}
	
	/**
	 * Gets all Ideas
	 * @queryparam integer limit   Limit the number of results
	 * @queryparam integer offset  Offset the limit
	 * @queryparam string  tags    Tags in the form of "iphone+ipad"
	 * @queryparam integer author  Filter by a particular author id
	 * @queryparam boolean popular Order by likes
	 * @return JSON
	 **/
	public function index(){
		
		$limit = $this->input->get('limit', true);
		$offset = $this->input->get('offset', true);
		$tags = $this->input->get('tags', true);
		$author = $this->input->get('author', true);
		$popular = $this->input->get('popular', true);

		//tags are already decoded from $_GET, the "+" gets turned into spaces
		if(!empty($tags)){
			$tags = explode(' ', $tags);
		}else{
			$tags = false;
		}
		
		$query = $this->Ideas_model->read_all($limit, $offset, $tags, $author, $popular);
		
		if($query){
			
			$content = $query; //assign query
			$code = 'success'; //assign code
			
		}else{
		
			$this->output->set_status_header('404');
			$content = current($this->Ideas_model->get_errors());
			$code = key($this->Ideas_model->get_errors());
			
		}
		
		$output = array(
			'content'	=> $content,
			'code'		=>$code,
		);
		
		Template::compose(false, $output, 'json');

	}
	
	/**
	 * Gets one idea
	 * @param int Idea id
	 * @return JSON
	 **/
	public function show($id){
		
		$query = $this->Ideas_model->read($id);		
		
		if($query){
			
			$content = $query;
			$code = 'success';
		
		}else{
		
			$this->output->set_status_header('404');
			$content = current($this->Ideas_model->get_errors());
			$code = key($this->Ideas_model->get_errors());
		
		}
		
		$output = array(
			'content'	=> $content,
			'code'		=> $code,
		);
		
		Template::compose(false, $output, 'json');
		
	}
	
	/**
	 * Posts a new idea
	 * @postparam json Input data of the Idea
	 * @return JSON
	 **/
	public function create(){
		
		//codeigniter's XSS clean would add a semicolon if "&" is used by itself
		$data = $this->input->json(false);

		//based on PolyAuth
		//currently hardcoded
		$data['authorId'] = 1;
		
		$query = $this->Ideas_model->create($data);
		
		if($query){
		
			$this->output->set_status_header('201');
			$content = $query; //resource id
			$code = 'success';
		
		}else{
		
			
			$content = current($this->Ideas_model->get_errors());
			$code = key($this->Ideas_model->get_errors());
			
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
	
	/**
	 * Updates a particular idea
	 * @param int Idea ID
	 * @putparam json Updated input data for the Idea
	 * @return JSON
	 **/
	public function update($id){
		
		$data = $this->input->json(false);
		
		$query = $this->Ideas_model->update($id, $data);
		
		if($query){
		
			$content = $id;
			$code = 'success';
			
		}else{
		
			$content = current($this->Ideas_model->get_errors());
			$code = key($this->Ideas_model->get_errors());

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
	
	/**
	 * Deletes a particular idea
	 * @param int Idea ID
	 * @return JSON
	 **/
	public function delete($id){
		
		$query = $this->Ideas_model->delete($id);
		
		if($query){
		
			$content = $id;
			$code = 'success';
			
		}else{
		
			$content = current($this->Ideas_model->get_errors());
			$code = key($this->Ideas_model->get_errors());
		
		}
		
		$output = array(
			'content'	=> $content,
			'code'		=> $code,
		);
		
		Template::compose(false, $output, 'json');
		
	}

}