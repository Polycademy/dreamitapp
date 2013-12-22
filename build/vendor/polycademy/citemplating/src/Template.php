<?php

class Template{

	//partial static, data should be an array, loop by default is false, buffer by default is false (by default will return data...
	//call this like Template::partial('header', $data)
	public static function partial($partial, array $data = null, $loop = false, $buffer = false){	
	
		//if no _partial, then we append it
		if(strpos($partial, '_partial') === false){
			$partial .= '_partial';
		}
	
		$output = '';
		
		//if we're asked to loop the results
		if($loop){
		
			foreach($data as $row){
			
				//any looped partials will have to use the row variable, or else no looping for you!
				$output .= get_instance()->load->view('partials/' . $partial, array('row' => $row), true);
			
			}
		
		}else{
		
			$output = get_instance()->load->view('partials/' . $partial, $data, true);
		
		}
		
		if($buffer){
		
			return $output;
		
		}else{
		
			echo $output;
			
		}
		
	}
	
	//$view is the path to the view based on the current controller, $data is the data we pass and $layout is the path to the layout we shall use
	//use like Template::compose('index', $data, 'default');
	//or Template::compose(false, $data, 'json');
	public static function compose($view, array $data = null, $layout = 'default'){
	
		//auto detecting layout
		if(strpos($layout, '_layout') === false){
			$layout .= '_layout';
		}
	
		//if $view is false/empty, we pass straight the data straight to layout through yield (such as json data)
		if(empty($view)){
		
			get_instance()->load->view('layouts/' . $layout, array('yield' => $data));
		
		}else{
		
			//auto appending _view
			if(strpos($view, '_view') === false){
				$view .= '_view';
			}
			
			//auto add directory and controller to the view (views are the method names, which are stored in the controllers)
			$view = strtolower(get_instance()->router->fetch_directory() . get_instance()->router->fetch_class() . '/' . $view);
			
			//acquire the yield
			$data['yield'] = get_instance()->load->view($view, $data, true);
			
			//put the rest of the data into the layout!
			//layout now can call yield, along with all the other data (such as $data['header'] and $data['footer'])
			get_instance()->load->view('layouts/' . $layout, $data);
		
		}
	
	}
	
	//recursively echos out assets either in as js, css, partials or html files
	//$path is from relative to FCPATH
	//$ext can be js/css/php/html
	//$negation is an array of files, directories, and filepaths to negate
	//negation can be recursive as long as you do /**
	public static function asset($path, $ext, array $negation = null, $buffer = false){
	
		$dirs = new RecursiveDirectoryIterator($path);
		
		$output = '';
		
		foreach(new RecursiveIteratorIterator($dirs) as $file) {
		
			$path = strtr($file->getPath(), array('/' => DIRECTORY_SEPARATOR, '\\' => DIRECTORY_SEPARATOR));
			$filename = $file->getFilename();
			$pathname = strtr($file->getPathname(), array('/' => DIRECTORY_SEPARATOR, '\\' => DIRECTORY_SEPARATOR)); //fullpath
		
			//negate directories or negate filenames
			if(!empty($negation)){
				foreach($negation as $value){
					
					$value = trim($value, '/\\');
					$value = strtr($value, array('/' => DIRECTORY_SEPARATOR, '\\' => DIRECTORY_SEPARATOR));
					
					if(substr($value, -2) == DIRECTORY_SEPARATOR . '*'){
						//if the last two characters are /*, then just remove them, it will work normally
						$value = substr($value, 0, -2);
					}
					
					$subdirectory_match = false;
					if(substr($value, -3) == DIRECTORY_SEPARATOR . '**'){
						//if the last three characters is /**, then ignore all subdirectories
						//we want to extract the matching parent folder, and then test if this string exists in any of the pathnames
						$subdirectory_match = substr($value, 0, -3);
					}
					
					if(
						$value == $path OR 
						$value == $filename OR 
						$value == $pathname OR 
						strpos($pathname, $subdirectory_match) === 0
					){
						continue 2;
					}
					
				}
			}
			
			if($ext != $file->getExtension()){
				continue;
			}
			
			switch($ext){
				case 'js':
					$output .= '<script src="' . strtr($file, '\\', '/') . '"></script>';
					break;
				case 'css':
					$output .= '<link rel="stylesheet" href="' . strtr($file, '\\', '/') . '">';
					break;
				case 'php':
					preg_match('/application[\\|\/]views[\\|\/](.+)\.php$/', strtr($file->getPathname(), '\\', '/'), $matches);
					$output .= get_instance()->load->view($matches[1], null, true);
					break;
				case 'html':
					$output .= file_get_contents(strtr($file->getPathname(), '\\', '/'));
					break;
			}
			
		}
		
		if($buffer){
			return $output;
		}else{
			echo $output;
		}
	
	}

}