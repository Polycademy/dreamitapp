<?php

class Facebook extends CI_Controller{

	public function __construct(){

		parent::__construct();

	}

	public function show(){

		echo '<script src="//connect.facebook.net/en_US/all.js"></script>';

	}

}