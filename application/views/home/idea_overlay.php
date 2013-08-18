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
			<aside class="overlay_meta gradient">
				<div class="overlay_author">
					<img class="overlay_author_image" ng-src="{{idea.authorAvatar + '?s=184&d=mm'}}" />
					<div class="overlay_aside_text">
						<span class="overlay_author_name">
							<a ng-href="{{'users/' + idea.authorId + '/' + idea.authorLink}}">{{idea.author}}</a>
						</span>
						<ul class="overlay_author_additonal_information">
							<li>{{idea.authorType}}</li>
							<li>Links:</li>
							<li ng-repeat="link in idea.authorProfileLinks">
								<a ng-href="{{link}}">{{link}}</a>
							</li>
						</ul>
					</div>
				</div>
				<hr />
				<div class="overlay_idea_data overlay_aside_text">
					<ul>
						<li>Submitted: {{idea.date}}</li>
						<li>Feedback: 42</li>
						<li>Likes: {{idea.likes}}</li>
						<li>Tags: 
							<ul class="overlay_tags_list">
								<li ng-repeat="tag in idea.tags">
									<a ng-href="?tags={{tag}}" ng-click="tagAction(tag)">{{tag}}</a>
								</li>
							</ul>
						</li>
					</ul>
				</div>
				<hr />
				<div class="overlay_actions overlay_aside_text">
					<a ng-click="likeAction(idea.id)">Like</a>
					<a ng-click="contactAuthor(idea.id)">Contact</a>
					<a 
						ng-href="http://www.addthis.com/bookmark.php?v=300&pubid={{dreamItAppConfig.apiKeys.addThis}}" 
						add-this-dir 
						add-this-config="{
							ui_click: true,
							services_exclude: 'print'
						}" 
						add-this-share="{
							url: baseUrl + idea.link,
							title: idea.title,
							description: idea.descriptionFiltered
						}"
					>Share</a>
					<a href="#">Give Feedback</a>
				</div>
			</aside>
		</div>
	</article>
</script>