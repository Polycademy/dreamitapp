<script type="text/ng-template" id="signin_or_signup_modal.html">
	<div class="signin_or_signup_container">
		<header class="signin_or_signup_header page-header">
			<h3>To comment or like an idea, please register or sign in if you are already a member</h3>
			<button class="signin_or_signup_close overlay_close" ng-click="closeOverlay()">
				<span class="fui-cross"></span>
			</button>
		</header>
		<div class="signin_or_signup_actions">
			<a ng-href="{{'users/signin' + redirect}}" class="btn btn-primary signin_or_signup_buttons">Sign In</a>
			<a ng-href="{{'users/signup' + redirect}}" class="btn btn-primary signin_or_signup_buttons">Register</a>
		</div>
	</div>
</script>