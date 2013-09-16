<?php

use Michelf\MarkdownExtra;

class Ideas_model extends CI_Model{

	const PUBLIC_PRIVACY = 1;
	const DEVELOPERS_PRIVACY = 2;

	protected $accounts_manager;
	protected $sessions_manager;
	protected $parser;
	protected $errors;

	public function __construct(){

		parent::__construct();

		$ioc = $this->config->item('ioc');
		$this->accounts_manager = $ioc['PolyAuth\Accounts\AccountsManager'];
		$this->sessions_manager = $ioc['PolyAuth\Sessions\UserSessions'];
		$this->sessions_manager->start();

		$this->parser = new MarkdownExtra;

		$this->load->library('form_validation', false, 'validator');

	}

	public function create($input_data){

		if(!$this->sessions_manager->authorized()){
			$this->errors = array(
				'error'	=> 'Not authorised to create ideas.'
			);
			return false;
		}

		$input_data['authorId'] = $this->sessions_manager->get_user()['id'];

		$data = elements(array(
			'title',
			'image',
			'imageBlob',
			'description',
			'descriptionShort',
			'authorId',
			'tags',
			'privacy'
		), $input_data, null, true);

		$data['likes'] = 0;
		$data['date'] = date('Y-m-d H:i:s');
		$data['privacy'] = (isset($data['privacy'])) ? $this->assign_privacy($data['privacy']) : $this->assign_privacy();

		$this->validator->set_data($data);

		$this->validator->set_rules(array(
			array(
				'field'	=> 'title',
				'label'	=> 'Title',
				'rules'	=> 'required|htmlspecialchars|trim|min_length[2]|max_length[30]',
			),
			array(
				'field'	=> 'image',
				'label'	=> 'Image',
				'rules'	=> 'valid_url|prep_url',
			),
			array(
				'field'	=> 'imageBlob',
				'label'	=> 'Image Blob',
				'rules'	=> 'valid_json'
			),
			array(
				'field'	=> 'description',
				'label'	=> 'Description',
				'rules'	=> 'required|htmlspecialchars|trim|min_length[10]|max_length[13500]',
			),
			array(
				'field'	=> 'descriptionShort',
				'label'	=> 'Short Description',
				'rules'	=> 'required|htmlspecialchars|trim|min_length[10]|max_length[280]',
			),
			array(
				'field'	=> 'authorId',
				'label'	=> 'Author ID',
				'rules'	=> 'required|numeric',
			),
			array(
				'field'	=> 'tags[]',
				'label'	=> 'Tags',
				'rules'	=> 'htmlspecialchars|trim|min_length[1]|max_length[20]',
			),
		));

		if($this->validator->run() ==  false){

			$this->errors = array(
				'validation_error'	=> $this->validator->error_array()
			);
			return false;

		}

		//tags array should be limited to 4 properties, form validation library doesn't provide array access
		if(isset($data['tags']) AND is_array($data['tags'])){
			if(count($data['tags']) > 4){
				$this->errors = array(
					'validation_error'	=> array(
						'tags'	=> 'The tags field has too many properties.'
					)
				);
				return false;
			}
		}

		$this->db->trans_start();

		if(isset($data['tags'])){
			$tags_data = $data['tags'];
			unset($data['tags']);
		}

		$query = $this->db->insert('ideas', $data);
		$idea_id = $this->db->insert_id();

		if(isset($tags_data) AND is_array($tags_data)){
			foreach($tags_data as $tag){
				$tag_data = array(
					'ideaId'	=> $idea_id,
					'tag'		=> $tag,
				);
				$this->db->insert('tags', $tag_data);
			}
		}

		$this->db->trans_complete();

		if($this->db->trans_status() === FALSE){

			$msg = $this->db->error()['message'];
			$num = $this->db->error()['code'];
			$last_query = $this->db->last_query();
			
			log_message('error', 'Problem inserting to ideas table: ' . $msg . ' (' . $num . '), using this query: "' . $last_query . '"');
			
			$this->errors = array(
				'system_error'	=> 'Problem inserting data to ideas table.',
			);
			
			return false;

		}

		return $idea_id;

	}

