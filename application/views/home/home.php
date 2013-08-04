<script type="text/ng-template" id="home.html">
	<!-- This splits the background in half -->
	<div class="background_splitter">
		<!-- This centers the content, and responsively adjusts the width. It also provides a row functionality. -->
		<div class="wall_container">
			<div class="wall" masonry-wall-dir=".idea_*" infinite-scroll="paginateIdeas(limit, tags)" infinite-scroll-disabled="ideasServiceBusy" infinite-scroll-distance="2">
				<div class="item_panel idea_{{idea.id}}" ng-repeat="idea in appIdeas">
					<h3 class="item_header"><a ng-href="{{idea.link}}">{{idea.title}}</a></h3>
					<div class="item_image_container" ng-show="ideaHasImage($index)">
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
									<a ng-click="tagAction(tag)">{{tag}}</a>
								</li>
							</ul>
						</div>
					</div>
				</div>
			</div>
			<aside class="control_panel" equalise-height-to-dir=".wall">
				<div class="affixed_controls">
					<h3>Search</h3>
				</div>
			</aside>
		</div>
	</div>
</script>