<script type="text/ng-template" id="developer_contact.html">
	<article class="container developer_contact">
		<header class="developer_contact_header page-header">
			<h1>Contact Author</h1>
		</header>
		<form class="form-horizontal" ng-submit="submitContact()" name="developer_contact">
			<div 
				class="control-group" 
				ng-class="{
					error: developer_contact.contact_message.$invalid && developer_contact.contact_message.$dirty
				}"
			>
				<label class="control-label" for="contact_message">Message:</label>
				<div class="controls">
					<textarea 
						id="contact_message" 
						class="input-block-level" 
						name="contact_message" 
						ng-model="contactMessage" 
						rows="6" 
						ng-minlength="16" 
						ng-maxlength="13500" 
						required
					></textarea>
					<span class="help-block" ng-show="developer_contact.contact_message.$error.required">Required</span>
					<span class="help-block" ng-show="developer_contact.contact_message.$error.minlength">Message is too short.</span>
					<span class="help-block" ng-show="developer_contact.contact_message.$error.maxlength">Message is too long.</span>
				</div>
			</div>
			<div class="validation_errors text-center" ng-show="validationErrors">
				<em class="text-warning">Oops! Please fix up these errors:</em>
				<ul>
					<li class="alert alert-error" ng-repeat="error in validationErrors">{{error}}</li>
				</ul>
			</div>
			<div class="success_submit alert alert-success text-center" ng-show="successSubmit">
				Successfully sent message!
			</div>
			<div class="form-actions">
				<button type="submit" class="btn btn-primary">Send to Author</button>
			</div>
		</form>
	</article>
</script>