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

		//$this->validator->set_data()
		//$this->validator->set_rules()
		//$this->validator->run()
		//$this->validator->error_array()
		//return false

		$mail->IsSMTP();
		$mail->Host = 'smtp.mandrillapp.com';
		$mail->Port = 587;
		$mail->SMTPAuth = true;
		$mail->Username = $_ENV['secrets']['mandrill_user'];
		$mail->Password = $_ENV['secrets']['mandrill_key'];
		$mail->SMTPSecure = 'tls';

		$mail->From = $data['fromEmail'];
		$mail->FromName = 'Dream it App Notifications';
		$mail->AddAddress($data['toEmail']);

		$mail->Subject = 'Message from Dream it App Notifications';
		$mail->Body = $data['message'];

		if(!$mail->Send()) {

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