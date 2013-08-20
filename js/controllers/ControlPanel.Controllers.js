define(['angular', 'lodash'], function(angular, _){

	'use strict';

	angular.module('Controllers')
		.controller('ControlPanelCtrl', [
			'$scope',
			'$timeout',
			'$dialog',
			'SearchServ',
			'UtilitiesServ',
			function($scope, $timeout, $dialog, SearchServ, UtilitiesServ){

				/**
				 * Submits a tag query parameter to be searched in real time
				 * @return {Void}
				 */
				$scope.submitSearch = function(){
					SearchServ.searchTag($scope.searchTag);
				};

				/**
				 * Debounced version of submit search. To reduce load and to prevent ng-repeat from overheating.
				 * This is not using lodash because lodash's debounce is somewhat buggy with interacting with 
				 * ng-change
				 * @return {Void}
				 */
				$scope.submitSearchDebounced = UtilitiesServ.createDebouncedFunction(
					function(){
						SearchServ.searchTag($scope.searchTag);
					},
					400
				);


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

				//these are the overlays
				$scope.openAddIdeaOverlay = function(){

				};

				$scope.openProfileOverlay = function(){

				};

				//should start false
				$scope.loggedIn = true;

				//this will bring up an overlay as well
				$scope.signIn = function(){

				};

				//this does not bring up an overlay
				$scope.signOut = function(){

				};

				//we need some way of getting popular tags
				$scope.popularTags = [
					'popular',
					'tags',
					'are',
					'listed',
					'here'
				];

			}
		]);

});