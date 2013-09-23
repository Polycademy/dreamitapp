/**
 * RequireJS Optimiser Build Configuration.
 * This is ran from Grunt.
 */
({
	baseUrl: 'build/js/', //base directory of source
	mainConfigFile: 'build/js/bootstrap.js', //import runtime config
	keepBuildDir: true, //build dir should not be deleted
	skipDirOptimize: true, //we're only optimising a single file here
	findNestedDependencies: true, //could be false?? we should find nested dependencies!
	name: 'bootstrap', //this is the file we're going to optimise
	out: 'build/js/main.js', //this is final optimised file
	paths: { //empty are for any scripts loaded from a CDN
		'sharethis': 'empty:',
		'filepicker': 'empty:'
	}
})