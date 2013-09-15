<script type="text/ng-template" id="user.html">
	<article class="container user" pull-down-to-window-dir ng-show="!notFoundError">
		<header class="user_header page-header">
			<h1 class="user_heading"><a ng-href="users/{{user.id}}/{{user.usernameUrl}}">{{user.username}}</a></h1>
			<button class="edit_profile_button" ng-click="openEditProfile()" ng-show="loggedInAndOwns"><span class="fui-new"></span> Edit Profile</button>
		</header>
		<div class="user_item">
			<div class="user_avatar">
				<img ng-src="{{user.avatar}}?s=184&d=mm" />
			</div>
			<div class="user_information">
				<ul>
					<li>Name: {{user.username}}</li>
					<li>Type: {{user.type}}</li>
					<li ng-show="user.operatingSystem">Operating System: {{user.operatingSystem}}</li>
					<li ng-show="user.age">Age: {{user.age}}</li>
					<li ng-show="user.gender">Gender: {{user.gender}}</li>
					<li>Date Joined: {{user.createdOn}}</li>
				</ul>
				<span><a ng-href="?author={{user.id}}">View {{user.username}}'s Public Ideas.</a></span>
			</div>
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