define(['angular', 'lodash'], function(angular, _){

	'use strict';

	angular.module('Controllers')
		.controller('ControlPanelCtrl', [
			'$scope',
			'SearchServ',
			function($scope, SearchServ){

				$scope.submitSearch = function(){
					SearchServ.searchTag($scope.searchTag);
				};

				//adds an idea, this shows an overlay with a form the ability to add an idea
				//after the form is submitted and validated, it will close and send the request to the server
				//once that is done, it will prepend the item object to the masonry list
				$scope.addIdea = function(){

				};

				//we need the current author, this simply changes the wall's list and offers editing options
				//this is toggleable!
				$scope.myIdeas = function(){

					//hardcoded author id, can only be used once we are "logged in"
					var authorId = 1;

					SearchServ.searchAuthor(authorId);

				};

				//bring up an overlay of their profile, (and potentially a change of the link similar to the idea overlay)
				//allow them to change their options!
				$scope.profile = function(){

				};

				$scope.popularTags = [
					'popular',
					'tags',
					'are',
					'listed',
					'here'
				];

				$scope.loggedIn = true;

			}
		]);

});