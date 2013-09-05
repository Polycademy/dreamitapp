<script type="text/ng-template" id="add_idea_overlay.html">
	<div class="add_idea_container" overlay-dir>
		<form class="form-horizontal" ng-submit="submitIdea()">
			<fieldset>
				<legend>Add a New Idea</legend>
				<div class="control-group">
					<label class="control-label" for="add_idea_title">Title:</label>
					<div class="controls">
						<input type="text" id="add_idea_title"></input>
					</div>
				</div>
				<div class="control-group">
					<label class="control-label" for="add_idea_short_description">Short Description:</label>
					<div class="controls">
						<input type="text" id="add_idea_short_description"></input>
					</div>
				</div>
				<div class="control-group">
					<button class="btn btn-info">Add an Image</button>
				</div>
				<div class="control-group">
					<label class="control-label" for="add_idea_description">Description:</label>
					<div class="controls">
						<textarea id="add_idea_description"></textarea>
					</div>
				</div>
				<div class="control-group">
					<p>Privacy:</p>
					<label class="radio inline">
						<input type="radio" name="add_idea_privacy" value="public" checked>
						Public
					</label>
					<label class="radio inline">
						<input type="radio" name="add_idea_privacy" value="developers">
						Developers Only
					</label>
				</div>
			</fieldset>
		</form>
	</div>
</script>