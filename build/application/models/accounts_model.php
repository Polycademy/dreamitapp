<?php

use PolyAuth\Exceptions\PolyAuthException;

class Accounts_model extends CI_Model{

	protected $accounts_manager;
	protected $sessions_manager;
	protected $rbac;
	protected $emailer;
	protected $errors;

	public function __construct(){

		parent::__construct();

		$ioc = $this->config->item('ioc');
		$this->accounts_manager = $ioc['PolyAuth\Accounts\AccountsManager'];
		$this->sessions_manager = $ioc['PolyAuth\Sessions\UserSessions'];
		$this->rbac = $ioc['PolyAuth\Accounts\Rbac'];
		$this->emailer = $ioc['PolyAuth\Emailer'];

		$this->load->library('form_validation', false, 'validator');

		//it is possible to catch PDOException and log those errors and return a system_error!

	}

	public function create($input_data){

		$data = elements(array(
			'username',
			'email',
			'password',
			'developer',
			'tac',
			'marketingDreamitapp',
			'marketingDeveloper',
			'marketingBeta',
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
				'rules'	=> 'trim|integer'
			),
			array(
				'field'	=> 'tac',
				'label'	=> 'Terms and Conditions',
				'rules'	=> 'required'
			),
			array(
				'field'	=> 'marketingDreamitapp',
				'label'	=> 'Agree to receive marketing emails from Dream it App',
				'rules'	=> 'trim|integer'
			),
			array(
				'field'	=> 'marketingDeveloper',
				'label'	=> 'Agree to receive marketing emails from participating developers',
				'rules'	=> 'trim|integer'
			),
			array(
				'field'	=> 'marketingBeta',
				'label'	=> 'Agree to being contacted by developers about beta testing applications',
				'rules'	=> 'trim|integer'
			),
		));

		if($this->validator->run() ==  false){

			$this->errors = array(
				'validation_error'	=> $this->validator->error_array()
			);
			return false;

		}

		if(!preg_match('/[0-1]/', $data['developer'])){

			$this->errors = array(
				'validation_error'	=> array(
					'developer'	=> 'The Developer field should be either (integer) 1 or 0.'
				)
			);
			return false;

		}

		//tac won't be sent to the user_accounts table
		unset($data['tac']);

