define(['angular', 'sharethis'], function(angular, sharethis){

	'use strict';

	angular.module('Directives')
		.service('shareThisServ', [
			function(){

				this.shareThisConfigured = false;

				//share this must be already loaded, this is basically stLight
				this.setupShareThis = function(publisherId){

					sharethis.options({
						publisher: publisherId, 
						doNotHash: true, 
						doNotCopy: true, 
						hashAddressBar: false,
						onhover: false
					});

					this.shareThisConfigured = true;

				};

				this.resetShareThis = function(){
					
					//stButtons is also loaded from shareThis at the same time!
					stButtons.locateElements();
				
				};

			}
		])
		.directive('shareThisDir', [
			'shareThisServ',
			function(shareThisServ){
				return {
					scope:{
						shareThisPublisherId: '@',
						shareThisUrl: '@',
						shareThisTitle: '@',
						shareThisSummary: '@',
						shareThisImage: '@'
					},
					link: function(scope, element, attributes){

						var isObjectReady = function(object){

							for(var key in object){
								if(object[key] === ''){
									return false;
								}
							}
							return true;

						};

						var shareThis = {};

						scope.$watch(function(){

							shareThis.publisherId = scope.shareThisPublisherId;
							shareThis.url = scope.shareThisUrl;
							shareThis.title = scope.shareThisTitle;
							shareThis.summary = scope.shareThisSummary;
							shareThis.image = scope.shareThisImage;
							
							return shareThis;

						}, function(shareThis){

							if(isObjectReady(shareThis)){

								if(!shareThisServ.shareThisConfigured){
									shareThisServ.setupShareThis(shareThis.publisherId);
								}
								
								element.addClass('st_sharethis_custom');
								attributes.$set('st_url', shareThis.url);
								attributes.$set('st_title', shareThis.title);
								attributes.$set('st_summary', shareThis.summary);
								attributes.$set('st_image', shareThis.image);

								shareThisServ.resetShareThis();
							
							}
						
						}, true);

					}
				};
			}
		]);

});