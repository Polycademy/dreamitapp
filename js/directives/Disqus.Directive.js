//this directive needs to be able to maintain multiple disqus elements here!
//also requires support of comments
//http://help.disqus.com/customer/portal/articles/565624
//http://dreamitapp.disqus.com/admin/universalcode/
//http://help.disqus.com/customer/portal/articles/472098#disqus_shortname
//http://stackoverflow.com/questions/4963505/several-disqus-threads-on-one-page
//https://github.com/kirstein/angular-disqus/blob/master/angular-disqus.js
//https://github.com/kirstein/angular-disqus
//http://stackoverflow.com/questions/15823047/what-is-the-best-approach-to-use-disqus-in-a-single-page-application

define(['angular'], function(angular){

	'use strict';

	angular.module('Directives')
		.service('DisqusServ', [
			function(){

				//setup the disqus js scripts
				//they can't be done in requirejs

			}
		])
		.directive('disqusThread', [
			'DisqusServ',
			function(DisqusServ){
				return {
					scope: true,
					link: function(scope, element, attributes){
					
						//show the disqus thread, and reshow it everytime it is called
						//that is to reset it!
					
					}
				};
			}
		])
		.directive('disqusCommentsCount', [
			'DisqusServ',
			function(DisqusServ){
				return {
					scope: true,
					link: function(scope, element, attributes){
					
						//show comment count
					
					}
				};
			}
		]);

});