<?php

class Email_model extends CI_Model{

	protected $errors;
	protected $mailer;

	public function __construct(){

		parent::__construct();

		$this->mailer = new \PHPMailer;

		$this->load->library('form_validation', false, 'validator');

	}

	public function send($input_data){

		$data = elements(array(
			'toEmail',
			'fromEmail',
			'message',
		), $input_data, null, true);

		$this->validator->set_data($data);

		$this->validator->set_rules(array(
			array(
				'field'	=> 'toEmail',
				'label'	=> 'To Email',
				'rules'	=> 'required|trim|valid_email',
			),
			array(
				'field'	=> 'fromEmail',
				'label'	=> 'From Email',
				'rules'	=> 'required|trim|valid_email',
			),
			array(
				'field'	=> 'message',
				'label'	=> 'Message',
				'rules'	=> 'required|htmlspecialchars|trim|min_length[16]|max_length[13500]'
			),
		));

		if($this->validator->run() ==  false){

			$this->errors = array(
				'validation_error'	=> $this->validator->error_array()
			);
			return false;

		}

		$this->mailer->IsSMTP();
		$this->mailer->Host = 'smtp.mandrillapp.com';
		$this->mailer->Port = 587;
		$this->mailer->SMTPAuth = true;
		$this->mailer->Username = $_ENV['secrets']['mandrill_user'];
		$this->mailer->Password = $_ENV['secrets']['mandrill_key'];
		$this->mailer->SMTPSecure = 'tls';

		$this->mailer->From = $data['fromEmail'];
		$this->mailer->FromName = 'Dream it App Notifications';
		$this->mailer->AddAddress($data['toEmail']);

		$this->mailer->Subject = 'Message from Dream it App Notifications';
		$this->mailer->Body = $data['message'];

		if(!$this->mailer->Send()) {

			$this->errors = array(
				'error'	=> 'Problem sending email. Try again.'
			);

			log_message('error', 'Mailer Error: ' . $mail->ErrorInfo);

			return false;

		}

		return true;

	}

	public function get_errors(){

		return $this->errors;

	}

}