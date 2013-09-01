<?php

class Tags extends CI_Controller{

	public function __construct(){
		parent::__construct();
		$this->load->model('Tags_model');
	}
	
	/**
	 * Get all tags
	 * @queryparam Integer limit   Limit the number of results
	 * @queryparam Integer offset  Offset the limit
	 * @queryparam Integer idea    Filter by a particular idea id
	 * @queryparam Integer author  Filter by a particular author id
	 * @queryparam Boolean popular Order by likes
	 * @return JSON
	 */
	public function index(){
		
		$limit = $this->input->get('limit', true);
		$offset = $this->input->get('offset', true);
		$idea = $this->input->get('idea', true);
		$author = $this->input->get('author', true);
		$popular = $this->input->get('popular', true);
		
		$query = $this->Tags_model->read_all($limit, $offset, $idea, $author, $popular);
		
		if($query){
			
			$content = $query; //assign query
			$code = 'success'; //assign code
			
		}else{
		
			$this->output->set_status_header('404');
			$content = current($this->Tags_model->get_errors());
			$code = key($this->Tags_model->get_errors());
			
		}
		
		$output = array(
			'content'	=> $content,
			'code'		=>$code,
		);
		
		Template::compose(false, $output, 'json');

	}
	
	/**
	 * Get a specific tag
	 * @param Integer $id Id of the tag
	 * @return JSON
	 */
	public function show($id){
		
		$query = $this->Tags_model->read($id);		
		
		if($query){
			
			$content = $query;
			$code = 'success';
		
		}else{
		
			$this->output->set_status_header('404');
			$content = current($this->Tags_model->get_errors());
			$code = key($this->Tags_model->get_errors());
		
		}
		
		$output = array(
			'content'	=> $content,
			'code'		=> $code,
		);
		
		Template::compose(false, $output, 'json');
		
	}
	
	public function create(){
		
	}
	
	public function update($id){
		
	}

	public function delete($id){
		
	}

}