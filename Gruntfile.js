module.exports = function(grunt){

	/*
		The distribution directory should be tracked by Git, as PagodaBox relies on Git to host your files.
		Make sure to make your git repository private as there may be secrets.
		Once the repo is uploaded to Dream it App, you will need to gunzip + untar the build.tar.gz inside the distribution folder.
		Extract it to the distribution folder, remember to remove the initial parent container.
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
					'css/main.css': 'css/main.css'
				}
			}
		},
		clean: {
			pre:{
				files: [
					{
						src: ['distribution/**'],
						dot: true
					}
				]
			},
			post:{
				files: [
					{
						src: ['distribution/!(build.tar.gz)'],
						dot: true
					}
				]
			}
		},
		copy:{
			main:{
				files:[
					{src: ['**'], dest: 'distribution/', dot: true, filter: function(filepath){
					
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
				src: ['distribution/index.php'],
				overwrite: true,
				replacements: [{
					from: /((?:[a-z][a-z]+)\(\'ENVIRONMENT\', isset\(\$_SERVER\[\'CI_ENV\'\]\) \? \$_SERVER\[\'CI_ENV\'\] : \'development\'\).)/g,
					to: "define('ENVIRONMENT', isset($_SERVER['CI_ENV']) ? $_SERVER['CI_ENV'] : 'production');"
				}]
			}
		},
		compress:{
			main:{
				options:{
					archive: 'distribution/build.tar.gz',
					mode: 'tgz'
				},
				files:[
					{
						flatten: true,
						dot: true,
						src: 'distribution/**'
					}
				]
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
	grunt.loadNpmTasks('grunt-contrib-compress');
	
	grunt.registerTask('default', ['cssmin', 'clean:pre', 'copy', 'replace', 'compress', 'clean:post']);

};