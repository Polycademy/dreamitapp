define(['angular'], function(angular){

	'use strict';

	angular.module('Controllers')
		.controller('HomeCtrl', [
			'$scope',
			'$location',
			function($scope, $location){

				//extract appIdeas from appideas service (given parameters based on infinite loading)
				//which then extracts from appideas controller
				//which extracts from appideas model
				//also take into account error responses, like no ideas found

				//this is required by the add this to have the proper link becuase it does auto recognise the base tag
				$scope.baseUrl = angular.element('base')[0].href;

				$scope.appIdeas = [
					{
						id: 1, //the link and the id is combined to form the URL segment e.g. (hacker_news_app1)
						link: 'hacker_news_app1-idea', //from url_title ('', '_', true)
						title: 'Hacker News App',
						image: 'img/example_item_image.png', //link to the image (from filepicker.. etc amazon)
						description: '<p>An app to help read Hacker News on the mobile phone or ipad.</p>',
						authorId: 1, //the author url would be roger_qiu1
						authorLink: 'roger_qiu1',
						author: 'Roger Qiu',
						feedback: 32,
						likes: 40,
						tags: [
							'iphone',
							'ipad',
							'android',
							'programming'
						]
					},
					{
						id: 2,
						link: 'hacker_news_app1-idea',
						title: 'Hacker News App',
						description: '<p>An app to help read Hacker News on the mobile phone or ipad.</p>',
						authorId: 1,
						authorLink: 'roger_qiu1',
						author: 'Roger Qiu',
						feedback: 32,
						likes: 40,
						tags: [
							'iphone',
							'ipad',
							'android',
							'programming'
						]
					},
					{
						id: 3,
						link: 'hacker_news_app1-idea',
						title: 'Hacker News App',
						image: 'img/2exampleimg.png',
						description: '<p>An app to help read Hacker News on the mobile phone or ipad.</p>',
						authorId: 1,
						authorLink: 'roger_qiu1',
						author: 'Roger Qiu',
						feedback: 32,
						likes: 40,
						tags: [
							'iphone',
							'ipad',
							'android',
							'programming'
						]
					},
					{
						id: 4,
						link: 'hacker_news_app1-idea',
						title: 'Hacker News App',
						image: 'img/example_item_image.png',
						description: '<p>An app to help read Hacker News on the mobile phone or ipad.</p>',
						authorId: 1,
						authorLink: 'roger_qiu1',
						author: 'Roger Qiu',
						feedback: 32,
						likes: 40,
						tags: [
							'iphone',
							'ipad',
							'android',
							'programming'
						]
					},
					{
						id: 5,
						link: 'hacker_news_app1-idea',
						title: 'Hacker News App',
						image: 'img/2exampleimg.png',
						description: '<p>An app to help read Hacker News on the mobile phone or ipad.</p>',
						authorId: 1,
						authorLink: 'roger_qiu1',
						author: 'Roger Qiu',
						feedback: 32,
						likes: 40,
						tags: [
							'iphone',
							'ipad',
							'android',
							'programming'
						]
					}
				];

				//this will increase the like amount on the item, and update the like click
				$scope.likeAction = function(ideaId){
					var userId = 'ANONYMOUS???';
					//id will be the id of the item to be clicked
					//and the current user will be filled on the userId
					//only logged in users can "like"
					//also prevent multiple likes (could be done on server side and client side, but server side first!)

					//dummy function right now
					$scope.appIdeas.push(
						{
							id: 6,
							link: 'hacker_news_app1-idea',
							title: 'Hacker News App',
							image: 'img/2exampleimg.png',
							description: '<p>An app to help read Hacker News on the mobile phone or ipad.</p>',
							authorId: 1,
							authorLink: 'roger_qiu1',
							author: 'Roger Qiu',
							feedback: 32,
							likes: 40,
							tags: [
								'iphone',
								'ipad',
								'android',
								'programming'
							]
						}
					);


				};

				//sets the tag as a query parameter ?tag=wacky+lol+crazy (actual pluses are )
				$scope.tagAction = function(tag){
					//tag needs to be uri encoded! (then decoded when used!)
					$location.search({'tag': encodeURIComponent(tag)});
				};

				//boolean function for whether the app ideas has an image
				$scope.ideaHasImage = function(index){

					//it is possible that image may be "false"
					if('image' in $scope.appIdeas[index]){
						return $scope.appIdeas[index].image;
					}else{
						return false;
					}

				};

			}
		]);

});