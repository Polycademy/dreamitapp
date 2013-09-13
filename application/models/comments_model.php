<?php

class Comments_model extends CI_Model{

	protected $errors;

	public function __construct(){

		parent::__construct();
		$this->load->library('form_validation', false, 'validator');

	}

	public function create($input_data){

		$data = elements(array(
			'ideaId',
			'authorId',
			'comment'
		), $input_data, null, true);

		$data['date'] = date('Y-m-d H:i:s');

		$this->validator->set_data($data);

		$this->validator->set_rules(array(
			array(
				'field'	=> 'ideaId',
				'label'	=> 'Idea ID',
				'rules'	=> 'required|numeric',
			),
			array(
				'field'	=> 'authorId',
				'label'	=> 'Author ID',
				'rules'	=> 'required|numeric'
			),
			array(
				'field'	=> 'comment',
				'label'	=> 'Comment',
				'rules'	=> 'required|htmlspecialchars|trim|min_length[10]|max_length[2000]',
			),
		));

		if($this->validator->run() ==  false){

			$this->errors = array(
				'validation_error'	=> $this->validator->error_array()
			);
			return false;

		}

		$query = $this->db->insert('comments', $data);

		if(!$query){

			$msg = $this->db->error()['message'];
			$num = $this->db->error()['code'];
			$last_query = $this->db->last_query();

			log_message('error', 'Problem inserting to comments table: ' . $msg . ' (' . $num . '), using this query: "' . $last_query . '"');

			$this->errors = array(
				'system_error'	=> 'Problem inserting data to comments table.',
			);

			return false;

		}

		return $this->db->insert_id();

	}

	public function read($id){

		$query = $this->db->get_where('comments', array('id' => $id));

		if($query->num_rows() > 0){
			
			$row = $query->row();

			//get author information (currently hardcoded)
			$author = 'Roger Qiu';
			$author_url = 'roger_qiu';
			$author_avatar = 'http://gravatar.com/avatar/' . md5(trim('roger.qiu@polycademy.com'));

			$data = array(
				'id'					=> $row->id,
				'ideaId'				=> $row->ideaId,
				'author'				=> $author,
				'authorId'				=> $row->authorId,
				'authorUrl'				=> $author_url,
				'authorAvatar'			=> $author_avatar,
				'comment'				=> $row->comment,
				'date'					=> $row->date,
			);

			return $data;
			
		}else{
		
			$this->errors = array(
				'error' => 'Could not find specified comment.'
			);
			return false;
		
		}

	}

	public function read_count($idea_id = false){

		$this->db->select('COUNT(id) AS commentsCount');
		if(is_numeric($idea_id)){
			$this->db->where('ideaId', $idea_id);
		}
		$this->db->from('comments');
		$query = $this->db->get();

		if($query->num_rows() > 0){

			$row = $query->row();

			$data = array(
				'count'	=> $row->commentsCount
			);

			return $data;

		}else{

			$this->errors = array(
				'error' => 'Could not find comments associated with the passed in Idea ID.'
			);
			return false;

		}

	}

	public function read_all($limit = false, $offset = false, $idea_id = false){

		$limit = ($limit) ? (int) $limit : 20;
		$offset = ($offset) ? (int) $offset : 0;

		$this->db->select('*');
		if(is_numeric($idea_id)){
			$this->db->where('ideaId', $idea_id);
		}
		$this->db->from('comments');
		$this->db->order_by('date', 'desc');
		$this->db->limit($limit, $offset);

		$query = $this->db->get();

		if($query->num_rows() > 0){

			foreach($query->result() as $row){

				$author = 'Roger Qiu';
				$author_url = 'roger_qiu';
				$author_avatar = 'http://gravatar.com/avatar/' . md5(trim('roger.qiu@polycademy.com'));

				$data[] = array(
					'id'					=> $row->id,
					'ideaId'				=> $row->ideaId,
					'author'				=> $author,
					'authorId'				=> $row->authorId,
					'authorUrl'				=> $author_url,
					'authorAvatar'			=> $author_avatar,
					'comment'				=> $row->comment,
					'date'					=> $row->date,
				);

			}

			return $data;

		}else{

			$this->errors = array(
				'error' => 'No more comments to load!'
			);
			
			return false;

		}

	}

	public function update($id, $input_data){

		$data = elements(array(
			'comment'
		), $input_data, null, true);

		$this->validator->set_data($data);

		$this->validator->set_rules(array(
			array(
				'field'	=> 'comment',
				'label'	=> 'Comment',
				'rules'	=> 'htmlspecialchars|trim|min_length[10]|max_length[2000]',
			),
		));

		if($this->validator->run() ==  false){

			$this->errors = array(
				'validation_error'	=> $this->validator->error_array()
			);
			return false;

		}

		$this->db->where('id', $id);
		$this->db->update('comments', $data);

		if($this->db->affected_rows() > 0){
		
			return true;
		
		}else{
			
			$this->errors = array(
				'error'	=> 'Comment doesn\'t need to update.',
			);
            return false;
		
		}

	}

	public function delete($id){

		$query = $this->db->delete('comments', array('id' => $id));

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

}