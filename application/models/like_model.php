<?php

class Like_model extends CI_Model{

	protected $errors;

	public function __construct(){

		parent::__construct();
	
	}

	/**
	 * Gets the like count for a single idea
	 * @param  Integer $id Idea id
	 * @return Integer|Boolean
	 */
	public function read($id){

		$this->db->select('likes');
		$this->db->where('id', $id);

		$query = $this->db->get('ideas');

		if($query->num_rows() > 0){
			
			$row = $query->row();

			$data = array(
				'id'		=> $id,
				'likes'		=> intval($row->likes)
			);

			return $data;
			
		}else{
		
			$this->errors = array(
				'error' => 'Could not find number of likes for specified idea.'
			);
			return false;
		
		}

	}

	/**
	 * Determines whether a particular user has liked an idea or not.
	 * Checks whether like record exists for the user.
	 * Run this before deciding to run up_one or down_one
	 * @param  Integer  $id        Idea id
	 * @param  Integer  $author_id User account id
	 * @return boolean
	 */
	public function has_liked($id, $author_id){

		$query = $this->db->get_where('likes', array('ideaId' => $id, 'authorId' => $author_id));

		if($query->num_rows() > 0){
			return true;
		}else{
			return false;
		}

	}

	/**
	 * Increments the like count for one idea
	 * @param  Integer $id        Idea id
	 * @param  Integer $author_id User account id
	 * @return String|Boolean     '+1' string if successful
	 */
	public function up_one($id, $author_id){

		if(!$this->validate_idea_author_ids($id, $author_id)){
			return false;
		}

		$this->db->trans_start();

		//insert a new like record
		$this->db->insert('likes', array(
			'ideaId'	=> $id,
			'authorId'	=> $author_id
		));

		//increase the like count for the idea
		//false third parameter prevents backticking the "likes+1" which is a "formula" not a "value"
		$this->db->set('likes', 'likes+1', false);
		$this->db->where('id', $id);
		$this->db->update('ideas');

		$this->db->trans_complete();

		if($this->db->trans_status() === FALSE){

			$msg = $this->db->error()['message'];
			$num = $this->db->error()['code'];
			$last_query = $this->db->last_query();
			
			log_message('error', 'Problem increasing like count by one: ' . $msg . ' (' . $num . '), using this query: "' . $last_query . '"');
			
			$this->errors = array(
				'system_error'	=> 'Problem increasing like count.',
			);
			
			return false;

		}

		return '1';

	}

	/**
	 * Decrements the like count for one idea
	 * @param  Integer $id        Idea id
	 * @param  Integer $author_id User account id
	 * @return String|Boolean     '-1' string if successful
	 */
	public function down_one($id, $author_id){

		if(!$this->validate_idea_author_ids($id, $author_id)){
			return false;
		}

		$this->db->trans_start();

		//delete like record
		$this->db->delete('likes', array('ideaId' => $id, 'authorId' => $author_id));

		//decrease the like count for the idea
		//false third parameter prevents backticking the likes-1 which is a "formula" not a "value"
		$this->db->set('likes', 'likes-1', false);
		$this->db->where('id', $id);
		$this->db->update('ideas');

		$this->db->trans_complete();

		if($this->db->trans_status() === FALSE){

			$msg = $this->db->error()['message'];
			$num = $this->db->error()['code'];
			$last_query = $this->db->last_query();
			
			log_message('error', 'Problem decreasing like count by one: ' . $msg . ' (' . $num . '), using this query: "' . $last_query . '"');
			
			$this->errors = array(
				'system_error'	=> 'Problem decreasing like count.',
			);
			
			return false;

		}

		return '-1';

	}

	/**
	 * Gets the error messages
	 * @return Array
	 */
	public function get_errors(){

		return $this->errors;

	}

	/**
	 * Validates whether both the idea id and author id are valid ids
	 * @param  Integer $id        Idea id
	 * @param  Integer $author_id User account id
	 * @return Boolean
	 */
	protected function validate_idea_author_ids($id, $author_id){

		//this relies on UserAccount from PolyAuth being setup, for now hardcoded true
		return true;
		/*

		$idea_query = $this->db->get_where('ideas', array('id' => $id));
		$author_query = $this->db->get_where('user_accounts', array('id' => $author_id));

		if($idea_query->num_rows() > 0 AND $author_query->num_rows() > 0){

			return true;

		}

		$this->errors = array(
			'validation_error'	=> 'Idea or author does not exist.'
		);

		return false;

		*/

	}

}