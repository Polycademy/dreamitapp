<?php defined('BASEPATH') OR exit('No direct script access allowed');

class Migration_add_image_blob extends CI_Migration {

	public function up(){
	
		$this->dbforge->add_column('ideas', array(
			'imageBlob'	=> array(
				'type'	=> 'TEXT',
			)
		));

	}

	public function down(){
	
		$this->dbforge->drop_column('ideas', 'imageBlob');
	
	}

}