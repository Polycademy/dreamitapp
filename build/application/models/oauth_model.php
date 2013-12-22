<?php

use Guzzle\Http\Client;
use PolyAuth\Exceptions\PolyAuthException;

class Oauth_model extends CI_Model{

	protected $client;
	protected $accounts_manager;
	protected $sessions_manager;
	protected $errors;

	public function __construct(){

		parent::__construct();

		$ioc = $this->config->item('ioc');
		$this->accounts_manager = $ioc['PolyAuth\Accounts\AccountsManager'];
		$this->sessions_manager = $ioc['PolyAuth\Sessions\UserSessions'];

		$this->client = new Client('https://graph.facebook.com');

		$this->load->library('form_validation', false, 'validator');

	}

	//process always starts here...!
	public function create($input_data){

		$data = elements(array(
			'accessToken',
		), $input_data, null, true);

		$this->validator->set_data($data);

		$this->validator->set_rules(array(
			array(
				'field'	=> 'accessToken',
				'label'	=> 'Access Token',
				'rules'	=> 'required'
			),
		));

		if($this->validator->run() ==  false){

			$this->errors = array(
				'validation_error'	=> $this->validator->error_array()
			);
			return false;

		}

		//make sure to reset it, we're using it twice
		$this->validator->reset_validation();

		$request = $this->client->get('/me');
		$query_parameters = $request->getQuery();
		$query_parameters->set('access_token', $data['accessToken']);
		$response = $request->send();
		$returned_data = $response->json();

		$this->validator->set_data($returned_data);

		$this->validator->set_rules(array(
			array(
				'field'	=> 'email',
				'label'	=> 'Facebook Email',
				'rules'	=> 'required|valid_email'
			),
			array(
				'field'	=> 'username',
				'label'	=> 'Facebook Username',
				'rules'	=> 'required|htmlspecialchars|trim'
			),
		));

		if($this->validator->run() ==  false){

			$this->errors = array(
				'validation_error'	=> $this->validator->error_array()
			);
			return false;

		}

		$insert_data = array(
			'username'	=> $returned_data['name'],
			'email'		=> $returned_data['email']
		);

		//check if email already exists
		if($this->accounts_manager->duplicate_identity_check($insert_data['email'])){

			//sign in
			$this->sessions_manager->external_login($insert_data['email']);
			$user = $this->sessions_manager->get_user();
			return $user['id'];

		}else{

			//create account
			try{

				$user = $this->accounts_manager->external_register();
				$user = $this->accounts_manager->update_user($user, $insert_data);
				$this->sessions_manager->external_login($insert_data['email']);
				$user = $this->sessions_manager->get_user();
				return $user['id'];


			}catch(PolyAuthException $e){

				$this->errors = array(
					'validation_error'	=> $e->get_errors()
				);

				return false;
				
			}

		}

	}

	public function get_errors(){

		return $this->errors;

	}

}