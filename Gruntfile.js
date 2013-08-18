module.exports = function(grunt){

	/*
		The build directory should be tracked by Git, as PagodaBox relies on Git to host your files.
		Make sure to make your git repository private as there may be secrets.
	 */

	//project configuration
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'), //get the package.json to load dependencies!
		cssmin: {
			main:{
				options: {
					keepSpecialComments: 0
				},
				files: {
					src: 'css/*.css',
					dest: 'css/*.css'
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
						
						// ignoring "css/" except *.css
						var cssPattern = new RegExp('^css\\'+dir);
						var cssExtensionPattern = new RegExp('css$');
						if(cssPattern.test(filepath)){
							if(!cssExtensionPattern.test(filepath)){
								grunt.log.writeln('Not copying: ' + filepath);
								return false;
							}
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
							filepath === 'bower.json' || 
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
		}
	});
		
	grunt.loadNpmTasks('grunt-shell');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-text-replace');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	
	grunt.registerTask('default', ['cssmin', 'clean', 'copy', 'replace']);

};