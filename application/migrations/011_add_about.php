<?php defined('BASEPATH') OR exit('No direct script access allowed');

class Migration_add_about extends CI_Migration {

	public function up(){
		
		$this->dbforge->add_field(array(
			'content' => array(
				'type' 			=> 'TEXT',
			),
		));
		
		$this->dbforge->create_table('about');

		//original about content!
		$content = <<<'EOT'
<div class="about_intro">
	<p class="lead text-center">Dream it App is a platform for showcasing your ideas for web, mobile or tablet applications, games or software. Build your audience here!</p>
	<p><a href="http://www.dreamitapp.com">http://www.dreamitapp.com</a> is a small Australian start-up website committed to helping people turn their idea for a dream app into a reality.</p>
	<p>We stumbled upon the idea for this site when we were thinking what we would do when we came up with the idea for the next Angry Birds or Words With Friends.  The idea for the killer app hasn't come yet, so in the meantime we've set up www.dreamitapp.com to help all the people out there (like you!) who have a lot more creativity and brighter ideas than we do.</p>
	<p>Check out our <a href="about#faq">FAQs</a> to learn more about what we do, or drop us a line using the <a href="about#contact_us">contact us form</a>.</p>
</div>
<div class="about_social">
	<div class="row-fluid">
		<div class="span6">
			<a href="https://www.facebook.com/Dreamitapp" target="_blank">
				<img src="img/fb.png" />
				<span><strong>Like us on Facebook</strong></span>
			</a>
		</div>
		<div class="span6">
			<a href="https://twitter.com/LetsDreamItApp" target="_blank">
				<img src="img/twitter.png" />
				<span><strong>Follow us on Twitter</strong></span>
			</a>
		</div>
	</div>
</div>
<div class="about_features">
	<p class="lead text-center">Here's how we can help:</p>
	<div class="row-fluid" equalise-heights-dir=".feature_box">
		<div class="span4 feature_box">
			<h3 class="text-center">Add Ideas</h3>
			<img class="feature_image" src="img/add_idea_icon.png" />
			<p>If you have an idea, add it here.  Think of a catchy name, upload an image and give us a description.  You can set the privacy settings - set the idea free and make it public, or keep it to yourself and our participating developers.</p>
		</div>
		<div class="span4 feature_box">
			<h3 class="text-center">Gain Feedback</h3>
			<div class="feature_image"><span class="fui-chat"></span></div>
			<p>If you have submitted an idea - check the comments and likes. Share the idea with your friends and enlist their support - the most popular ones goes to top.  Find ideas you like and leave comments and likes - your comments can help another person improve their idea.</p>
		</div>
		<div class="span4 feature_box">
			<h3 class="text-center">Contact Developers</h3>
			<div class="feature_image"><span class="fui-user"></span></div>
			<p>Developers can get in contact with you if your idea is interesting, or you can browse developer profiles.</p>
		</div>
	</div>
</div>
<div id="faq" class="about_faq">
	<p class="lead text-center">FAQ</p>
	<h4>I have an Idea:</h4>
	<dl>
		<dt>Why post an idea?</dt>
		<dd>
			<p>To receive feedback, gain popularity and test the market.</p>
			<p>By posting an idea on www.dreamitapp.com, you are putting that idea in front of our participating developers who will be able to look at the idea and contact you if they are interested in working with you to turn your dream idea into reality.</p>
			<p>You can post your idea as a public idea, visible to anyone who visits www.dreamitapp.com, or you can keep your idea to yourself and share only with participating developers.</p>
			<p>Best of all, it's free to post an idea and all our participating developers have committed to keeping your ideas private and not using any information that you post without your agreement.</p>
		</dd>
		<dt>Why would I make my idea public?</dt>
		<dd>
			<p>Setting an idea free is often the best way to test the idea. .</p>
			<p>If you have an existing business, posting a public idea is great way to see if an app would assist in supporting and expanding your services and to find out from users what features such an app should have. You can post your idea on www.dreamitapp.com and alert your existing customers through your Facebook page or Twitter account. .</p>
			<p>If you are involved in a sporting or social club, you can post a public idea to see if your members would use an app and to find out from members what features they would most like to see. .</p>
			<p>You can also suggest an app that you think would be great for someone else to make, for example, your local council or a favourite charity. Put your idea on www.dreamitapp.com, gather support and votes and use weight of numbers to get your app made. .</p>
			<p>Of course, you can also just post that crazy thought you had while playing with your phone on the bus. Be the envy of your friends by having the most popular idea on the site. .</p>
		</dd>
		<dt>Will my idea be stolen?</dt>
		<dd>
			<p>Our reputation and success, and that of our participating developers, depends on keeping you, the user, happy with our services. .</p>
			<p>All our participating developers have committed to keeping your ideas private and not using any information that you post without your agreement. .</p>
			<p>Of course, someone may have had the same idea as yours independently of you putting it on the site. If they beat you to the idea, we can’t help with that, so the sooner you submit your idea and get it made, the better. .</p>
		</dd>
		<dt>Who are your participating developers?</dt>
		<dd>
			<p><a href="www.dreamitapp.com">www.dreamitapp.com</a> is putting together a group of professional, Australian app development companies that will become our participating developers.  As we are a new site, this is an ongoing process, so please check back regularly for more information.</p>
			<p>If you are a developer and are interested in hearing more about how becoming a participating developer can benefit your business, please contact us.</p>
		</dd>
		<dt>What happens if a developer wants to make my idea?</dt>
		<dd>
			<p>First of all, congratulations!</p>
			<p>If a developer wants to make your idea, you will receive an email from them.</p>
			<p>At this point, our work as matchmaker is done and www.dreamitapp.com will leave you and the developer alone to get on with the business of making your app.</p>
		</dd>
	</dl>
	<h4>Developers:</h4>
	<dl>
		<dt>Why would I sign up?</dt>
		<dd>
			<p>There is a vast amount of creativity out there, just waiting for someone to tap into it. Not everyone who has an idea has the skills, contacts or money to make it a reality and that’s when they come to us. .</p>
			<p>People who submit ideas are likely to be passionate about their ideas, providing you with the perfect partner to not only test the app as you develop it, but also to promote it once it's made. .</p>
			<p>Users who sign up to www.dreamitapp.com can also opt in to receive marketing messages from our participating developers as well as being contacted about being beta testers. .</p>
			<p>By signing up as a participating developer, you will have access to a wide range of new and exciting ideas and an engaged community that will help you build better apps and promote your business. .</p>
			<p>So contact us to find out more information about how you can be part of the exciting www.dreamitapp.com community. .</p>
		</dd>
	</dl>
</div>
<div class="about_team">
	<p class="lead text-center">Check out the team behind this project:</p>
	<div class="row-fluid">
		<div class="span6 team_profile">
			<div class="pull-left">
				<img class="feature_image" src="http://gravatar.com/avatar/ea59014d56405353525324386464727d?s=100&d=mm" />
			</div>
			<p class="pull-left">Stephen Kiley - Founder</p>
		</div>
		<div class="span6 team_profile">
			<div class="pull-left">
				<img class="feature_image" src="http://gravatar.com/avatar/98a347823cd1db90af884b227a29c29e?s=100&d=mm" />
			</div>
			<p class="pull-left">Roger Qiu - Main Developer of Dream it App.</p>
		</div>
	</div>
</div>
<div id="contact_us" class="contact_us">
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
				<strong>Dream It App</strong><br />
				Canberra, ACT, Australia 2207<br />
				<a href="http://www.google.com/recaptcha/mailhide/d?k=01tyFUYoi_uljLTnYwm8PjNw==&amp;c=cEtnOpuczwpTcmuH77s-v-Al2TCHa0CIijKGvrFjUxw=" onclick="window.open('http://www.google.com/recaptcha/mailhide/d?k\07501tyFUYoi_uljLTnYwm8PjNw\75\75\46c\75cEtnOpuczwpTcmuH77s-v-Al2TCHa0CIijKGvrFjUxw\075', '', 'toolbar=0,scrollbars=0,location=0,statusbar=0,menubar=0,resizable=0,width=500,height=300'); return false;" title="Reveal this e-mail address">inf...@dreamitapp.com</a>
			</address>
		</div>
	</div>
</div>
<div id="tac" class="about_tac">
	<p class="lead text-center">Terms and Conditions</p>
	<section>
		<h5>General terms and conditions</h5>
		<p>All content is the sole responsibility of the person who originated such content. www.dreamitapp.com takes no responsibility for content posted to www.dreamitapp.com.</p>
		<p>www.dreamitapp.com does not endorse, support, represent or guarantee the completeness, truthfulness, accuracy, or reliability of any ideas or information posted on www.dreamitapp.com or endorse any opinions or ideas expressed by users on www.dreamitapp.com.  You understand that by registering on www.dreamitapp.com, you may be exposed to information that might be offensive, harmful, inaccurate or otherwise inappropriate.</p>
		<p>Under no circumstances will www.dreamitapp.com be liable in any way for any information, including, but not limited to, any errors or omissions, or any loss or damage of any kind incurred as a result of the use of any information or ideas made available via www.dreamitapp.com.</p>
	</section>
	<section>
		<h5>Submitting an idea on www.dreamitapp.com</h5>
		<p>By submitting an idea to www.dreamitapp.com.au, you agree to the following terms and conditions.</p>
		<dl>
			<dt>All ideas</dt>
			<dd>
				<p>Submitting an idea does not guarantee that you will be contacted by a developer or that your idea will be developed.</p>
				<p>www.dreamitapp.com reserves the right to remove app ideas from the website at its absolute discretion</p>
			</dd>
			<dt>Public ideas</dt>
			<dd>
				<p>Ideas submitted as public ideas will be displayed on www.dreamitapp.com and will be visible to anyone.  All people who are registered with www.dreamitapp.com will be able to vote on public ideas.</p>
				<p>Nothing precludes a participating developer, www.dreamitapp.com or any other third party from developing a public idea without your involvement.</p>
			</dd>
			<dt>Private ideas</dt>
			<dd>
				<p>Private ideas will only be visible to:</p>
				<ul>
					<li>www.dreamitapp.com; and</li>
					<li>participating developers</li>
				</ul>
			</dd>
		</dl>
	</section>
	<section>
		<h5>App development - Private ideas</h5>
		<p>By submitting a private idea, you agree to allow participating developers to contact you with regards to the possible development of your app.  You and participating developers will be responsible for negotiating and entering into an agreement to develop an idea.</p>
		<p>www.dreamitapp.com is not a party to an agreement between yourself and a participating developer.</p>
		<p>If you and a participating developer agree to develop an idea, you can remove the idea from www.dreamitapp.com to ensure it is no longer visible to other participating developers.</p>
		<p>www.dreamitapp.com takes no responsibility if an idea is developed without your agreement.</p>
		<p>Submitting an idea to www.dreamitapp.com does not guarantee no one else will develop that idea.  If a participating developer, or anyone else, had an idea similar to yours independently of you posting your idea on www.dreamitapp.com, nothing precludes them from developing that idea without your involvement.</p>
	</section>
</div>
<div class="about_minor text-center">
	<small class="muted"><?= $copyright ?></small>
	<br />
	<small class="muted">Dream it App was handmade at <a href="http://polycademy.com">Polycademy</a></small>
</div>
EOT;

		$this->db->insert('about', array(
			'content'	=> $content,
		));

	}

	public function down(){
	
		$this->dbforge->drop_table('about');
	
	}
}