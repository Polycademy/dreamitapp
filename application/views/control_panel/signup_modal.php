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
						ng-maxlength="100" 
						required 
					/>
					<span class="help-block" ng-show="signup_form.username.$error.required">Required</span>
					<span class="help-block" ng-show="signup_form.username.$error.minlength">Username is too short.</span>
					<span class="help-block" ng-show="signup_form.username.$error.maxlength">Username is too long.</span>
				</div>
			</div>
			<div 
				class="control-group" 
				ng-class="{
					error: signup_form.email_message.$invalid && signup_form.email_message.$dirty
				}"
			>
				<label class="control-label" for="email">Email:</label>
				<div class="controls">
					<input 
						type="email" 
						id="email" 
						class="input-block-level" 
						name="email" 
						ng-model="email" 
						ng-maxlength="100" 
						required 
					/>
					<span class="help-block" ng-show="signup_form.email.$error.required">Required</span>
					<span class="help-block" ng-show="signup_form.email.$error.email">Enter a valid email.</span>
					<span class="help-block" ng-show="signup_form.email.$error.maxlength">Email is too long.</span>
				</div>
			</div>
			<div 
				class="control-group" 
				ng-class="{
					error: signup_form.password_message.$invalid && signup_form.password_message.$dirty
				}"
			>
				<label class="control-label" for="password">Password:</label>
				<div class="controls">
					<input 
						type="password" 
						id="password" 
						class="input-block-level" 
						name="password" 
						ng-model="password" 
						ng-minlength="8" 
						ng-maxlength="32" 
						required 
					/>
					<span class="help-block" ng-show="signup_form.password.$error.required">Required</span>
					<span class="help-block" ng-show="signup_form.password.$error.minlength">Password is too short.</span>
					<span class="help-block" ng-show="signup_form.password.$error.maxlength">Password is too long.</span>
				</div>
			</div>
			<div class="control-group">
				<label class="control-label">Apply to be a Developer:</label>
				<div class="controls">
					<label class="radio inline">
						<input 
							type="radio" 
							name="developer" 
							ng-model="developer" 
							value="false" 
							ng-checked="true" 
						/>
						No
					</label>
					<label class="radio inline">
						<input 
							type="radio" 
							name="developer" 
							ng-model="developer" 
							value="true" 
						/>
						Yes
					</label>
					<span class="help-block">Applying to become a developer requires manual approval from Dream it App.</span>
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
				<button type="submit" class="btn btn-primary">Sign Up</button>
			</div>
		</form>
	</div>
</script>