	public function read($id){

		$query = $this->db->get_where('ideas', array('id' => $id));

		if($query->num_rows() > 0){
			
			$row = $query->row();

			$owned = false;
			if($this->sessions_manager->authorized()){
				if($this->sessions_manager->get_user()['id'] == $row->authorId){
					$owned = true;
				}
			}

			if(!$this->check_privacy($row->privacy) AND !$owned){
				$this->errors = array(
					'error' => 'This idea is private to developers.'
				);
				return false;
			}

			$author = $this->accounts_manager->get_user($row->authorId);
			$author_name = $author['username'];
			$author_url = url_title($author['username'], '_', true);
			$author_avatar = 'http://gravatar.com/avatar/' . md5(trim($author['email']));
			//should be changed to role description instead
			if($author->has_role('admin')){
				$author_type = 'Site Administrator';
			}elseif($author->has_role('developer')){
				$author_type = 'Developer';
			}else{
				$author_type = 'Member';
			}

			$tags = array();
			$this->db->select('tag')->where('ideaId', $id)->from('tags');
			$tag_query = $this->db->get();
			if($tag_query->num_rows() > 0){
				foreach($tag_query->result() as $tag_row){
					$tags[] = $tag_row->tag;
				}
			}

			$comment_count = intval($this->get_comment_count($id));

			$data = array(
				'id'					=> $id,
				'title'					=> $row->title,
				'titleUrl'				=> url_title($row->title, '_', true),
				'image'					=> $row->image,
				'imageBlob'				=> $row->imageBlob,
				'description'			=> $row->description,
				'descriptionParsed'		=> $this->parse_markdown($row->description),
				'descriptionShort'		=> $row->descriptionShort,
				'authorId'				=> $row->authorId,
				'authorUrl'				=> $author_url,
				'author'				=> $author_name,
				'authorAvatar'			=> $author_avatar,
				'authorType'			=> $author_type,
				'likes'					=> intval($row->likes),
				'tags'					=> $tags,
				'date'					=> $row->date,
				'privacy'				=> $this->reverse_privacy($row->privacy),
				'commentCount'			=> $comment_count,
			);
			return $data;
			
		}else{
		
			$this->errors = array(
				'error' => 'Could not find specified idea.'
			);
			return false;
		
		}

	}

	public function read_all($limit = false, $offset = false, $tags = false, $author = false, $popular = false){

		//typecast to help the binding
		$limit = ($limit) ? (int) $limit : 20;
		$offset = ($offset) ? (int) $offset : 0;

		//search tags
		$this->db->select('i.*');
		$this->db->distinct();
		$this->db->from('ideas AS i');
		if(is_array($tags)){
			$this->db->join('tags AS t', 't.ideaId = i.id');
			$this->db->where_in('t.tag', $tags);
		}
		$tag_subquery = $this->db->get_compiled_select();

		//search full text on description AND search "like" on the title
		$search_subquery = '';
		if(is_array($tags)){
			$this->db->select('i.*');
			$this->db->from('ideas AS i');
			$this->db->where('MATCH (`i`.`description`) AGAINST (' . $this->db->escape(implode(' ', $tags)) . ')', null, false);
			$this->db->or_like('i.title', implode(' ', $tags));
			$search_subquery = $this->db->get_compiled_select();
		}

		//optional author filter
		$author_filter = ' WHERE `authorId` = ' . $this->db->escape_str($author);

		//popular sorting, date sorting and limits for pagination
		$sort = ' ORDER BY';
		$popular_sort = ' `likes` DESC';
		$date_sort = ' `date` DESC';
		$limit_sort = ' LIMIT ?, ?';

		//popular sorting takes precedence over date sorting
		if($popular){
			$sort .= $popular_sort . ',';
		}
		$sort .= $date_sort;
		$sort .= $limit_sort;

		//union automatically makes the results are distinct
		if(empty($search_subquery)){
			$query = $tag_subquery;
			if(is_numeric($author)){
				$query .= $author_filter;
			}
			$query .= $sort;
		}else{
			$query = "
				SELECT * FROM (
					($tag_subquery) 
					UNION 
					($search_subquery)
				) AS `u`
			";
			if(is_numeric($author)){
				$query .= $author_filter;
			}
			$query .= $sort;
		}

		$query = $this->db->query($query, array($offset, $limit));

		if($query->num_rows() > 0){
		
			foreach($query->result() as $row){

				$idea_id = $row->id;
				$author_id = $row->authorId;

				$owned = false;
				if($this->sessions_manager->authorized()){
					if($this->sessions_manager->get_user()['id'] == $row->authorId){
						$owned = true;
					}
				}

				//if the idea didn't pass the privacy check, we just continue to the next idea
				if(!$this->check_privacy($row->privacy) AND !$owned){
					continue;
				}

				//get author info
				$author = $this->accounts_manager->get_user($author_id);
				$author_name = $author['username'];
				$author_url = url_title($author['username'], '_', true);
				$author_avatar = 'http://gravatar.com/avatar/' . md5(trim($author['email']));
				//should be changed to role description instead
				if($author->has_role('admin')){
					$author_type = 'Site Administrator';
				}elseif($author->has_role('developer')){
					$author_type = 'Developer';
				}else{
					$author_type = 'Member';
				}

				//tags for each idea
				$tags = array();
				$this->db->select('tag')->where('ideaId', $idea_id)->from('tags');
				$tag_query = $this->db->get();
				if($tag_query->num_rows() > 0){
					foreach($tag_query->result() as $tag_row){
						$tags[] = $tag_row->tag;
					}
				}

				//comment count for each idea
				$comment_count = intval($this->get_comment_count($idea_id));

				$data[] = array(
					'id'					=> $row->id,
					'title'					=> $row->title,
					'titleUrl'				=> url_title($row->title, '_', true),
					'image'					=> $row->image,
					'imageBlob'				=> $row->imageBlob,
					'description'			=> $row->description,
					'descriptionParsed'		=> $this->parse_markdown($row->description),
					'descriptionShort'		=> $row->descriptionShort,
					'authorId'				=> $author_id,
					'authorUrl'				=> $author_url,
					'author'				=> $author_name,
					'authorAvatar'			=> $author_avatar,
					'authorType'			=> $author_type,
					'likes'					=> intval($row->likes),
					'tags'					=> $tags,
					'date'					=> $row->date,
					'privacy'				=> $this->reverse_privacy($row->privacy),
					'commentCount'			=> $comment_count,
				);
			
			}
			
			return $data;
		
		}else{
		
			$this->errors = array(
				'error' => 'No more ideas to load!'
			);
			
			return false;
		
		}

	}

