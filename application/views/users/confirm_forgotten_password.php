<script type="text/ng-template" id="confirm_forgotten_password.html">
	<article class="container user" pull-down-to-window-dir ng-show="!notFoundError">
		<header class="user_header page-header">
			<h1 class="user_heading">Resetting Forgotten Password</h1>
		</header>
		<div class="user_item">
			<form class="edit_user_form form-horizontal" ng-submit="resetPassword()" name="reset_password_form">
				<div class="edit_user_form_internal">
					<div 
						class="control-group" 
						ng-class="{
							error: reset_password_form.password.$invalid && reset_password_form.password.$dirty
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
							/>
							<span class="help-block" ng-show="reset_password_form.password.$error.minlength">Password is too short.</span>
							<span class="help-block" ng-show="reset_password_form.password.$error.maxlength">Password is too long.</span>
						</div>
					</div>
					<div 
						class="control-group" 
						ng-class="{
							error: reset_password_form.passwordConfirm.$invalid && reset_password_form.passwordConfirm.$dirty
						}"
					>
						<label class="control-label" for="passwordConfirm">Password Confirm:</label>
						<div class="controls">
							<input 
								type="password" 
								id="passwordConfirm" 
								class="input-block-level" 
								name="passwordConfirm" 
								ng-model="passwordConfirm" 
								ng-minlength="8" 
								ng-maxlength="32" 
							/>
							<span class="help-block" ng-show="reset_password_form.passwordConfirm.$error.minlength">Password Confirm is too short.</span>
							<span class="help-block" ng-show="reset_password_form.passwordConfirm.$error.maxlength">Password Confirm is too long.</span>
						</div>
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
					<button type="submit" class="btn btn-large btn-block btn-primary">Reset Password</button>
				</div>
			</form>
		</div>
	</article>
	<article class="container user" pull-down-to-window-dir ng-show="notFoundError">
		<header class="page-header">
			<div class="alert alert-error alert-block">
				<h1>404 Error!</h1>
				{{notFoundError}}
			</div>
		</header>
	</article>
</script>