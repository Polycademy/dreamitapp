<?php

class Ideas_model extends CI_Model{

	protected $errors;

	public function __construct(){

		parent::__construct();

		//use set_data and reset_validation (test it out)
		$this->load->library('form_validation', false, 'validator');

	}

	public function create($data){

	}

	public function read($id){

	}

	public function read_all($limit = false, $offset = false, $tags = false){

		$limit = ($limit) ? $limit : 20;
		
		$this->db->select('i.*');
		$this->db->from('ideas AS i');
		if(is_array($tags)){
			$this->db->join('tags AS t', 'i.id = t.ideaId');
			$this->db->or_where_in('t.tag', $tags);
		}
		$this->db->limit($limit, $offset);
		$query = $this->db->get();

		if($query->num_rows() > 0){
		
			foreach($query->result() as $row){

				$idea_id = $row->id;
				$author_id = $row->authorId;

				//get author information (currently hardcoded)
				$author = 'Roger Qiu';
				$author_link = 'roger_qiu1';
				
				//get number of feedback (currently hardcoded)
				$feedback = 32;

				//get an array of tags (currently hardcoded)
				$tags = array(
					'iphone',
					'ipad',
					'android',
					'programming',
				);

				$data[] = array(
					'id'			=> $row->id,
					'title'			=> $row->title,
					'link'			=> $row->link,
					'image'			=> $row->image,
					'description'	=> $row->description,
					'authorId'		=> $author_id,
					'authorLink'	=> $author_link;
					'author'		=> $author;
					'likes'			=> $row->likes,
					'feedback'		=> $feedback;
					'tags'			=> $tags,
				);
			
			}
			
			return $data;
		
		}else{
		
			$this->errors = array(
				'error' => 'No ideas found at all!'
			);
			
			return false;
		
		}

	}

	public function update($id, $data){

	}

	public function delete($id){

	}

	public function get_errors(){

		return $this->errors;

	}

}