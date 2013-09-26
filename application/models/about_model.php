<?php

class About_model extends CI_Model{

	protected $sessions_manager;
	protected $errors;

	public function __construct(){

		parent::__construct();
		
		$ioc = $this->config->item('ioc');
		$this->sessions_manager = $ioc['PolyAuth\Sessions\UserSessions'];
		$this->sessions_manager->start();

		$this->load->library('form_validation', false, 'validator');

	}

	public function read(){

		$query = $this->db->get('about');

		if($query->num_rows() > 0){
			
			$row = $query->row();

			$data = array(
				'content'					=> $row->content,
			);

			return $data;
			
		}else{
		
			$this->errors = array(
				'error' => 'Could not find about content.'
			);
			return false;
		
		}

	}

	public function update($id, $input_data){

		if(!$this->sessions_manager->authorized(false, 'admin')){
			$this->errors = array(
				'error'	=> 'Not authorised to update about posts.'
			);
			return false;
		}

		$data = elements(array(
			'content',
		), $input_data, null, true);

		$this->validator->set_data($data);

		$this->validator->set_rules(array(
			array(
				'field'	=> 'content',
				'label'	=> 'Content',
				'rules'	=> 'required',
			),
		));

		if($this->validator->run() ==  false){

			$this->errors = array(
				'validation_error'	=> $this->validator->error_array()
			);
			return false;

		}

		$this->db->update('about', $data);

		if($this->db->affected_rows() > 0){
		
			return true;
		
		}else{
			
			$this->errors = array(
				'error'	=> 'About doesn\'t need to update.',
			);
			return false;
		
		}

	}

	public function get_errors(){

		return $this->errors;

	}

}