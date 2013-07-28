<script type="text/ng-template" id="home.html">
	<div class="main_wrapper row" equalise-heights-dir=".wall, .control_panel">
		<div class="wall span9" masonry-wall-dir>
			<div class="item_panel" ng-repeat="idea in appIdeas">
				<h3 class="item_header"><a ng-href="{{idea.link}}">{{idea.title}}</a></h3>
				<div class="item_image_container">
					<div class="item_rollover">
						<a class="share_button" ng-href="http://www.addthis.com/bookmark.php?v=300&pubid={{dreamItAppConfig.apiKeys.addThis}}" addthis:url="{{baseUrl + idea.link}}" addthis:title="{{idea.title}}" addthis:description="{{idea.description | StripHtml}}">
							Share
						</a>
					</div>
					<img ng-src="{{idea.image}}" />
				</div>
				<div class="item_desc" ng-bind-html="idea.description"></div>
				<div class="item_meta">
					<span class="item_author">
						<a ng-href="{{'users/' + idea.authorLink}}">{{idea.author}}</a>
					</span>
					<div class="item_actions">
						<a class="item_feedback" ng-href="{{idea.link}}#feedback">
							<span class="item_number">{{idea.feedback}}</span>
							<span class="item_icon fui-chat"></span>
						</a>
						<a class="item_likes" ng-click="likeAction(idea.id)">
							<span class="item_number">{{idea.likes}}</span>
							<span class="item_icon fui-heart"></span>
						</a>
					</div>
					<div class="item_tags">
						<ul>
							<li ng-repeat="tag in idea.tags">
								<a ng-click="TagAction(tag)">{{tag}}</a>
							</li>
						</ul>
					</div>
				</div>
			</div>
		</div>
		<aside class="control_panel span3">
			<h3>Search</h3>
		</aside>
	</div>
</script>