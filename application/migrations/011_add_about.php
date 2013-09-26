<?php defined('BASEPATH') OR exit('No direct script access allowed');

class Migration_add_about extends CI_Migration {

	public function up(){
		
		$this->dbforge->add_field(array(
			'content' => array(
				'type' 			=> 'TEXT',
			),
		));
		
		$this->dbforge->create_table('about');

		$this->db->insert('about', array(
			'content'	=> '',
		));

	}

	public function down(){
	
		$this->dbforge->drop_table('about');
	
	}
}