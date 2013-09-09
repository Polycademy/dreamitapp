define(['angular', 'filepicker'], function(angular, filepicker){

	'use strict';

	angular.module('Directives')
		.directive('filePickerDir', [
			function(){
				return {
					scope:{
						filePickerApiKey: '@',
						filePickerOptions: '&',
						fileStoreOptions: '&', 
						filePickerOriginalBlob: '@',
						filePickerAction: '@', 
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

							if(scope.filePickerAction === 'pickAndStore'){

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

							}else if(scope.filePickerAction === 'update'){

								var originalBlob = JSON.parse(scope.filePickerOriginalBlob);

								//if it's an update, we first pick the image, then write back the original blob
								filepicker.pick(
									pickerOptions,
									function(InkBlobs){

										filepicker.write(
											originalBlob,
											InkBlobs[0],
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

									},
									function(FPError){
										if(typeof scope.filePickerFail === 'function'){
											scope.filePickerFail({FPError: FPError});
										}
									}
								);

							}

						});

					}
				};
			}
		]);

});