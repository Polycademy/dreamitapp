<script type="text/ng-template" id="about.html">
	<article class="container about" pull-down-to-window-dir>
		<header class="about_header page-header">
			<h1>Welcome to Dream it App</h1>
		</header>
		<div class="about_content">
			<div class="about_intro">
				<p class="lead text-center">Dream it App is a platform for showcasing your ideas for web, mobile or tablet applications, games or software. Build your audience here!</p>
				<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet. Duis sagittis ipsum. Praesent mauris. Fusce nec tellus sed augue semper porta. Mauris massa. Vestibulum lacinia arcu eget nulla. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Curabitur sodales ligula in libero. </p>
				<p>Sed dignissim lacinia nunc. Curabitur tortor. Pellentesque nibh. Aenean quam. In scelerisque sem at dolor. Maecenas mattis. Sed convallis tristique sem. Proin ut ligula vel nunc egestas porttitor. Morbi lectus risus, iaculis vel, suscipit quis, luctus non, massa. Fusce ac turpis quis ligula lacinia aliquet. Mauris ipsum. </p>
				<p>Nulla metus metus, ullamcorper vel, tincidunt sed, euismod in, nibh. Quisque volutpat condimentum velit. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Nam nec ante. Sed lacinia, urna non tincidunt mattis, tortor neque adipiscing diam, a cursus ipsum ante quis turpis. Nulla facilisi. Ut fringilla. Suspendisse potenti. Nunc feugiat mi a tellus consequat imperdiet. Vestibulum sapien. Proin quam. </p>
			</div>
			<div class="about_features">
				<p class="lead text-center">Here's how we can help:</p>
				<div class="row-fluid" equalise-heights-dir=".feature_box">
					<div class="span4 feature_box">
						<h3 class="text-center">Add Ideas</h3>
						<img class="feature_image" src="img/add_idea_icon.png" />
						<p>You can add ideas, and use markdown for description. You can also set the privacy settings. One image is allowed for the main image.</p>
					</div>
					<div class="span4 feature_box">
						<h3 class="text-center">Gain Feedback</h3>
						<div class="feature_image"><span class="fui-chat"></span></div>
						<p>Check the comments and likes. Get your friends to like them, the most popular ones goes to top.</p>
					</div>
					<div class="span4 feature_box">
						<h3 class="text-center">Contact Developers</h3>
						<div class="feature_image"><span class="fui-user"></span></div>
						<p>Developers can get in contact with you if your idea is interesting, or you can browse developer profiles.</p>
					</div>
				</div>
			</div>
			<div class="about_team">
				<p class="lead text-center">Check out the team behind this project:</p>
				<div class="row-fluid">
					<div class="span6 team_profile">
						<div class="pull-left">
							<img class="feature_image" src="http://gravatar.com/avatar/98a347823sd1db90af884b227a29c29e?s=100&d=mm" />
						</div>
						<p class="pull-left">Stephen Kiley - Description</p>
					</div>
					<div class="span6 team_profile">
						<div class="pull-left">
							<img class="feature_image" src="http://gravatar.com/avatar/98a347823cd1db90af884b227a29c29e?s=100&d=mm" />
						</div>
						<p class="pull-left">Roger Qiu - Main Developer of Dream it App.</p>
					</div>
				</div>
			</div>
			<div class="contact_us">
				<p class="lead text-center">Contact Us:</p>
				<div class="row-fluid">
					<div class="span6 contact_details">
						<form class="form-horizontal" ng-submit="submitContact()" name="contact_us_form">
							<div 
								class="control-group" 
								ng-class="{
									error: contact_us_form.contact_message.$invalid && contact_us_form.contact_message.$dirty
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
									<span class="help-block" ng-show="contact_us_form.contact_message.$error.required">Required</span>
									<span class="help-block" ng-show="contact_us_form.contact_message.$error.minlength">Message is too short.</span>
									<span class="help-block" ng-show="contact_us_form.contact_message.$error.maxlength">Message is too long.</span>
								</div>
							</div>
							<div 
								class="control-group" 
								ng-class="{
									error: contact_us_form.contact_email.$invalid && contact_us_form.contact_email.$dirty
								}"
							>
								<label class="control-label" for="contact_email">Email:</label>
								<div class="controls">
									<input 
										id="contact_email" 
										class="input-block-level" 
										type="email" 
										name="contact_email" 
										ng-model="contactEmail" 
										required 
									/>
									<span class="help-block" ng-show="contact_us_form.contact_email.$error.required">Required</span>
									<span class="help-block" ng-show="contact_us_form.contact_email.$error.email">Enter a valid email.</span>
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
								<button type="submit" class="btn btn-primary">Send</button>
							</div>
						</form>
					</div>
					<div class="span6 contact_details">
						<address class="text-center">
							<strong>Dream it App</strong><br />
							795 Folsom Street<br />
							Canberra, ACT, Australia 2207<br />
							<abbr title="Phone">P:</abbr> (123) 456-7890<br />
							<a href="http://www.google.com/recaptcha/mailhide/d?k=01ebDHQgYSQIgO98BBkNl3Iw==&amp;c=3jlSO61bF3OS40LW0BlSJfhS_gKpl9U6QfBANh2YGXE=" onclick="window.open('http://www.google.com/recaptcha/mailhide/d?k\07501ebDHQgYSQIgO98BBkNl3Iw\75\75\46c\0753jlSO61bF3OS40LW0BlSJfhS_gKpl9U6QfBANh2YGXE\075', '', 'toolbar=0,scrollbars=0,location=0,statusbar=0,menubar=0,resizable=0,width=500,height=300'); return false;" title="Reveal this e-mail address">deve...@dreamitapp.com</a>
						</address>
					</div>
				</div>
			</div>
			<div class="about_minor text-center">
				<small class="muted">&copy; Dream it App 2013</small>
				<br />
				<small class="muted">Dream it App was handmade at <a href="http://polycademy.com">Polycademy</a></small>
			</div>
		</div>
	</article>
</script>