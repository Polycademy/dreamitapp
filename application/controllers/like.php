<?php

class Like extends CI_Controller{

	public function __construct(){

		parent::__construct();
		$this->load->model('Like_model');
	
	}

	/**
	 * Shows the number of likes for a single idea
	 * @param  Integer $id Id of the idea to get likes from
	 * @return Json
	 */
	public function show($id){

		$query = $this->Like_model->read($id);		
		
		if($query){
			
			$content = $query;
			$code = 'success';
		
		}else{
		
			$this->output->set_status_header('404');
			$content = current($this->Like_model->get_errors());
			$code = key($this->Like_model->get_errors());
		
		}
		
		$output = array(
			'content'	=> $content,
			'code'		=> $code,
		);
		
		Template::compose(false, $output, 'json');

	}

	/**
	 * Updates a like for an idea. Basically +1 or -1. This toggles depending on if the user has liked it before.
	 * This may return validation errors (singular) if the author id or idea id is incorrect.
	 * Otherwise it would return a system error.
	 * @param  Integer $id Id of the idea to toggle likes
	 * @return Json
	 */
	public function update($id){

		//author id needs to be extracted from PolyAuth
		//currently hardcoded
		$author_id = 1;

		$has_liked = $this->Like_model->has_liked($id, $author_id);

		if($has_liked){
			$query = $this->Like_model->down_one($id, $author_id);
		}else{
			$query = $this->Like_model->up_one($id, $author_id);
		}

		if($query){

			$content = $query;
			$code = 'success';

		}else{

			$content = current($this->Tags_model->get_errors());
			$code = key($this->Tags_model->get_errors());

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