define(['angular'], function(angular){

	'use strict';

	angular.module('Services')
		.service('BlogDataServ', [
			function(){

				this.blogData = [];

				this.getBlogData = function(){
					
					return this.blogData;
				
				};

				this.setBlogData = function(blogData){

					this.blogData = blogData;

				};

				this.clearBlogData = function(){

					this.blogData = [];

				};

				this.appendBlog = function(blog){

					this.blogData.push(blog);

				};

				this.prependBlog = function(blog){

					this.blogData.unshift(blog);

				};

				this.replaceBlog = function(id, updatedBlog){

					for(var i=0; i<this.blogData.length; i++){
						if(id == this.blogData[i].id){
							this.blogData[i] = updatedBlog;
						}
					}
					
				};

			}
		]);

});