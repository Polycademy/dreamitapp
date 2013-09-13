define(['angular', 'lodash'], function(angular, _){

	'use strict';

	//hack required because infinite scroll directive does not support infinite scrolling in the overlays :(
	angular.module('Directives')
		.directive('whenScrolledDir', [
			'$rootScope',
			'$window',
			'$document',
			'$timeout',
			function($rootScope, $window, $document, $timeout){
				return {
					link: function(scope, element, attributes){

						$timeout(function(){

							var scrollEnabled = true;
							var checkWhenEnabled = false;
							if (attributes.whenScrolledDisabled != null) {
								scope.$watch(attributes.whenScrolledDisabled, function(value) {
									scrollEnabled = !value;
									if (scrollEnabled && checkWhenEnabled) {
										checkWhenEnabled = false;
										return debouncedScroll();
									}
								});
							}

							var scrolledElement;

							if(attributes.whenScrolledContainer === 'window'){
								scrolledElement = angular.element($window);
							}else{
								scrolledElement = angular.element(attributes.whenScrolledContainer);
							}

							var raw = scrolledElement[0];

							var debouncedScroll = _.debounce(function(){

								if(attributes.whenScrolledContainer === 'window'){

									var shouldScroll = (scrolledElement.scrollTop()) >= (angular.element($document).height() - scrolledElement.height() - 100);
									
									if(scrollEnabled && shouldScroll){
										if($rootScope.$$phase) {
											scope.$eval(attributes.whenScrolledDir);
										}else{
											scope.$apply(attributes.whenScrolledDir);
										}
									}else if(shouldScroll) {
										return checkWhenEnabled = true;
									}

								}else{

									var shouldScroll = (raw.scrollTop + raw.offsetHeight) >= (raw.scrollHeight - 100);

									if(scrollEnabled && shouldScroll){
										if($rootScope.$$phase) {
											scope.$eval(attributes.whenScrolledDir);
										}else{
											scope.$apply(attributes.whenScrolledDir);
										}
									}else if(shouldScroll) {
										return checkWhenEnabled = true;
									}
								}

							}, 100);

							scrolledElement.on('scroll', debouncedScroll);

						}, 0);

					}
				};
			}
		]);

});