	public function update($id, $input_data){

		if(!$this->sessions_manager->authorized() AND !$this->sessions_manager->authorized(false, 'admin')){
			$query = $this->db->get_where('ideas', array('authorId' => $this->sessions_manager->get_user()['id']));
			if(!$query->num_rows()){
				$this->errors = array(
					'error'	=> 'Not authorised to update this idea.'
				);
				return false;
			}
		}

		$data = elements(array(
			'title',
			'image',
			'imageBlob',
			'description',
			'descriptionShort',
			'tags',
			'privacy'
		), $input_data, null, true);

		$data['privacy'] = (isset($data['privacy'])) ? $this->assign_privacy($data['privacy']) : $this->assign_privacy();

		$this->validator->set_data($data);

		$this->validator->set_rules(array(
			array(
				'field'	=> 'title',
				'label'	=> 'Title',
				'rules'	=> 'htmlspecialchars|trim|min_length[2]|max_length[30]',
			),
			array(
				'field'	=> 'image',
				'label'	=> 'Image',
				'rules'	=> 'valid_url|prep_url',
			),
			array(
				'field'	=> 'imageBlob',
				'label'	=> 'Image Blob',
				'rules'	=> 'valid_json'
			),
			array(
				'field'	=> 'description',
				'label'	=> 'Description',
				'rules'	=> 'htmlspecialchars|trim|min_length[10]|max_length[13500]',
			),
			array(
				'field'	=> 'descriptionShort',
				'label'	=> 'Short Description',
				'rules'	=> 'htmlspecialchars|trim|min_length[10]|max_length[280]',
			),
			array(
				'field'	=> 'tags[]',
				'label'	=> 'Tags',
				'rules'	=> 'htmlspecialchars|trim|min_length[1]|max_length[20]',
			),
		));

		if($this->validator->run() ==  false){

			$this->errors = array(
				'validation_error'	=> $this->validator->error_array()
			);
			return false;

		}

		//tags array should be limited to 4 properties, form validation library doesn't provide array access
		if(isset($data['tags']) AND is_array($data['tags'])){
			if(count($data['tags']) > 4){
				$this->errors = array(
					'validation_error'	=> array(
						'tags'	=> 'The tags field has too many properties.'
					)
				);
				return false;
			}
		}

		$this->db->trans_start();

		$tags_affected_rows = 0;
		if(isset($data['tags'])){
			//first delete all the tags relevant to this idea
			$this->db->where('ideaId', $id);
			$this->db->delete('tags');
			//now add in the rest of the tags
			$tags_data = $data['tags'];
			foreach($tags_data as $tag){
				$tag_data = array(
					'ideaId'	=> $id,
					'tag'		=> $tag,
				);
				$this->db->insert('tags', $tag_data);
			}
			$tags_affected_rows = $this->db->affected_rows();
			unset($data['tags']);
		}

		$this->db->where('id', $id);
		$this->db->update('ideas', $data);
		$ideas_affected_rows = $this->db->affected_rows();

		$this->db->trans_complete();

		if($this->db->trans_status() === FALSE){

			$msg = $this->db->error()['message'];
			$num = $this->db->error()['code'];
			$last_query = $this->db->last_query();
			
			log_message('error', 'Problem updating to ideas table: ' . $msg . ' (' . $num . '), using this query: "' . $last_query . '"');
			
			$this->errors = array(
				'system_error'	=> 'Problem updating data to ideas table.',
			);
			
			return false;

		}

		if(($tags_affected_rows + $ideas_affected_rows) > 0){
		
			return true;
		
		}else{
			
			$this->errors = array(
				'error'	=> 'Idea doesn\'t need to update.',
			);

            return false;
		
		}

	}

