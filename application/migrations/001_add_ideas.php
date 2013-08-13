<?php defined('BASEPATH') OR exit('No direct script access allowed');

class Migration_add_ideas extends CI_Migration {

	public function up(){
	
		$this->dbforge->add_field('id');
		
		$this->dbforge->add_field(array(
			'title' => array(
				'type' 			=> 'VARCHAR',
				'constraint'	=> 50,
			),
			'link' => array(
				'type'			=> 'VARCHAR',
				'constraint'	=> 80,
			),
			'image' => array(
				'type'			=> 'TEXT',
			),
			'description' => array(
				'type'			=> 'TEXT',
			),
			'authorId' => array(	//linked to user accounts table
				'type'			=> 'INT',
			),
			'likes'	=> array(
				'type'			=> 'INT',
			),
			'date' => array(
				'type'			=> 'DATETIME'
			)
		));
		
		$this->dbforge->create_table('ideas');

		$this->db->query('ALTER TABLE `ideas` ADD FULLTEXT (`description`)');

	}

	public function down(){
	
		$this->dbforge->drop_table('ideas');
	
	}
}