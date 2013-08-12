<script type="text/ng-template" id="about.html">
	<div class="container">
		<p>This is the about page</p>
		<div>
			<form ng-submit="doSomething()">
				<label for="search"><span class="fui-search"></span></label>
				<input id="search" name="search" type="text" ng-model="searchTag" placeholder="Search" ng-change="doSomething()"></input>
			</form>
		</div>
	</div>
</script>