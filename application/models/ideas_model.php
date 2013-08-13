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

	public function read_all($limit = false, $offset = false, $tags = false, $author = false){

		$limit = ($limit) ? $limit : 20;
		
		//we're trying to get all the ideas, and if there are tags passed in, get only ideas which has one or more of the tags passed in
		//we can either use a distinct join or use an IN subquery (semi join)
		//see http://stackoverflow.com/q/9105427/582917
		$this->db->select('i.*');
		$this->db->distinct();
		$this->db->from('ideas AS i');
		if(is_array($tags)){
			$this->db->join('tags AS t', 't.ideaId = i.id');
			$this->db->where_in('t.tag', $tags);
		}
		if(is_integer($author)){
			$this->db->where('authorId', $author);
		}
		$this->db->limit($limit, $offset);
		$this->db->order_by('date', 'desc');
		$query = $this->db->get();

		if($query->num_rows() > 0){
		
			foreach($query->result() as $row){

				// FB::log($row);

				$idea_id = $row->id;
				$author_id = $row->authorId;

				//get author information (currently hardcoded)
				$author = 'Roger Qiu';
				$author_link = 'roger_qiu1';

				//tags for each idea
				$tags = array();
				$this->db->select('tag')->where('ideaId', $idea_id)->from('tags');
				$tag_query = $this->db->get();
				if($tag_query->num_rows() > 0){
					foreach($tag_query->result() as $tag_row){
						$tags[] = $tag_row->tag;
					}
				}

				$data[] = array(
					'id'			=> $row->id,
					'title'			=> $row->title,
					'link'			=> $row->link,
					'image'			=> $row->image,
					'description'	=> $row->description,
					'authorId'		=> $author_id,
					'authorLink'	=> $author_link,
					'author'		=> $author,
					'likes'			=> $row->likes,
					'tags'			=> $tags,
				);
			
			}
			
			return $data;
		
		}else{
		
			$this->errors = array(
				'error' => 'No more ideas to load!'
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