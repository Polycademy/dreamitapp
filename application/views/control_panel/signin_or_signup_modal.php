<script type="text/ng-template" id="signin_or_signup_modal.html">
	<div class="signin_container">
		<header class="signin_header page-header">
			<h3>To comment or like an idea, please register or sign in if you are already a member</h3>
			<button class="signin_close overlay_close" ng-click="closeOverlay()">
				<span class="fui-cross"></span>
			</button>
		</header>
		<div class="signin_or_signup_actions">
			<button type="button" class="btn btn-primary signin_or_signup_buttons" ng-click="openSignIn()">Sign In</button>
			<button type="button" class="btn btn-primary signin_or_signup_buttons" ng-click="openSignUp()">Sign Up</button>
		</div>
	</div>
</script>