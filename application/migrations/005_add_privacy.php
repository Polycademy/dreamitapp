<?php defined('BASEPATH') OR exit('No direct script access allowed');

class Migration_add_privacy extends CI_Migration {

	public function up(){
	
		$this->dbforge->add_column('ideas', array(
			'privacy'	=> array(
				'type'	=> 'INT',
			)
		));

	}

	public function down(){
	
		$this->dbforge->drop_column('ideas', 'privacy');
	
	}

}