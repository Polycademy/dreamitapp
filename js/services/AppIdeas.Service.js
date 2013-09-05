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

				this.appendIdeas = function(ideas){

					this.appIdeas.push(ideas);

				};

				this.prependIdeas = function(ideas){

					this.appIdeas.unshift(ideas);

				};

			}
		]);

});