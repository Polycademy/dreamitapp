<?php

class Like_model extends CI_Model{

	public function __construct(){
		parent::__construct();
	}

	public function read($id){

		$this->db->select('likes');
		$this->db->where('id', $id);
		$this->db->get('ideas');

		if($query->num_rows() > 0){
			
			$row = $query->row();

			$data = array(
				'id'		=> $id,
				'likes'		=> $row->likes
			);

			return $data;
			
		}else{
		
			$this->errors = array(
				'error' => 'Could not find number of likes for specified idea.'
			);
			return false;
		
		}

	}

	public function up_one($id, $author_id){

		//this needs to do 2 things.
		//First add a record to the likes table (only if a record doesnt exist)
		//if it already exists, we dont do anything
		//Second update the likes


	}

	public function down_one($id, $author_id){

		//remove a record (if it exists) on the likes table
		//only if did exist, do we minus a like
		//minus 1 on the likes


	}

}