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

		//we need to validate data here!

		//typecast to help the binding
		$limit = ($limit) ? (int) $limit : 20;
		$offset = ($offset) ? (int) $offset : 0;

		//search tags
		$this->db->select('i.*');
		$this->db->distinct();
		$this->db->from('ideas AS i');
		if(is_array($tags)){
			$this->db->join('tags AS t', 't.ideaId = i.id');
			$this->db->where_in('t.tag', $tags);
		}
		$tag_subquery = $this->db->get_compiled_select();

		//optionally do a full text search on the description column and a like search on the title column
		$search_subquery = '';
		if(is_array($tags)){
			$this->db->select('i.*');
			$this->db->from('ideas AS i');
			$this->db->where('MATCH (`i`.`description`) AGAINST (' . $this->db->escape(implode(' ', $tags)) . ')', null, false);
			$this->db->or_like('i.title', implode($tags));
			$search_subquery = $this->db->get_compiled_select();
		}

		//author filter will be added in optionally
		$author_filter = ' WHERE `authorId` = ' . $this->db->escape_str($author);
		$limit_sort = ' ORDER BY `date` DESC' . ' LIMIT ?, ?';

		//union automatically makes the results are distinct
		if(empty($search_subquery)){
			$query = $tag_subquery;
			if(is_numeric($author)){
				$query .= $author_filter;
			}
			$query .= $limit_sort;
		}else{
			$query = "
				SELECT * FROM (
					($tag_subquery) 
					UNION 
					($search_subquery)
				) AS `u`
			";
			if(is_numeric($author)){
				$query .= $author_filter;
			}
			$query .= $limit_sort;
			//SELECT * FROM ((' . $tag_subquery . ') UNION (' . $search_subquery . ')' . $limit_sort;
		}

		FB::log($query);

		$query = $this->db->query($query, array($offset, $limit));

		FB::log($this->db->last_query());

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