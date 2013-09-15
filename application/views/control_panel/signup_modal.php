<script type="text/ng-template" id="signup_modal.html">
	<div 
		class="signup_container overlay_container" 
		overlay-close-dir="viewingOverlay" 
		overlay-close-func="closeOverlay()" 
	>
		<form class="signup_form form-horizontal" ng-submit="submitSignUp()" name="signup_form">
			<div 
				class="control-group" 
				ng-class="{
					error: signup_form.username_message.$invalid && signup_form.username_message.$dirty
				}"
			>
				<label class="control-label" for="username">Username:</label>
				<div class="controls">
					<input 
						type="text" 
						id="username" 
						class="input-block-level" 
						name="username" 
						ng-model="username" 
						ng-minlength="2" 
						ng-maxlength="30" 
						required 
					/>
					<span class="help-block" ng-show="signup_form.username.$error.required">Required</span>
					<span class="help-block" ng-show="signup_form.username.$error.minlength">Username is too short.</span>
					<span class="help-block" ng-show="signup_form.username.$error.maxlength">Username is too long.</span>
				</div>
			</div>

			
			<div class="validation_errors text-center" ng-show="validationErrors">
				<em class="text-warning">Oops! Please fix up these errors:</em>
				<ul>
					<li class="alert alert-error" ng-repeat="error in validationErrors">{{error}}</li>
				</ul>
			</div>
			<div class="success_submit alert alert-success text-center" ng-show="successSubmit">
				{{successSubmit}}
			</div>
			<div class="form-actions">
				<button type="submit" class="btn btn-primary">Send Message</button>
			</div>
		</form>
	</div>
</script>