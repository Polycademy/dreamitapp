define(['angular', 'lodash'], function(angular, _){

	'use strict';

	angular.module('Controllers')
		.controller('ControlPanelCtrl', [
			'$scope',
			'SearchServ',
			function($scope, SearchServ){

				/**
				 * Submits a tag query parameter to be searched in real time
				 * @return {Void}
				 */
				$scope.submitSearch = function(){
					SearchServ.searchTag($scope.searchTag);
				};

				/**
				 * Throttled version of submit search. To reduce load and to prevent ng-repeat from overheating.
				 * @return {Void}
				 */
				$scope.submitSearchThrottled = _.throttle(function(){
					SearchServ.searchTag($scope.searchTag);
				}, 500);

				//adds an idea, this shows an overlay with a form the ability to add an idea
				//after the form is submitted and validated, it will close and send the request to the server
				//once that is done, it will prepend the item object to the masonry list
				$scope.addIdea = function(){

				};

				/**
				 * Determines whether we are showing my ideas or not.
				 * @type {Boolean}
				 */
				$scope.viewingMyIdeas = false;

				/**
				 * Toggles whether to show logged in user's own ideas.
				 * This is done via the author query parameter.
				 * @return {Void}
				 */
				$scope.myIdeas = function(){

					$scope.viewingMyIdeas = !$scope.viewingMyIdeas;

					if($scope.viewingMyIdeas){
						//hardcoded author id, can only be used once we are "logged in"
						var authorId = 1;
						SearchServ.searchAuthor(authorId);
					}else{
						SearchServ.searchAuthor('');
					}

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