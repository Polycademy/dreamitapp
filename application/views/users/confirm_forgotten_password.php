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
							error: reset_password_form.newPassword.$invalid && reset_password_form.newPassword.$dirty
						}"
					>
						<label class="control-label" for="newPassword">New Password:</label>
						<div class="controls">
							<input 
								type="password" 
								id="newPassword" 
								class="input-block-level" 
								name="newPassword" 
								ng-model="newPassword" 
								ng-minlength="8" 
								ng-maxlength="32" 
								required
							/>
							<span class="help-block" ng-show="reset_password_form.newPassword.$error.required">Required</span>
							<span class="help-block" ng-show="reset_password_form.newPassword.$error.minlength">Password is too short.</span>
							<span class="help-block" ng-show="reset_password_form.newPassword.$error.maxlength">Password is too long.</span>
						</div>
					</div>
					<div 
						class="control-group" 
						ng-class="{
							error: reset_password_form.newPasswordConfirm.$invalid && reset_password_form.newPasswordConfirm.$dirty
						}"
					>
						<label class="control-label" for="newPasswordConfirm">New Password Confirm:</label>
						<div class="controls">
							<input 
								type="password" 
								id="newPasswordConfirm" 
								class="input-block-level" 
								name="newPasswordConfirm" 
								ng-model="newPasswordConfirm" 
								ng-minlength="8" 
								ng-maxlength="32" 
								required
							/>
							<span class="help-block" ng-show="reset_password_form.newPasswordConfirm.$error.required">Required</span>
							<span class="help-block" ng-show="reset_password_form.newPasswordConfirm.$error.minlength">New Password Confirm is too short.</span>
							<span class="help-block" ng-show="reset_password_form.newPasswordConfirm.$error.maxlength">New Password Confirm is too long.</span>
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