	public function delete($id){

		if(!$this->sessions_manager->authorized() AND !$this->sessions_manager->authorized(false, 'admin')){
			$query = $this->db->get_where('ideas', array('authorId' => $this->sessions_manager->get_user()['id']));
			if(!$query->num_rows()){
				$this->errors = array(
					'error'	=> 'Not authorised to update this idea.'
				);
				return false;
			}
		}

		$this->db->trans_start();

		$this->db->where('id', $id);
		$this->db->delete('ideas');
		$ideas_affected_rows = $this->db->affected_rows();

		$this->db->where('ideaId', $id);
		$this->db->delete('tags');
		$tags_affected_rows = $this->db->affected_rows();

		$this->db->trans_complete();

		if(($tags_affected_rows + $ideas_affected_rows) > 0){
		
			return true;
		
		}else{
			
			$this->errors = array(
				'error'	=> 'No idea to delete.',
			);

            return false;
		
		}

	}

	public function get_errors(){

		return $this->errors;

	}

	//PRIVACY needs to be reversed for output and updating
	protected function assign_privacy($privacy_selection = false){

		$bitwise = '';

		//cannot use '&' as CI's XSS clean auto adds a ';' after the string, breaking the input!
		switch($privacy_selection){
			case 'public':
				$bitwise = decbin(self::PUBLIC_PRIVACY);
				break;
			case 'developers':
				$bitwise = decbin(self::DEVELOPERS_PRIVACY);
				break;
			default:
				$bitwise = decbin(self::PUBLIC_PRIVACY);
		}

		return $bitwise;

	}

	protected function reverse_privacy($privacy_selection){

		$privacy_selection = bindec($privacy_selection);

		$result = '';

		switch($privacy_selection){
			case self::PUBLIC_PRIVACY:
				$result = 'public';
				break;
			case self::DEVELOPERS_PRIVACY:
				$result = 'developers';
				break;
			default:
				$result = 'public';
		}

		return $result;

	}

	protected function check_privacy($privacy){

		//this checks if privacy of the item
		//if it is a public privacy, just return true
		//if it isnt, we need to check if its a developers privacy
		//if it is, then if the current user is not a developer, then we return false

		//convert the bitwise back to decimal form
		$privacy = bindec($privacy);

		//if not public privacy
		if(!($privacy & self::PUBLIC_PRIVACY)){

			if($privacy & self::DEVELOPERS_PRIVACY){

				$current_user = false;
				if($this->sessions_manager->authorized()){
					$current_user = $this->sessions_manager->get_user();
				}

				if(!$current_user OR (!$current_user->has_role('admin') AND !$current_user->has_role('developer'))){
					return false;
				}
			
			}

		}

		return true;

	}

	/**
	 * Parse Markdown Description.
	 * Markdown will be stored in the database to allow easy editing.
	 * @param  String $text Markdown String from the database
	 * @return String       Processed output
	 */
	protected function parse_markdown($text){

		$this->parser->no_markup = true;

		$html = $this->parser->transform($text);

		return $html;

	}

	protected function get_comment_count($idea_id){

		$this->db->select('COUNT(id) AS commentsCount');
		$this->db->where('ideaId', $idea_id);
		$this->db->from('comments');
		$query = $this->db->get();

		if($query->num_rows() > 0){

			$row = $query->row();
			return $row->commentsCount;

		}else{

			return false;

		}

	}

}