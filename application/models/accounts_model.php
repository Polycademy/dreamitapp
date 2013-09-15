<?php

use PolyAuth\Exceptions\PolyAuthException;

class Accounts_model extends CI_Model{

	protected $accounts_manager;
	protected $rbac;
	protected $emailer;
	protected $errors;

	public function __construct(){

		parent::__construct();

		$ioc = $this->config->item('ioc');
		$this->accounts_manager = $ioc['PolyAuth\Accounts\AccountsManager'];
		$this->rbac = $ioc['PolyAuth\Accounts\Rbac'];
		$this->emailer = $ioc['PolyAuth\Emailer'];

		$this->load->library('form_validation', false, 'validator');

	}

	public function create($input_data){

		$data = elements(array(
			'username',
			'email',
			'password',
			'developer',
		), $input_data, null, true);

		$this->validator->set_data($data);

		$this->validator->set_rules(array(
			array(
				'field'	=> 'username',
				'label'	=> 'Username',
				'rules'	=> 'required|htmlspecialchars|trim|min_length[2]|max_length[100]',
			),
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
			array(
				'field'	=> 'developer',
				'label'	=> 'Developer',
				'rules'	=> 'trim'
			)
		));

		if($this->validator->run() ==  false){

			$this->errors = array(
				'validation_error'	=> $this->validator->error_array()
			);
			return false;

		}

		if(!preg_match('/true|false/', $data['developer'])){

			$this->errors = array(
				'validation_error'	=> array(
					'developer'	=> 'The Developer field should be either (string) true or false.'
				)
			);
			return false;

		}

		try{

			//if developer, we need activation approval
			if(isset($data['developer']) AND $data['developer'] == 'true'){

				$user = $this->accounts_manager->register($data);

				//add in developer role
				$this->rbac->register_user_roles($user, array('developer'));

				//activate manually, as this is sent for approval
				$activation_link = base_url() . "api/accounts/activate?activate={$user['activationCode']}&user={$user['id']}";

				$email_data = array(
					'username'	=> $user['username'],
					'email'		=> $user['email'],
					'activation_link'	=> $activation_link,
				);
				$email_template = $this->load->view('emails/developer_activation_email', $email_data, true);
				$this->emailer->send_mail(
					$this->config->item('sitemeta')['developer_email'], 
					'Dream it App Notifications',
					$email_template
				);

			}else{

				$user = $this->accounts_manager->register($data, true);

			}

			return $user['id'];

		}catch(PolyAuthException $e){

			$this->errors = array(
				'validation_error'	=> $e->get_errors()
			);

			return false;

		}

	}

	public function read($id){

	}

	public function read_all($limit = false, $offset = false){

	}

	public function update($id, $input_data){


	}

	public function delete($id){

	}

	public function activate($user_id, $activation_code){

		$user = $this->accounts_manager->get_user($user_id);

		$query = $this->accounts_manager->activate($user, $activation_code);

		if(!$query){

			$this->errors = array(
				'error' => 'Activation code is incorrect.'
			);
			return false;

		}

		return true;

	}

	public function get_errors(){

		return $this->errors;

	}

}