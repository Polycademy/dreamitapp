<?php

class Comments_model extends CI_Model{

	protected $errors;

	public function __construct(){

		parent::__construct();
		$this->load->library('form_validation', false, 'validator');

	}

	public function create($input_data){

	}

	public function read($id){


	}

	public function read_all($limit = false, $offset = false){

		$limit = ($limit) ? (int) $limit : 20;
		$offset = ($offset) ? (int) $offset : 0;

	}

	public function delete($id){


	}

	public function get_errors(){

		return $this->errors;

	}

}