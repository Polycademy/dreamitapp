<script type="text/ng-template" id="home.html">
	<!-- This splits the background in half -->
	<div class="background_splitter">
		<!-- This centers the content, and responsively adjusts the width. It also provides a row functionality. -->
		<div class="wall_container">
			<div class="wall" pull-down-to-window-dir>
				<div class="alert" ng-show="ideasServiceError" affix="133">
					<button class="close" type="button" data-dismiss="alert">&times;</button>
					{{ideasServiceError}}
				</div>
				<div 
					class="wall_masonry_container"
					masonry-wall-dir=".item_panel" 
					infinite-scroll="getIdeas(limit, tags)" 
					infinite-scroll-disabled="ideasServiceBusy" 
					infinite-scroll-distance="2"
				>
					<div class="item_panel" ng-repeat="idea in appIdeas" masonry-item-dir>
						<h3 class="item_header"><a ng-href="{{idea.link}}">{{idea.title}}</a></h3>
						<div class="item_image_container" ng-show="ideaHasImage($index)">
							<div class="item_rollover">
								<a 
									class="share_button" 
									ng-href="http://www.addthis.com/bookmark.php?v=300&pubid={{dreamItAppConfig.apiKeys.addThis}}" 
									add-this-dir 
									add-this-config="{
										ui_click: true,
										ui_hover_direction: -1,
										services_exclude: 'print'
									}" 
									add-this-share="{
										url: baseUrl + idea.link,
										title: idea.title,
										description: idea.descriptionFiltered
									}"
								>
									Share
									<span class="fui-plus"></span>
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
									<span class="item_number">{{idea.feedback | NumCounter:2}}</span> <!--This is incorrect, it needs to come from disqus -->
									<span class="item_icon fui-chat"></span>
								</a>
								<a class="item_likes" ng-click="likeAction(idea.id)">
									<span class="item_number">{{idea.likes | NumCounter:2}}</span>
									<span class="item_icon fui-heart"></span>
								</a>
							</div>
							<div class="item_tags">
								<ul>
									<li ng-repeat="tag in idea.tags">
										<a ng-href="?tags={{tag}}" ng-click="tagAction(tag)">{{tag}}</a>
									</li>
								</ul>
							</div>
						</div>
					</div>
				</div>
			</div>
			<aside class="control_panel" equalise-height-to-dir=".wall" ng-controller="ControlPanelCtrl">
				<div class="affixed_controls">
					<form class="search_form form-inline" ng-submit="submitSearch()">
						<label for="search"><span class="fui-search"></span></label>
						<input id="search" name="search" type="text" ng-model="search" placeholder="Search"></input>
					</form>
					<div class="control_menu" ng-switch="loggedIn">
						<ul ng-switch-when="true">
							<li>Add Idea</li>
							<li>My Ideas</li>
							<li>Profile</li>
							<li>Sign out</li>
						</ul>
						<ul ng-switch-default>
							<li>Sign In</li>
							<li>Sign Up</li>
						</ul>
					</div>
					<div class="popular_tags">
						<ul>
							<li ng-repeat="tag in popularTags">
								<a ng-href="?tags={{tag}}" ng-click="tagAction(tag)">{{tag}}</a>
							</li>
						</ul>
					</div>
				</div>
			</aside>
		</div>
	</div>
</script>