<script type="text/ng-template" id="search_modal.html">
	<div 
		class="search_container overlay_container" 
		overlay-close-dir="viewingOverlay" 
		overlay-close-func="closeOverlay()" 
	>
		<button class="search_close overlay_close" ng-click="closeOverlay()" ng-show="viewingOverlay">
			<span class="fui-cross"></span>
		</button>
		<form class="search_form form-inline" ng-submit="submitSearch()" name="search_modal_form">
			<label for="search_modal"><span class="fui-search"></span></label>
			<input id="search_modal" name="search" type="text" ng-model="searchValue" placeholder="Search"></input>
			<button type="submit" class="btn btn-primary">Submit</button>
		</form>
	</div>
</script>