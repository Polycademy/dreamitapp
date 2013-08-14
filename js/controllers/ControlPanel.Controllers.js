define(['angular', 'lodash'], function(angular, _){

	'use strict';

	angular.module('Controllers')
		.controller('ControlPanelCtrl', [
			'$scope',
			'$dialog',
			'SearchServ',
			function($scope, $dialog, SearchServ){

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