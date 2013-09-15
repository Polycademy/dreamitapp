<script type="text/ng-template" id="edit_user.html">
	<div 
		class="edit_user_container" 
		ng-class="{'overlay_container': viewingOverlay, 'container': !viewingOverlay}"
		overlay-close-dir="viewingOverlay" 
		overlay-close-func="closeOverlay()" 
		pull-down-to-window-dir 
		ng-show="!notFoundError"
	>
		<header class="edit_user_header">
			<h1 class="edit_user_heading">Edit User</h1>
			<button 
				class="edit_user_close overlay_close" 
				ng-click="closeOverlay()" 
				ng-show="viewingOverlay"
			>
				<span class="fui-cross"></span>
			</button>
		</header>
		<form class="edit_user_form form-horizontal" ng-submit="submitUser()" name="edit_user_form">
			<div class="edit_user_form_internal">
				<div 
					class="control-group" 
					ng-class="{
						error: edit_user_form.username.$invalid && edit_user_form.username.$dirty
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
						/>
						<span class="help-block" ng-show="edit_user_form.username.$error.minlength">Username is too short.</span>
						<span class="help-block" ng-show="edit_user_form.username.$error.maxlength">Username is too long.</span>
					</div>
				</div>
				<div 
					class="control-group" 
					ng-class="{
						error: edit_user_form.email.$invalid && edit_user_form.email.$dirty
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
							ng-minlength="2" 
							ng-maxlength="100" 
						/>
						<span class="help-block" ng-show="edit_user_form.email.$error.email">Enter a valid email.</span>
						<span class="help-block" ng-show="edit_user_form.email.$error.maxlength">Email is too long.</span>					</div>
				</div>
				<div 
					class="control-group" 
					ng-class="{
						error: edit_user_form.password.$invalid && edit_user_form.password.$dirty
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
						<span class="help-block" ng-show="edit_user_form.password.$error.minlength">Password is too short.</span>
						<span class="help-block" ng-show="edit_user_form.password.$error.maxlength">Password is too long.</span>
					</div>
				</div>
				<div 
					class="control-group" 
					ng-class="{
						error: edit_user_form.passwordConfirm.$invalid && edit_user_form.passwordConfirm.$dirty
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
						<span class="help-block" ng-show="edit_user_form.passwordConfirm.$error.minlength">Password Confirm is too short.</span>
						<span class="help-block" ng-show="edit_user_form.passwordConfirm.$error.maxlength">Password Confirm is too long.</span>
					</div>
				</div>
				<div 
					class="control-group" 
					ng-class="{
						error: edit_user_form.phone.$invalid && edit_user_form.phone.$dirty
					}"
				>
					<label class="control-label" for="phone">Phone:</label>
					<div class="controls">
						<input 
							type="text" 
							id="phone" 
							class="input-block-level" 
							name="phone" 
							ng-model="phone" 
							ng-maxlength="40" 
						/>
						<span class="help-block" ng-show="edit_user_form.phone.$error.maxlength">Phone number is too long.</span>
					</div>
				</div>
				<div 
					class="control-group" 
					ng-class="{
						error: edit_user_form.operatingSystem.$invalid && edit_user_form.operatingSystem.$dirty
					}"
				>
					<label class="control-label" for="operatingSystem">Operating System:</label>
					<div class="controls">
						<input 
							type="text" 
							id="operatingSystem" 
							class="input-block-level" 
							name="operatingSystem" 
							ng-model="operatingSystem" 
							ng-maxlength="40" 
						/>
						<span class="help-block" ng-show="edit_user_form.operatingSystem.$error.maxlength">Operating System is too long.</span>
					</div>
				</div>
				<div 
					class="control-group" 
					ng-class="{
						error: edit_user_form.age.$invalid && edit_user_form.age.$dirty
					}"
				>
					<label class="control-label" for="age">Age:</label>
					<div class="controls">
						<input 
							type="text" 
							id="age" 
							class="input-block-level" 
							name="age" 
							ng-model="age" 
							ng-maxlength="3" 
						/>
						<span class="help-block" ng-show="edit_user_form.age.$error.maxlength">Age is too old.</span>
					</div>
				</div>
				<div class="control-group">
					<label class="control-label">Gender:</label>
					<div class="controls">
						<label class="radio inline">
							<input 
								type="radio" 
								name="male" 
								ng-model="gender" 
								value="male" 
							/>
							Male
						</label>
						<label class="radio inline">
							<input 
								type="radio" 
								name="female" 
								ng-model="gender" 
								value="female" 
							/>
							Female
						</label>
						<label class="radio inline">
							<input 
								type="radio" 
								name="other" 
								ng-model="gender" 
								value="other" 
							/>
							Other
						</label>
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
				<button type="submit" class="btn btn-large btn-block btn-primary">Edit User</button>
				<button type="button" class="btn btn-large btn-block btn-danger" ng-click="deleteUser()">Delete User (Irreversible)</button>
			</div>
		</form>
	</div>
	<div 
		class="edit_user_container" 
		ng-class="{'overlay_container': viewingOverlay, 'container': !viewingOverlay}" 
		pull-down-to-window-dir 
		overlay-close-dir="viewingOverlay" 
		overlay-close-func="closeOverlay()" 
		ng-show="notFoundError"
	>
		<header class="page-header">
			<div class="alert alert-error alert-block">
				<h1>404 Error!</h1>
				{{notFoundError}}
			</div>
		</header>
	</div>
</script>