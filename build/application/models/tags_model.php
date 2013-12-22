<?php

class Tags_model extends CI_Model{

	protected $errors;

	public function __construct(){

		parent::__construct();

	}

	public function read($id){

		$query = $this->db->get_where('tags', array('id' => $id));

		if($query->num_rows() > 0){
			
			$row = $query->row();

			$data = array(
				'id'		=> $row->id,
				'ideaId'	=> $row->ideaId,
				'tag'		=> $row->tag
			);

			return $data;
			
		}else{
		
			$this->errors = array(
				'error' => 'Could not find specified tag.'
			);
			return false;
		
		}

	}

	public function read_all($limit = false, $offset = false, $idea = false, $author = false, $popular = false, $trending = false){

		$limit = ($limit) ? (int) $limit : 20;
		$offset = ($offset) ? (int) $offset : 0;

		$this->db->select('t.*');
		$this->db->from('tags AS t');

		//filter by as specific idea id
		if($idea){
			$this->db->where('t.ideaId', $idea);
		}

		//popular ranking or author filtering needs to join with the author
		if($popular OR $author){
			$this->db->join('ideas AS i', 'i.id = t.ideaId'); //id of the `ideas` matches the ideaId of the `tags`
		}
		if($popular){	
			$this->db->order_by('i.likes', 'desc');
		}
		if($author){
			$this->db->where('i.authorId', $author);
		}

		//trending will select the most used (repeated) tags
		if($trending){
			$this->db->select('COUNT(t.tag) as tagCount');
			$this->db->group_by('t.tag');
			$this->db->order_by('tagCount', 'desc');
		}

		//this will implicitly get the most recent tags, since the tags table does not have a date column
		$this->db->order_by('t.id', 'desc');
		$this->db->limit($limit, $offset);

		$query = $this->db->get();

		if($query->num_rows() > 0){

			foreach($query->result() as $row){

				$data[] = array(
					'id'		=> $row->id,
					'ideaId'	=> $row->ideaId,
					'tag'		=> $row->tag
				);

			}

			return $data;

		}else{

			$this->errors = array(
				'error' => 'Could not find specified tags.'
			);
			return false;

		}

	}

	public function get_errors(){

		return $this->errors;

	}

}