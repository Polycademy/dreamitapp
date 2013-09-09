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

				this.appendIdea = function(ideas){

					this.appIdeas.push(ideas);

				};

				this.prependIdea = function(ideas){

					this.appIdeas.unshift(ideas);

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