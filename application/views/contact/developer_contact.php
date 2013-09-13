<script type="text/ng-template" id="developer_contact.html">
	<div class="developer_contact_container">
		<header class="developer_contact_header page-header">
			<h3>Contact {{author}}</h3>
			<button class="developer_contact_close overlay_close" ng-click="closeOverlay()">
				<span class="fui-cross"></span>
			</button>
		</header>
		<form class="developer_contact_form" ng-submit="submitContact()" name="developer_contact">
			<div 
				class="control-group" 
				ng-class="{
					error: developer_contact.contact_message.$invalid && developer_contact.contact_message.$dirty
				}"
			>
				<div class="controls">
					<textarea 
						class="input-block-level" 
						name="contact_message" 
						ng-model="contactMessage" 
						rows="4" 
						ng-minlength="100" 
						ng-maxlength="13500" 
						placeholder="Write Email..."
						required
					></textarea>
					<span class="help-block" ng-show="developer_contact.contact_message.$error.minlength">Message is too short, write at least 100 characters.</span>
					<span class="help-block" ng-show="developer_contact.contact_message.$error.maxlength">Message is too long, write less than 2000 words.</span>
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