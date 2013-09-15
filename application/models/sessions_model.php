<?php

use PolyAuth\Exceptions\PolyAuthException;

class Sessions_model extends CI_Model{

	protected $sessions_manager;
	protected $rbac;
	protected $errors;

	public function __construct(){

		parent::__construct();

		$ioc = $this->config->item('ioc')
		;
		$this->sessions_manager = $ioc['PolyAuth\Sessions\UserSessions'];

		//start the session process
		$this->sessions_manager->start();

		$this->load->library('form_validation', false, 'validator');

	}

	public function create($input_data){

		$data = elements(array(
			'email',
			'password',
		), $input_data, null, true);

		$this->validator->set_data($data);

		$this->validator->set_rules(array(
			array(
				'field'	=> 'email',
				'label'	=> 'Description',
				'rules'	=> 'required|trim|valid_email|max_length[100]',
			),
			array(
				'field'	=> 'password',
				'label'	=> 'Password',
				'rules'	=> 'required|trim'
			),
		));

		if($this->validator->run() ==  false){

			$this->errors = array(
				'validation_error'	=> $this->validator->error_array()
			);
			return false;

		}

		//we use identity
		$data['identity'] = $data['email'];
		unset($data['email']);

		try{

			$query = $this->sessions_manager->login($data);
			$user = $this->sessions_manager->get_user();
			return $user['id'];

		}catch(PolyAuthException $e){

			var_dump($e);

			$this->errors = array(
				'validation_error'	=> $e->get_errors()
			);

			return false;

		}

	}

	public function read($id){

		//get the current session
		if($id == 0){

			try{

				$current_user = $this->sessions_manager->get_user();

				if($current_user){

					return $current_user['id'];

				}else{

					$this->errors = array(
						'error'	=> 'Current user is an anonymous user.'
					);
					return false;

				}

			}catch(PolyAuthException $e){

				var_dump($e);

				$this->errors = array(
					'validation_error'	=> $e->get_errors()
				);

				return false;

			}

		}

	}

	public function delete($id){

	}

	public function get_errors(){

		return $this->errors;

	}

}