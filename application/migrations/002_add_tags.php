<?php defined('BASEPATH') OR exit('No direct script access allowed');

class Migration_add_tags extends CI_Migration {

	public function up(){
	
		$this->dbforge->add_field('id');
		
		$this->dbforge->add_field(array(
			'ideaId' => array(
				'type' 			=> 'INT',
			),
			'tag' => array(
				'type'			=> 'VARCHAR',
				'constraint'	=> 60
			),
		));
		
		$this->dbforge->create_table('tags');

	}

	public function down(){
	
		$this->dbforge->drop_table('tags');
	
	}
}