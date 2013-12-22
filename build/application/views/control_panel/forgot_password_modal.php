<script type="text/ng-template" id="forgot_password_modal.html">
	<div class="signin_container">
		<header class="signin_header page-header">
			<h3>Forgot Password</h3>
			<button class="signin_close overlay_close" ng-click="closeOverlay()">
				<span class="fui-cross"></span>
			</button>
		</header>
		<form class="signin_form" ng-submit="submitForgottenPassword()" name="forgotten_password">
			<div 
				class="control-group" 
				ng-class="{
					error: forgotten_password.email.$invalid && forgotten_password.email.$dirty
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
					<span class="help-block" ng-show="forgotten_password.email.$error.required">Required</span>
					<span class="help-block" ng-show="forgotten_password.email.$error.email">Enter a valid email.</span>
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
				<button type="submit" class="btn btn-primary">Send Forgotten Password Email</button>
			</div>
		</form>
	</div>
</script>