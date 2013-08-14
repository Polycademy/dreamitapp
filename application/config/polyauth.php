<?php

//PolyAuth Options

$config['polyauth'] = array(
	'email'				=> true,
	'session_handler'	=> new PolyAuth\Sessions\EncryptedSessionHandler($this->config['encryption_key']),
);