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

						var pickerOptions = scope.filePickerOptions(),
							storeOptions = scope.fileStoreOptions(),
							originalBlob = {};

						scope.$watch('filePickerApiKey', function(value){
							if(value){
								filepicker.setKey(value);
							}
						});

						scope.$watch('filePickerOriginalBlob', function(value){
							if(value){
								originalBlob = JSON.parse(value);
							}
						});

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

								//this is going to delete the previous blob and pick and store a new blob
								filepicker.remove(
									originalBlob,
									{},
									function(){
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
									},
									function(FPError){
										if(typeof scope.filePickerFail === 'function'){
											scope.filePickerFail({FPError: FPError});
										}
									}
								);

							}else if(scope.filePickerAction === 'replace'){

								//this uses filepicker.write in order to replace the original URL
								//this means the originalBlob's url is going to point to a new image
								//however it won't auto update due to browser cache, so remember to use
								//a cachebusting query parameter

								//if it's an update, we first pick the image, then write back the original blob
								filepicker.pick(
									pickerOptions,
									function(InkBlob){

										filepicker.write(
											originalBlob,
											InkBlob,
											function(InkBlob){
												if(typeof scope.filePickerSuccess === 'function'){
													scope.filePickerSuccess({InkBlobs: InkBlob});
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