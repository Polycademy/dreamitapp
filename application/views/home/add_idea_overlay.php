<script type="text/ng-template" id="add_idea_overlay.html">
	<div class="add_idea_container" overlay-dir>
		<button class="idea_close" ng-click="closeOverlay()"><span class="fui-cross"></span></button>
		<form class="form-horizontal" ng-submit="submitIdea()">
			<fieldset>
				<legend>Add a New Idea</legend>
				<div class="control-group">
					<label class="control-label" for="add_idea_title">Title:</label>
					<div class="controls">
						<input type="text" id="add_idea_title" required></input>
					</div>
				</div>
				<div class="control-group">
					<label class="control-label" for="add_idea_short_description">Short Description:</label>
					<div class="controls">
						<input type="text" id="add_idea_short_description" required></input>
						<span class="help-block">This will be shown on the home page wall. Write up to 40 words.</span>
					</div>
				</div>
				<div class="control-group">
					<button class="add_idea_image_button btn btn-info" type="button">Add an Image</button>
				</div>
				<div class="control-group">
					<label class="control-label" for="add_idea_description">Description:</label>
					<div class="controls">
						<textarea id="add_idea_description" required></textarea>
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
				<div class="form-actions">
					<button type="submit" class="btn btn-primary">Add Idea</button>
					<button type="button" class="btn" ng-click="closeOverlay()">Cancel</button>
				</div>
			</fieldset>
		</form>
	</div>
</script>