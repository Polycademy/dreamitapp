<script type="text/ng-template" id="signup.html">
	<div 
		class="signup_container overlay_container" 
		overlay-close-dir="viewingOverlay" 
		overlay-close-func="closeOverlay()" 
		pull-down-to-window-dir
	>
		<header class="signup_header page-header">
			<h3 class="signup_heading">Sign Up</h3>
			<button class="signup_close overlay_close" ng-click="closeOverlay()">
				<span class="fui-cross"></span>
			</button>
		</header>
		<form class="signup_form form-horizontal" ng-submit="submitSignUp()" name="signup_form">
			<div 
				class="control-group" 
				ng-class="{
					error: signup_form.username.$invalid && signup_form.username.$dirty
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
					error: signup_form.email.$invalid && signup_form.email.$dirty
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
					<span class="help-block">Use your email at <a href="https://en.gravatar.com/" target="_blank">Gravatar</a> in order to get an avatar at Dream it App.</span>
				</div>
			</div>
			<div 
				class="control-group" 
				ng-class="{
					error: signup_form.password.$invalid && signup_form.password.$dirty
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
				<label class="control-label">Developer Membership:</label>
				<div class="controls">
					<label class="radio inline">
						<input 
							type="radio" 
							name="developerFalse" 
							ng-model="developer" 
							value="0" 
						/>
						No
					</label>
					<label class="radio inline">
						<input 
							type="radio" 
							name="developerTrue" 
							ng-model="developer" 
							value="1" 
						/>
						Yes
					</label>
					<span class="help-block">Applying to become a developer requires manual approval from Dream it App.</span>
				</div>
			</div>
			<div class="control-group">
				<div class="controls">
					<label class="checkbox">
						<input 
							type="checkbox" 
							name="tac" 
							ng-model="tac" 
							value="true" 
							required 
						/>
						Agree to the <a href="about#tac" target="_blank">Terms and Conditions</a>.
					</label>
					<span class="help-block" ng-show="signup_form.tac.$error.required">Required</span>
				</div>
			</div>
			<div class="control-group">
				<div class="controls">
					<label class="checkbox">
						<input 
							type="checkbox" 
							name="marketingDreamitapp" 
							ng-model="marketingDreamitapp" 
							value="true" 
						/>
						Opt in to receive marketing emails from Dream it App.
					</label>
					<span class="help-block" ng-show="signup_form.marketingDreamitapp.$error.required">Required</span>
				</div>
			</div>
			<div class="control-group">
				<div class="controls">
					<label class="checkbox">
						<input 
							type="checkbox" 
							name="marketingDeveloper" 
							ng-model="marketingDeveloper" 
							value="true" 
						/>
						Opt in to receive marketing emails from participating developers.
					</label>
					<span class="help-block" ng-show="signup_form.marketingDeveloper.$error.required">Required</span>
				</div>
			</div>
			<div class="control-group">
				<div class="controls">
					<label class="checkbox">
						<input 
							type="checkbox" 
							name="marketingBeta" 
							ng-model="marketingBeta" 
							value="true" 
						/>
						Opt in to being contacted by developers about beta testing applications.
					</label>
					<span class="help-block" ng-show="signup_form.marketingBeta.$error.required">Required</span>
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
				<button type="button" class="btn btn-info" facebook-login-dir facebook-overlay-close="closeOverlay()">Sign Up via Facebook</button>
			</div>
		</form>
	</div>
</script>