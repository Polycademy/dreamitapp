<?php defined('BASEPATH') OR exit('No direct script access allowed');

class Migration_add_comments extends CI_Migration {

	public function up(){
	
		$this->dbforge->add_field('id');
		
		$this->dbforge->add_field(array(
			'ideaId'	=> array(
				'type' 			=> 'INT',
			),
			'authorId'	=> array(
				'type'			=> 'INT',
			),
			'comment'	=> array(
				'type'			=> 'TEXT'
			),
			'date'		=> array(
				'type'			=> 'DATETIME'
			)
		));
		
		$this->dbforge->create_table('comments');

	}

	public function down(){
	
		$this->dbforge->drop_table('comments');
	
	}
}