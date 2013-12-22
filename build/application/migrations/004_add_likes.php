<?php defined('BASEPATH') OR exit('No direct script access allowed');

class Migration_add_likes extends CI_Migration {

	public function up(){
	
		$this->dbforge->add_field('id');
		
		$this->dbforge->add_field(array(
			'ideaId' => array(
				'type' 			=> 'INT',
			),
			'authorId' => array(
				'type'			=> 'INT',
			),
		));
		
		$this->dbforge->create_table('likes');

	}

	public function down(){
	
		$this->dbforge->drop_table('likes');
	
	}
}