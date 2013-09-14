<?php

class Accounts extends CI_Controller{

	protected $accounts_manager;

	public function __construct(){

		parent::__construct();

		$ioc = $this->config->item('ioc');
		$this->accounts_manager = $ioc['PolyAuth\Accounts\AccountsManager'];

	}

	public function index(){

		

	}
	
	public function show($id){
		
	}

	public function create(){

	}

	public function update($id){

	}

	public function delete($id){

	}

}