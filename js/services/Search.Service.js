define(['angular'], function(angular){

	'use strict';

	angular.module('Services')
		.service('SearchServ', [
			'LocationSearchServ',
			function(LocationSearchServ){

				//you can't delete the query's keys because that will prevent the watch from happening

				this.searchPopular = function(toggle){

					if(typeof toggle === 'undefined') toggle = true;

					if(!toggle){
						LocationSearchServ.setQuery({popular: ''});
					}else{
						LocationSearchServ.setQuery({popular: 'true'});
					}

				};

				this.searchTag = function(tag){

					LocationSearchServ.setQuery({tags: tag});

				};

				this.searchAuthor = function(authorId){

					LocationSearchServ.setQuery({author: authorId});

				};


			}
		]);

});