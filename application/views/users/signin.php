<script type="text/ng-template" id="signin.html">
	<div 
		class="signin_container"
		ng-class="{'overlay_container': viewingOverlay, 'container': !viewingOverlay}"
		overlay-close-dir="viewingOverlay" 
		overlay-close-func="closeOverlay()" 
		pull-down-to-window-dir
	>
		<header class="signin_header page-header">
			<h3 class="signin_heading"><a href="users/signin">Sign In</a></h3>
			<button 
				class="signin_close overlay_close" 
				ng-click="closeOverlay()" 
				ng-show="viewingOverlay"
			>
				<span class="fui-cross"></span>
			</button>
		</header>
		<form class="signin_form form-horizontal" ng-submit="submitSignIn()" name="signin_form">
			<div 
				class="control-group" 
				ng-class="{
					error: signin_form.email.$invalid && signin_form.email.$dirty
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
						required 
					/>
					<span class="help-block" ng-show="signin_form.email.$error.required">Required</span>
					<span class="help-block" ng-show="signin_form.email.$error.email">Enter a valid email.</span>
				</div>
			</div>
			<div 
				class="control-group" 
				ng-class="{
					error: signin_form.password.$invalid && signin_form.password.$dirty
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
						required 
					/>
					<span class="help-block" ng-show="signin_form.password.$error.required">Required</span>
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
				<button type="submit" class="btn btn-primary">Sign In</button>
				<button type="button" class="btn btn-info" facebook-login-dir facebook-overlay-close="finishSignIn()">Sign In via Facebook</button>
				<button type="button" class="btn btn-info" ng-click="forgotPassword()">Forgot Password</button>
			</div>
		</form>
	</div>
</script>