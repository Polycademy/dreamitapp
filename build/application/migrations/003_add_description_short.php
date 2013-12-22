<?php defined('BASEPATH') OR exit('No direct script access allowed');

class Migration_add_description_short extends CI_Migration {

	public function up(){
	
		$this->dbforge->add_column('ideas', array(
			'descriptionShort'	=> array(
				'type'	=> 'TEXT',
			)
		));

	}

	public function down(){
	
		$this->dbforge->drop_column('ideas', 'descriptionShort');
	
	}

}