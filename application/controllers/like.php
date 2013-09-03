<?php

class Like extends CI_Controller{

	public function __construct(){

		parent::__construct();
		$this->load->model('Likes_model');
	
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
	 * Updates a like for an idea. Basically +1 or -1. This toggles depending on if the user has clicked
	 * on it before.
	 * @param  Integer $id Id of the idea to toggle likes
	 * @return Json
	 */
	public function update($id){

		//author id needs to be extracted from PolyAuth
		//currently hardcoded
		$author_id = 1;

		//+1 first, if that doesn't work, go -1
		if(!$this->Like_model->up_one($id, $author_id)){
			$this->Like_model->down_one($id, $author_id);
		}

	}

}