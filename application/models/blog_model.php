<?php

use Michelf\MarkdownExtra;

class Blog_model extends CI_Model{

	protected $accounts_manager;
	protected $sessions_manager;
	protected $errors;
	protected $parser;

	public function __construct(){

		parent::__construct();
		
		$ioc = $this->config->item('ioc');
		$this->accounts_manager = $ioc['PolyAuth\Accounts\AccountsManager'];
		$this->sessions_manager = $ioc['PolyAuth\Sessions\UserSessions'];
		$this->sessions_manager->start();

		$this->parser = new MarkdownExtra;

		$this->load->library('form_validation', false, 'validator');

	}

	public function create($input_data){

		if(!$this->sessions_manager->authorized(false, 'admin')){
			$this->errors = array(
				'error'	=> 'Not authorised to create blog posts.'
			);
			return false;
		}

		$input_data['authorId'] = $this->sessions_manager->get_user()['id'];

		$data = elements(array(
			'title',
			'description',
			'authorId'
		), $input_data, null, true);

		$data['date'] = date('Y-m-d H:i:s');

		$this->validator->set_data($data);

		$this->validator->set_rules(array(
			array(
				'field'	=> 'title',
				'label'	=> 'Title',
				'rules'	=> 'required|htmlspecialchars|trim|min_length[2]|max_length[50]',
			),
			array(
				'field'	=> 'description',
				'label'	=> 'Description',
				'rules'	=> 'required|htmlspecialchars|trim',
			),
			array(
				'field'	=> 'authorId',
				'label'	=> 'Author ID',
				'rules'	=> 'required|numeric'
			)
		));

		if($this->validator->run() ==  false){

			$this->errors = array(
				'validation_error'	=> $this->validator->error_array()
			);
			return false;

		}

		$query = $this->db->insert('blog', $data);

		if(!$query){

			$msg = $this->db->error()['message'];
			$num = $this->db->error()['code'];
			$last_query = $this->db->last_query();

			log_message('error', 'Problem inserting to blog table: ' . $msg . ' (' . $num . '), using this query: "' . $last_query . '"');

			$this->errors = array(
				'system_error'	=> 'Problem inserting data to blog table.',
			);

			return false;

		}

		return $this->db->insert_id();

	}

	public function read($id){

		$query = $this->db->get_where('blog', array('id' => $id));

		if($query->num_rows() > 0){
			
			$row = $query->row();

			$author = $this->accounts_manager->get_user($row->authorId);
			$author_name = $author['username'];
			$author_url = url_title($author['username'], '_', true);

			$data = array(
				'id'					=> $row->id,
				'title'					=> $row->title,
				'titleUrl'				=> url_title($row->title, '_', true),
				'description'			=> $row->description,
				'descriptionParsed'		=> $this->parse_markdown($row->description),
				'authorId'				=> $row->authorId,
				'authorUrl'				=> $author_url,
				'author'				=> $author_name,
				'date'					=> $row->date,
			);

			return $data;
			
		}else{
		
			$this->errors = array(
				'error' => 'Could not find specified blog post.'
			);
			return false;
		
		}

	}

	public function read_all($limit = false, $offset = false){

		$limit = ($limit) ? (int) $limit : 20;
		$offset = ($offset) ? (int) $offset : 0;

		$this->db->select('*');
		$this->db->from('blog');
		$this->db->order_by('date', 'desc');
		$this->db->limit($limit, $offset);

		$query = $this->db->get();

		if($query->num_rows() > 0){

			foreach($query->result() as $row){

				$author = $this->accounts_manager->get_user($row->authorId);
				$author_name = $author['username'];
				$author_url = url_title($author['username'], '_', true);

				$data[] = array(
					'id'					=> $row->id,
					'title'					=> $row->title,
					'titleUrl'				=> url_title($row->title, '_', true),
					'description'			=> $row->description,
					'descriptionParsed'		=> $this->parse_markdown($row->description),
					'authorId'				=> $row->authorId,
					'authorUrl'				=> $author_url,
					'author'				=> $author_name,
					'date'					=> $row->date,
				);

			}

			return $data;

		}else{

			$this->errors = array(
				'error' => 'No more blog posts to load!'
			);
			
			return false;

		}

	}

	public function update($id, $input_data){

		if(!$this->sessions_manager->authorized(false, 'admin')){
			$this->errors = array(
				'error'	=> 'Not authorised to update blog posts.'
			);
			return false;
		}

		$data = elements(array(
			'title',
			'description',
		), $input_data, null, true);

		$this->validator->set_data($data);

		$this->validator->set_rules(array(
			array(
				'field'	=> 'title',
				'label'	=> 'Title',
				'rules'	=> 'htmlspecialchars|trim|min_length[2]|max_length[50]',
			),
			array(
				'field'	=> 'description',
				'label'	=> 'Description',
				'rules'	=> 'htmlspecialchars|trim',
			),
		));

		if($this->validator->run() ==  false){

			$this->errors = array(
				'validation_error'	=> $this->validator->error_array()
			);
			return false;

		}

		$this->db->where('id', $id);
		$this->db->update('blog', $data);

		if($this->db->affected_rows() > 0){
		
			return true;
		
		}else{
			
			$this->errors = array(
				'error'	=> 'Blog post doesn\'t need to update.',
			);
			return false;
		
		}

	}

	public function delete($id){

		if(!$this->sessions_manager->authorized(false, 'admin')){
			$this->errors = array(
				'error'	=> 'Not authorised to delete blog posts.'
			);
			return false;
		}

		$query = $this->db->delete('blog', array('id' => $id));

		if($this->db->affected_rows() > 0){
		
			return true;
			
		}else{
		
			$this->errors = array(
				'error'	=> 'Nothing to delete.',
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
	 * @param  String $text Markdown String from the database
	 * @return String       Processed output
	 */
	protected function parse_markdown($text){

		$this->parser->no_markup = true;

		$html = $this->parser->transform($text);

		return $html;

	}

}