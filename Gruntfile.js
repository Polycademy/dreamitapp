module.exports = function(grunt){

	/*
		These steps are required because PAGODABOX does not support NPM or BOWER to install dependencies.
		Therefore all of our dependencies needs to be packaged up and send to as the build folder using FTP instead of GIT.
		Finally the BoxFile cannot run any of it's deploy hooks properly. In fact upon changing to FTP.
		We will need to manually run the migration. One way would be to access it via the Web, then deleting the file.
		Another would be accessing via ssh to cli.
		In the future, when node and npm is supported you can move to a proper automatic deploy process via the deploy hooks.
		You would set document root as build/ and download all dependencies in after_build and run migration at before_deploy.
		See this: http://help.pagodabox.com/customer/portal/articles/356925
		STEPS:
		1. compile main.less to main.css (and compress)
		2. delete the old build directory
		3. copy over everything to the build directory (we keep all dependencies)
			a) Except:
				css (except main.css)
				bin, 
				tests, 
				tools, 
				node_modules, 
				.git,
				.c9revisions,
				"application/logs/*", 
				"application/cache/*", 
				"application/config/development/*",
				Gruntfile.js, 
				package.json, 
				README.md, 
				composer.lock
				composer.json
				.gitignore, 
				.gitattributes, 
		8. change index.php to use 'production' constant (inside the build directory)
	*/

	var releaseBranchOptions = {
		main:{
			options: {
				//the name of the orphan branch. Default is gh-pages
				releaseBranch: 'pagoda-release',
				//the name of the remote repository. Default is origin
				remoteRepository: 'origin',
				//the name of the output directory. Default is dist
				distDir: 'build',
				//the commit message to be used for the optional commit
				commitMessage: 'RELEASE',
				//should files be automatically commited on the orphan branch
				commit: false,
				//should the orphan branch be pushed to the remote repository
				//default is false
				push: false,
				//a blacklist of things to keep on the root level. By default only
				//the .git folder will be kept.
				blacklist: [
					'.git'
				]
			}
		}
	};

	//project configuration
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'), //get the package.json to load dependencies!
		releaseBranchPre: releaseBranchOptions,
		cssmin: {
			main:{
				options: {
					keepSpecialComments: 0
				},
				files: {
					'css/main.css': 'css/main.css'
				}
			}
		},
		clean: ['build/**'],
		copy:{
			main:{
				files:[
					{src: ['**'], dest: 'build/', dot: true, filter: function(filepath){
					
						//directory separator
						var dir = require('path').sep;
						
						// ignoring "css/" except css/main.css
						var cssPattern = new RegExp('^css\\'+dir);
						if(cssPattern.test(filepath) && filepath != 'css'+dir+'main.css'){
							grunt.log.writeln('Not copying: ' + filepath);
							return false;
						}
						
						// ignoring various directories
						if(
							/^bin/.test(filepath) || 
							/^tests/.test(filepath) || 
							/^tools/.test(filepath) || 
							/^node_modules/.test(filepath) || 
							/^\.git/.test(filepath) ||
							/^\.c9revisions/.test(filepath)
						){
							grunt.log.writeln('Not copying: ' + filepath);
							return false;
						}
						
						//ignoring inner files
						var logPattern = new RegExp('^application\\'+dir+'logs\\'+dir);
						var cachePattern = new RegExp('^application\\'+dir+'cache\\'+dir);
						var configPattern = new RegExp('^application\\'+dir+'config\\'+dir+'development\\'+dir);
						if(logPattern.test(filepath) || cachePattern.test(filepath) || configPattern.test(filepath)){
							grunt.log.writeln('Not copying: ' + filepath);
							return false;
						}
						
						//ignoring various files
						if(
							filepath === 'README.md' ||
							filepath === 'composer.json' ||
							filepath === 'composer.lock' ||
							filepath === 'Gruntfile.js' || 
							filepath === 'package.json' || 
							filepath === '.gitignore' || 
							filepath === '.gitattributes'
						){
							grunt.log.writeln('Not copying: ' + filepath);
							return false;
						}
						
						return true;
						
					}}
				]
			}
		},
		replace:{
			main:{
				src: ['build/index.php'],
				overwrite: true,
				replacements: [{
					from: /((?:[a-z][a-z]+)\(\'ENVIRONMENT\', isset\(\$_SERVER\[\'CI_ENV\'\]\) \? \$_SERVER\[\'CI_ENV\'\] : \'development\'\).)/g,
					to: "define('ENVIRONMENT', isset($_SERVER['CI_ENV']) ? $_SERVER['CI_ENV'] : 'production');"
				}]
			}
		},
		releaseBranch: releaseBranchOptions
	});
		
	grunt.loadNpmTasks('grunt-shell'); //for random shell commands later on
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-text-replace');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-release-branch');
	
	grunt.registerTask('default', ['releaseBranchPre', 'cssmin', 'clean', 'copy', 'replace', 'releaseBranch']);

};