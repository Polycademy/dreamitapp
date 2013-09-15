<?php

//PolyAuth Options

$config['polyauth'] = array(
	'session_handler'	=> new PolyAuth\Sessions\EncryptedSessionHandler($this->config['encryption_key']),
	//EMAIL SETTINGS
	'email'					=> true,
	'email_smtp'			=> true,
	'email_host'			=> 'smtp.mandrillapp.com',
	'email_port'			=> '587',
	'email_auth'			=> true,
	'email_username'		=> $_ENV['secrets']['mandrill_user'],
	'email_password'		=> $_ENV['secrets']['mandrill_key'],
	'email_smtp_secure'		=> 'tls',
	'email_from'			=> $this->config['sitemeta']['email'],
	'email_from_name'		=> $this->config['sitemeta']['title'],
	'email_html'			=> true,
	//LOGIN SETTINGS
	'login_identity'		=> 'email',
	//REGISTRATION SETTINGS
	'reg_activation'		=> 'manual',
	//EXTERNAL PROVIDER SETTINGS
	'external_providers'	=> array(
		'facebook'	=> array(
			'key'			=> $_ENV['secrets']['facebook_id'],
			'secret'		=> $_ENV['secrets']['facebook_token'],
			'scope'			=> array('email'),
			'callback_url'	=> 'http://dreamitapp.com/signin', //change this to http://dreamitapp.com/signin in production
			'identifier'	=> array(
				'api'	=> 'me',
				'key'	=> 'email',
				'type'	=> 'email',
			)
		)
	)
);