		try{

			//if developer, we need activation approval
			if(isset($data['developer']) AND $data['developer'] == true){

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

		try{

			$user = $this->accounts_manager->get_user($id);

			$data = $user->get_user_data();

			if($user->has_role('admin')){
				$data['type'] = 'Site Administrator';
			}elseif($user->has_role('developer')){
				$data['type'] = 'Developer';
			}else{
				$data['type'] = 'Member';
			}

			$data['usernameUrl'] = url_title($data['username'], '_', true);
			$data['avatar'] = 'http://gravatar.com/avatar/' . md5(trim($data['email']));

			//if not admin and not the same identity
			if(!$this->sessions_manager->authorized(false, 'admin') AND !$this->sessions_manager->authorized(false, false, $user['email'])){
				unset($data['email']);
				unset($data['phone']);
			}

			return $data;

		}catch(PolyAuthException $e){

			$this->errors = array(
				'error'	=> implode($e->get_errors())
			);

			return false;

		}

	}

	public function update($id, $input_data){

		//POLYAUTH REQUIRED to check if the user is logged in and owns this resource

		$data = elements(array(
			'username',
			'email',
			'password',
			'passwordConfirm',
			'phone',
			'operatingSystem',
			'age',
			'gender',
		), $input_data, null, true);

		$this->validator->set_data($data);

		$this->validator->set_rules(array(
			array(
				'field'	=> 'username',
				'label'	=> 'Username',
				'rules'	=> 'htmlspecialchars|trim|min_length[2]|max_length[100]',
			),
			array(
				'field'	=> 'email',
				'label'	=> 'Description',
				'rules'	=> 'trim|valid_email|max_length[100]',
			),
			array(
				'field'	=> 'password',
				'label'	=> 'Password',
				'rules'	=> 'trim'
			),
			array(
				'field'	=> 'passwordConfirm',
				'label'	=> 'Password Confirm',
				'rules'	=> 'trim|matches[password]'
			),
			array(
				'field'	=> 'phone',
				'label'	=> 'Phone',
				'rules'	=> 'trim|numeric|max_length[40]'
			),
			array(
				'field'	=> 'operatingSystem',
				'label'	=> 'Operating System',
				'rules'	=> 'trim|htmlspecialchars|max_length[40]'
			),
			array(
				'field'	=> 'age',
				'label'	=> 'Age',
				'rules'	=> 'trim|integer|max_length[3]'
			),
			array(
				'field'	=> 'gender',
				'label'	=> 'Gender',
				'rules'	=> 'trim|htmlspecialchars|max_length[10]'
			)
		));

		if($this->validator->run() ==  false){

			$this->errors = array(
				'validation_error'	=> $this->validator->error_array()
			);
			return false;

		}

		//password is a special case, sometimes an empty string password & passwordConfirm will be passed in
		//this will then update the password to an empty password, thus triggering password complexity errors
		//if the password is empty, we're not updating anything!
		//note that this happens with AngularJS's ng-model when the field is filled and then backspaced!
		if(empty($data['password'])){
			unset($data['password']);
		}

		//no need for passwordConfirm in the db
		unset($data['passwordConfirm']);

		try{

			$user = $this->accounts_manager->get_user($id);

			//password changing is handled by the library
			$query = $this->accounts_manager->update_user($user, $data);

			if($query){

				return $id;

			}else{

				$this->errors = array(
					'error'	=> 'Nothing to update'
				);
				return false;

			}

		}catch(PolyAuthException $e){

			$this->errors = array(
				'validation_error'	=> $e->get_errors()
			);

			return false;

		}

	}

	public function delete($id){

		//POLYAUTH REQUIRED to check if the user is logged in and owns this resource
		try{

			$user = $this->accounts_manager->get_user($id);
			$query = $this->accounts_manager->deregister($user);
			
			if($query){

				return true;

			}else{

				$this->errors = array(
					'error'	=> 'Nothing to delete.',
				);
				return false;

			}

		}catch(PolyAuthException $e){

			$this->errors = array(
				'error'	=> implode($e->get_errors())
			);

			return false;

		}

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

	public function send_forgotten_password_confirmation($identifier){

		try{

			$user = $this->accounts_manager->get_user(false, $identifier);

			$this->accounts_manager->forgotten_password($user);

			return true;

		}catch(PolyAuthException $e){

			$this->errors = array(
				'error'	=> $e->get_error_string()
			);

			return false;

		}

	}

	public function confirm_forgotten_password($input_data){

		$data = elements(array(
			'userId',
			'forgottenCode',
			'newPassword',
			'newPasswordConfirm',
		), $input_data, null, true);

		$this->validator->set_data($data);

		$this->validator->set_rules(array(
			array(
				'field'	=> 'userId',
				'label'	=> 'User ID',
				'rules'	=> 'required|integer',
			),
			array(
				'field'	=> 'forgottenCode',
				'label'	=> 'Forgotten Code',
				'rules'	=> 'required',
			),
			array(
				'field'	=> 'newPassword',
				'label'	=> 'New Password',
				'rules'	=> 'required'
			),
			array(
				'field'	=> 'newPasswordConfirm',
				'label'	=> 'New Password Confirm',
				'rules'	=> 'required|matches[newPassword]'
			),
		));

		$validation_errors = [];

		if(!isset($data['userId'])){
			$validation_errors['userId'] = 'User ID is necessary.';
		}

		if(!isset($data['forgottenCode'])){
			$validation_errors['forgottenCode'] = 'Forgotten code is necessary.';
		}

		if(!isset($data['newPassword'])){
			$validation_errors['newPassword'] = 'New Password is necessary.';
		}

		if(!isset($data['newPasswordConfirm'])){
			$validation_errors['newPasswordConfirm'] = 'New Password Confirm is necessary.';
		}

		if($this->validator->run() ==  false){
			$validation_errors = array_merge($validation_errors, $this->validator->error_array());
		}

		if(!empty($validation_errors)){

			$this->errors = array(
				'validation_error'	=> $validation_errors
			);
			return false;

		}

		//lets get the user
		try{

			$user = $this->accounts_manager->get_user($data['userId']);

			$forgotten_check = $this->accounts_manager->forgotten_check($user, $data['forgottenCode']);

			if($forgotten_check){

				if($this->accounts_manager->forgotten_complete($user, $data['newPassword'])){

					return $data['userId'];

				}else{

					$this->errors = array(
						'system_error'	=> 'Unable to reset password, try again.'
					);
					return false;

				}

			}else{

				$this->errors = array(
					'error'	=> 'Forgotten code has expired or never existed. You need to resend a forgotten email.',
				);
				return false;

			}

		}catch(PolyAuthException $e){

			$this->errors = array(
				'validation_error'	=> $e->get_errors()
			);
			return false;

		}

	}

	public function get_errors(){

		return $this->errors;

	}

}