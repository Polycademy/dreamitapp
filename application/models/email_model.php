<?php

class Email_model extends CI_Model{

	protected $errors;
	protected $mailer;

	public function __construct(){

		parent::__construct();

		$this->mailer = new \PHPMailer;
		$this->load->library('form_validation', false, 'validator');

	}

	protected function send_email($to, $from, $reply_to, $message, $html){

		$this->mailer->IsSMTP();
		$this->mailer->Host = 'smtp.mandrillapp.com';
		$this->mailer->Port = 587;
		$this->mailer->SMTPAuth = true;
		$this->mailer->Username = $_ENV['secrets']['mandrill_user'];
		$this->mailer->Password = $_ENV['secrets']['mandrill_key'];
		$this->mailer->SMTPSecure = 'tls';

		$this->mailer->From = $from;
		$this->mailer->FromName = 'Dream it App Notifications';
		$this->mailer->addReplyTo($reply_to);
		$this->mailer->AddAddress($to);

		$this->mailer->Subject = 'Message from Dream it App Notifications';
		$this->mailer->Body = $message;
		$this->mailer->isHTML($html);

		if(!$this->mailer->Send()) {
			return false;
		}

		return true;

	}

	public function send_enquiry($input_data){

		$data = elements(array(
			'toEmail',
			'fromEmail',
			'replyTo',
			'message'
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
				'field'	=> 'replyTo',
				'label'	=> 'Reply To Email',
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

		$query = $this->send_email($data['toEmail'], $data['fromEmail'], $data['replyTo'], $data['message'], false);

		if(!$query){

			$this->errors = array(
				'error'	=> 'Problem sending email. Try again.'
			);

			log_message('error', 'Mailer Error: ' . $this->mailer->ErrorInfo);

			return false;

		}

		return true;

	}

	public function send_developer_contact($input_data){

		$data = elements(array(
			'toEmail',
			'fromEmail',
			'replyTo',
			'message',
			'authorName',
			'senderName',
			'ideaId',
			'ideaUrl',
			'ideaTitle',
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
				'field'	=> 'replyTo',
				'label'	=> 'Reply To Email',
				'rules'	=> 'required|trim|valid_email',
			),
			array(
				'field'	=> 'message',
				'label'	=> 'Message',
				'rules'	=> 'required|htmlspecialchars|trim|min_length[100]|max_length[13500]'
			),
			array(
				'field'	=> 'authorName',
				'label'	=> 'Author Name',
				'rules'	=> 'required|trim|htmlspecialchars',
			),
			array(
				'field'	=> 'senderName',
				'label'	=> 'Sender Name',
				'rules'	=> 'required|trim|htmlspecialchars',
			),
			array(
				'field'	=> 'ideaId',
				'label'	=> 'Idea ID',
				'rules'	=> 'required|numeric',
			),
			array(
				'field'	=> 'ideaUrl',
				'label'	=> 'Idea URL',
				'rules'	=> 'required|alpha_dash',
			),
			array(
				'field'	=> 'ideaTitle',
				'label'	=> 'Idea Title',
				'rules'	=> 'required|trim|htmlspecialchars',
			),
		));

		if($this->validator->run() ==  false){

			$this->errors = array(
				'validation_error'	=> $this->validator->error_array()
			);

			return false;

		}

		$message = $this->load->view('emails/developer_contact_email', $data, true);

		$query = $this->send_email($data['toEmail'], $data['fromEmail'], $data['replyTo'], $message, true);

		if(!$query){

			$this->errors = array(
				'error'	=> 'Problem sending email. Try again.'
			);

			log_message('error', 'Mailer Error: ' . $this->mailer->ErrorInfo);

			return false;

		}

		return true;

	}

	public function get_errors(){

		return $this->errors;

	}

}