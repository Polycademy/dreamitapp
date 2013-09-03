<?php

use Michelf\MarkdownExtra;

class Ideas_model extends CI_Model{

	protected $parser;
	protected $errors;

	public function __construct(){

		parent::__construct();

		$this->parser = new MarkdownExtra;

		//use set_data and reset_validation (test it out)
		$this->load->library('form_validation', false, 'validator');

	}

	public function create($data){

		$data['date'] = date('Y-m-d H:i:s');

		$query = $this->db->insert('ideas', $data);

		if(!$query){

			$msg = $this->db->_error_message();
			$num = $this->db->_error_number();
			$last_query = $this->db->last_query();
			
			log_message('error', 'Problem inserting to ideas table: ' . $msg . ' (' . $num . '), using this query: "' . $last_query . '"');
			
			$this->errors = array(
				'system_error'	=> 'Problem inserting data to ideas table.',
			);
			
			return false;

		}

		return $this->db->insert_id();

	}

	public function read($id){

		$query = $this->db->get_where('ideas', array('id' => $id));

		if($query->num_rows() > 0){
			
			$row = $query->row();

			//get author information (currently hardcoded)
			$author = 'Roger Qiu';
			$author_url = 'roger_qiu';
			$author_avatar = 'http://gravatar.com/avatar/' . md5(trim('roger.qiu@polycademy.com'));
			$author_type = 'Developer';
			$author_profile_links = array('http://polycademy.com');

			$tags = array();
			$this->db->select('tag')->where('ideaId', $id)->from('tags');
			$tag_query = $this->db->get();
			if($tag_query->num_rows() > 0){
				foreach($tag_query->result() as $tag_row){
					$tags[] = $tag_row->tag;
				}
			}

			$data = array(
				'id'					=> $id,
				'title'					=> $row->title,
				'titleUrl'				=> url_title($row->title, '_', true),
				'image'					=> $row->image,
				'description'			=> $row->description,
				'descriptionParsed'		=> $this->parse_markdown($row->description),
				'descriptionShort'		=> $row->descriptionShort,
				'authorId'				=> $row->authorId,
				'authorUrl'				=> $author_url,
				'author'				=> $author,
				'authorAvatar'			=> $author_avatar,
				'authorType'			=> $author_type,
				'authorProfileLinks'	=> $author_profile_links,
				'likes'					=> $row->likes,
				'tags'					=> $tags,
				'date'					=> $row->date,
			);
			return $data;
			
		}else{
		
			$this->errors = array(
				'error' => 'Could not find specified idea.'
			);
			return false;
		
		}

	}

	public function read_all($limit = false, $offset = false, $tags = false, $author = false, $popular = false){

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

		//search full text on description AND search "like" on the title
		$search_subquery = '';
		if(is_array($tags)){
			$this->db->select('i.*');
			$this->db->from('ideas AS i');
			$this->db->where('MATCH (`i`.`description`) AGAINST (' . $this->db->escape(implode(' ', $tags)) . ')', null, false);
			$this->db->or_like('i.title', implode(' ', $tags));
			$search_subquery = $this->db->get_compiled_select();
		}

		//optional author filter
		$author_filter = ' WHERE `authorId` = ' . $this->db->escape_str($author);

		//popular sorting, date sorting and limits for pagination
		$sort = ' ORDER BY';
		$popular_sort = ' `likes` DESC';
		$date_sort = ' `date` DESC';
		$limit_sort = ' LIMIT ?, ?';

		//popular sorting takes precedence over date sorting
		if($popular){
			$sort .= $popular_sort . ',';
		}
		$sort .= $date_sort;
		$sort .= $limit_sort;

		//union automatically makes the results are distinct
		if(empty($search_subquery)){
			$query = $tag_subquery;
			if(is_numeric($author)){
				$query .= $author_filter;
			}
			$query .= $sort;
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
			$query .= $sort;
		}

		$query = $this->db->query($query, array($offset, $limit));

		if($query->num_rows() > 0){
		
			foreach($query->result() as $row){

				$idea_id = $row->id;
				$author_id = $row->authorId;

				//get author information (currently hardcoded)
				$author = 'Roger Qiu';
				$author_url = 'roger_qiu1';
				$author_avatar = 'http://gravatar.com/avatar/' . md5(trim('roger.qiu@polycademy.com')) . '?s=184&d=mm';
				$author_type = 'Developer';
				$author_profile_links = array('http://polycademy.com');

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
					'id'					=> $row->id,
					'title'					=> $row->title,
					'titleUrl'				=> url_title($row->title, '_', true),
					'image'					=> $row->image,
					'description'			=> $row->description,
					'descriptionParsed'		=> $this->parse_markdown($row->description),
					'descriptionShort'		=> $row->descriptionShort,
					'authorId'				=> $author_id,
					'authorUrl'				=> $author_url,
					'author'				=> $author,
					'authorAvatar'			=> $author_avatar,
					'authorType'			=> $author_type,
					'authorProfileLinks'	=> $author_profile_links,
					'likes'					=> $row->likes,
					'tags'					=> $tags,
					'date'					=> $row->date,
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

		$this->db->where('id', $id);
		$this->db->update('ideas', $data);

		if($this->db->affected_rows() > 0){
		
			return true;
		
		}else{
			
			$this->errors = array(
				'error'	=> 'Idea doesn\'t need to update.',
			);

            return false;
		
		}

	}

	public function delete($id){

		$this->db->where('id', $id);
		$this->db->delete('ideas'); 

		if($this->db->affected_rows() > 0){
		
			return true;
		
		}else{
			
			$this->errors = array(
				'error'	=> 'No idea to delete.',
			);

            return false;
		
		}

	}

	public function get_errors(){

		return $this->errors;

	}

	/**
	 * Parse Markdown Description.
	 * Markdown will be stored in the database to allow easy editing.
	 * The resulting output will be xss cleaned.
	 * @param  String $text Markdown String from the database
	 * @return String       Processed and XSS cleaned HTML
	 */
	protected function parse_markdown($text){

		$this->parser->no_markup = true;

		$html = $this->parser->transform($text);

		$html = $this->security->xss_clean($html);

		return $html;

	}

}