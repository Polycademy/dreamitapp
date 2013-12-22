<script type="text/ng-template" id="search_modal.html">
	<div 
		class="search_container overlay_container" 
		overlay-close-dir="viewingOverlay" 
		overlay-close-func="closeOverlay()" 
	>
		<form class="search_form form-inline" ng-submit="submitSearch()" name="search_modal_form">
			<input name="search" type="text" ng-model="searchValue" placeholder="Search" input-focus-dir="true" />
			<button type="submit" class="btn btn-primary">Submit</button>
			<button class="search_close overlay_close" ng-click="closeOverlay()">
				<span class="fui-cross"></span>
			</button>
		</form>
	</div>
</script>