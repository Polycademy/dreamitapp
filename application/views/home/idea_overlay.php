<script type="text/ng-template" id="idea_overlay.html">
	<article class="idea_overlay_container" overlay-dir pull-down-to-window-dir>
		<header class="overlay_header">
			<h1 class="overlay_heading"><a ng-href="{{idea.link}}">{{idea.title}}</a></h1>
			<button class="overlay_close" ng-click="closeOverlay()"><span class="fui-cross"></span></button>
		</header>
		<div class="overlay_content">
			<div class="overlay_inner_content">
				<img class="overlay_main_image" ng-src="{{idea.image}}" />
				<div class="overlay_description" ng-bind-html="idea.description"></div>
			</div>
			<aside class="overlay_meta">
				<div class="overlay_author">
					<img ng-src="{{idea.authorAvatar + '?s=184&d=mm'}}" />
					<span class="author_name">{{idea.author}}</span>
					<ul>
						<li>{{idea.authorType}}</li>
						<li>Links:</li>
						<li ng-repeat="link in idea.authorProfileLinks">{{link}}</li>
					</ul>
				</div>
				<div class="overlay_idea_data">
					<ul>
						<li>Submitted: {{idea.date}}</li>
						<li>Feedback: 42</li>
						<li>Likes: {{idea.likes}}</li>
						<li>Tags: 
							<ul class="overlay_tags_list">
								<li ng-repeat="tag in idea.tags">{{tag}}</li>
							</ul>
						</li>
					</ul>
				</div>
				<div class="overlay_actions">
					<a href="">Like</a>
					<a href="">Contact</a>
					<a href="">Share</a>
					<a href="">Give Feedback</a>
				</div>
			</aside>
		</div>
	</article>
</script>