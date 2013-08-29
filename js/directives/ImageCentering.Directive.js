define(['angular', 'jquery'], function(angular){

	'use strict';

	angular.module('Directives')
		.directive('imageCenteringDir', [
			'$window',
			function($window){
				return {
					link: function(scope, element, attributes){

						var limitTo = parseInt(attributes.imageCenteringLimit.split(/[^0-9]/i, 1));
						var limitToExtension = attributes.imageCenteringLimit.match(/[^0-9]+/);
						var window = angular.element($window);

						var roundToNearestEvenNumberButStopAtZero = function(number){
							
							if(number === 0 || number < 0){
								return 0;
							}else if(number % 2 === 0){
								return number;
							}else{
								number = number - 1;
								return roundToNearestEvenNumberButStopAtZero(number)
							}
						
						};

						element.load(function(){

							var that = this;

							var resize = function(){

								var currentElement = angular.element(that), 
									currentWidth = currentElement.width(), 
									containingWidth = currentElement.parent().width(), 
									difference = containingWidth - currentWidth;

								//difference needs to be rounded down to the nearest even number
								difference = roundToNearestEvenNumberButStopAtZero(difference);

								var padding = difference/2;

								if(typeof attributes.imageCenteringLimit !== 'undefined' && padding > limitTo){
									padding = limitTo + limitToExtension;
								}

								currentElement
									.css({
										'padding-top': padding,
										'padding-bottom': padding,
										display: 'block',
										margin: '0 auto'
									});

							};

							resize();

							window.resize(resize);

						});
					
					}
				};
			}
		]);

});