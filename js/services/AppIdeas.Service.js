define(['angular'], function(angular){

	'use strict';

	angular.module('Services')
		.service('AppIdeasServ', [
			function(){

				this.appIdeas = [];

				this.getAppIdeas = function(){
					
					return this.appIdeas;
				
				};

				this.setAppIdeas = function(appIdeas){

					this.appIdeas = appIdeas;

				};

				this.clearAppIdeas = function(){

					this.appIdeas = [];

				};

				this.appendIdea = function(idea){

					this.appIdeas.push(idea);

				};

				this.prependIdea = function(idea){

					this.appIdeas.unshift(idea);

				};

				this.replaceIdea = function(id, updatedIdea){

					for(var i=0; i<this.appIdeas.length; i++){
						if(id == this.appIdeas[i].id){
							this.appIdeas[i] = updatedIdea;
						}
					}
					
				};

			}
		]);

});