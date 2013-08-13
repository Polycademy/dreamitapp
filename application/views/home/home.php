<script type="text/ng-template" id="home.html">
	<!-- This splits the background in half -->
	<div class="background_splitter">
		<!-- This centers the content, and responsively adjusts the width. It also provides a row functionality. -->
		<div class="wall_container">
			<div class="wall" pull-down-to-window-dir>
				<div 
					class="wall_masonry_container"
					masonry-wall-dir=".item_panel" 
					masonry-wall-options="{
						gutter: 0,
						transitionDuration: '0.3s'
					}" 
					infinite-scroll="getIdeas(limit, tags, author)" 
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
								<a ng-href="{{'users/' + idea.authorId + '/' + idea.authorLink}}">{{idea.author}}</a>
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
				<div class="affixed_controls" affix="133">
					<form class="search_form form-inline" ng-submit="submitSearch()">
						<label for="search"><span class="fui-search"></span></label>
						<input id="search" name="search" type="text" ng-model="searchTag" ng-change="submitSearch()" placeholder="Search"></input>
					</form>
					<div class="control_menu" ng-switch="loggedIn">
						<ul ng-switch-when="true">
							<li><a ng-click="addIdea()"><span class="fui-radio-unchecked"></span>Add Idea</a></li>
							<li ng-class="{true: 'viewing_my_ideas'}[viewingMyIdeas]"><a ng-click="myIdeas()"><span class="fui-radio-checked"></span>My Ideas</a></li>
							<li><a ng-click="profile()"><span class="fui-gear"></span>Profile</a></li>
							<li><a ng-click="signOut()"><span class="logout_icon"></span>Sign out</a></li>
						</ul>
						<ul ng-switch-default>
							<li><a ng-click="signIn()"><span class="login_icon"></span>Sign In</a></li>
							<li><a ng-click="signOut()"><span class="fui-user"></span>Sign Up</a></li>
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