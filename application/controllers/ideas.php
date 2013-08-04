<?php

class Ideas extends CI_Controller{

	public function __construct(){
		//THIS STILL REQUIRES the loading of the PolyAuth
		//Also requires compliance with validation but not yet
		parent::__construct();
		$this->load->model('Ideas_model');
	}
	
	/**
	 * Gets all Ideas
	 *
	 * @queryparam integer limit Limit the number of results
	 * @queryparam integer offset Offset the limit
	 * @queryparam string tags Tags in the form of "iphone+ipad"
	 * @return JSON
	 **/
	public function index(){
		
		$limit = $this->input->get('limit', true);
		$offset = $this->input->get('offset', true);
		$tags = $this->input->get('tags', true);

		//tags are already decoded from $_GET, the + gets turned into spaces
		if(!empty($tags)){
			$tags = explode(' ', $tags);
		}else{
			$tags = false;
		}
		
		$query = $this->Ideas_model->read_all($limit, $offset, $tags);
		
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
	 *
	 * @param int Course ID
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
	 *
	 * @postparam json Input data of the course
	 * @return JSON
	 **/
	public function create(){

		$this->authenticated();
		
		$data = $this->input->json(false, true);
		
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
	 *
	 * @param int Course ID
	 * @putparam json Updated input data for the course
	 * @return JSON
	 **/
	public function update($id){

		$this->authenticated();
		
		$data = $this->input->json(false, true);
		
		$query = $this->Ideas_model->update($id, $data);
		
		if($query){
		
			$content = $id;
			$code = 'success';
			
		}else{
		
			$this->output->set_status_header('200');
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
	 * Deletes a particular idea
	 *
	 * @param int Course ID
	 * @return JSON
	 **/
	public function delete($id){

		//authenticated needs to check for either:
		//User is logged in and owns the object
		//Or if the user has the authority to delete everything
		//The Polyhack authenticated is all or nothing.
		//The model could check if the current logged in user has these features
		//This one just simply checks if it is logged in or what ever
		$this->authenticated();
		
		$query = $this->Ideas_model->delete($id);
		
		if($query){
		
			$content = $id;
			$code = 'success';
			
		}else{
		
			$this->output->set_status_header('200');
			$content = current($this->Ideas_model->get_errors());
			$code = key($this->Ideas_model->get_errors());
		
		}
		
		$output = array(
			'content'	=> $content,
			'code'		=> $code,
		);
		
		Template::compose(false, $output, 'json');
		
	}
	
	private function authenticated(){
		//check if person was authenticated
		/*
			$output = array(
				'content'	=> 'You need to login to do this action.',
				'code'	=> 'error',
			);
		*/
	}

}