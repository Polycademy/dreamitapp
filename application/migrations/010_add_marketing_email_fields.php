<?php defined('BASEPATH') OR exit('No direct script access allowed');

class Migration_add_marketing_email_fields extends CI_Migration {

	public function up(){
	
		$this->dbforge->add_column('user_accounts', array(
			'marketingDreamitapp'	=> array(
				'type' => 'TINYINT',
				'constraint' => '1',
				'unsigned' => TRUE,
				'default' => 0,
			),
			'marketingDeveloper'	=> array(
				'type' => 'TINYINT',
				'constraint' => '1',
				'unsigned' => TRUE,
				'default' => 0,
			),
			'marketingBeta'			=> array(
				'type' => 'TINYINT',
				'constraint' => '1',
				'unsigned' => TRUE,
				'default' => 0,
			)
		));

	}

	public function down(){
	
		$this->dbforge->drop_column('ideas', 'marketingDreamitapp');
		$this->dbforge->drop_column('ideas', 'marketingDeveloper');
		$this->dbforge->drop_column('ideas', 'marketingBeta');
	
	}

}