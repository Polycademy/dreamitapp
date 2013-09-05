define(['angular', 'filepicker'], function(angular, filepicker){

	'use strict';

	angular.module('Directives')
		.directive('filePickerStoreDir', [
			function(){
				return {
					scope:{
						filePickerApiKey: '@',
						filePickerOptions: '&',
						fileStoreOptions: '&',
						filePickerSuccess: '&',
						filePickerFail: '&'
					},
					link: function(scope, element, attributes){

						scope.$watch('filePickerApiKey', function(value){
							filepicker.setKey(value);
						});

						var pickerOptions = scope.filePickerOptions(),
							storeOptions = scope.fileStoreOptions();

						element.bind('click', function(){

							if(typeof pickerOptions === 'undefined') pickerOptions = {};
							if(typeof storeOptions === 'undefined') storeOptions = {};

							filepicker.pickAndStore(
								pickerOptions,
								storeOptions,
								function(InkBlobs){
									if(typeof scope.filePickerSuccess === 'function'){
										scope.filePickerSuccess({InkBlobs: InkBlobs});
									}
								},
								function(FPError){
									if(typeof scope.filePickerFail === 'function'){
										scope.filePickerFail({FPError: FPError});
									}
								}
							);

						});

					}
				};
			}
		]);

});