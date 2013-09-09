<script type="text/ng-template" id="home.html">
	<div class="wall_container" pull-down-to-window-dir>
		<div 
			class="wall"
			masonry-wall-dir=".item_panel" 
			masonry-wall-options="{
				gutter: 0,
				transitionDuration: '0.3s'
			}" 
			infinite-scroll="getIdeas(limit, tags, author, popular)" 
			infinite-scroll-disabled="ideasServiceBusy" 
			infinite-scroll-distance="2"
		>
			<div class="item_panel" ng-repeat="idea in appIdeas" masonry-item-dir>
				<h3 class="item_header"><a ng-href="ideas/{{idea.id}}/{{idea.titleUrl}}" ng-click="openIdeaOverlay(idea.id)">{{idea.title}}</a></h3>
				<div class="item_image_container" ng-show="idea.image">
					<img ng-src="{{idea.image}}/convert?w=239&h=1000&fit=max" />
					<a ng-href="ideas/{{idea.id}}/{{idea.titleUrl}}" ng-click="openIdeaOverlay(idea.id)"><div class="item_rollover"></div></a>
					<a 
						class="share_button" 
						share-button-dir 
						share-this-dir 
						share-this-publisher-id="{{dreamItAppConfig.apiKeys.shareThis}}" 
						share-this-url="{{baseUrl + 'ideas/' + idea.id + '/' + idea.titleUrl}}" 
						share-this-title="{{idea.title}}" 
						share-this-summary="{{idea.descriptionShort}}" 
						share-this-image="{{idea.image}}"
					>
						Share
						<span class="fui-plus"></span>
					</a>
				</div>
				<div class="item_desc">
					<p>{{idea.descriptionShort}}</p>
				</div>
				<div class="item_meta">
					<span class="item_author">
						<a ng-href="{{'users/' + idea.authorId + '/' + idea.authorUrl}}">{{idea.author}}</a>
					</span>
					<div class="item_actions">
						<a 
							class="item_feedback" 
							ng-href="ideas/{{idea.id}}/{{idea.titleUrl}}" 
							ng-click="openIdeaOverlay(idea.id)" 
							anchor-scroll-dir="feedback" 
							anchor-scroll-delay="3000"
						>
							<div class="item_icon fui-chat">
								<span 
									class="item_number" 
									disqus-comment-count-dir 
									disqus-shortname="{{dreamItAppConfig.apiKeys.disqusShortname}}" 
									disqus-api-key="{{dreamItAppConfig.apiKeys.disqusApiKey}}" 
									disqus-ident="{{idea.id}}" 
									disqus-cache="commentCache"
								>{{commentCount | NumCounter:2}}</span>
							</div>
						</a>
						<a class="item_likes" like-toggle-dir like-index="{{$index}}" like-id="{{idea.id}}">
							<div class="item_icon fui-heart">
								<span class="item_number">{{idea.likes | NumCounter:2}}</span>
							</div>
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
	<aside class="control_panel" equalise-height-to-dir=".main" ng-controller="ControlPanelCtrl">
		<div class="affixed_controls" affix-dir="133">
			<form class="search_form form-inline" ng-submit="submitSearch()">
				<label for="search"><span class="fui-search"></span></label>
				<input id="search" name="search" type="text" ng-model="searchTag" ng-change="submitSearchDebounced()" placeholder="Search"></input>
			</form>
			<div class="control_menu" ng-switch="loggedIn">
				<ul ng-switch-when="true">
					<li ng-class="{true: 'viewing_popular_ideas'}[viewingPopularIdeas]">
						<a ng-click="viewPopularIdeas()"><span class="fui-heart"></span>Popular Ideas</a>
					</li>
					<li>
						<a ng-click="openAddIdeaOverlay()"><span class="fui-radio-unchecked"></span>Add Idea</a>
					</li>
					<li ng-class="{true: 'viewing_my_ideas'}[viewingMyIdeas]">
						<a ng-click="myIdeas()"><span class="fui-radio-checked"></span>My Ideas</a>
					</li>
					<li>
						<a ng-href="{{'users/' + authorId + '/' + authorUrl}}"><span class="fui-gear"></span>Profile</a>
					</li>
					<li>
						<a ng-click="signOut()"><span class="logout_icon"></span>Sign out</a>
					</li>
				</ul>
				<ul ng-switch-default>
					<li>
						<a ng-click="viewMostPopularIdeas()"><span class="fui-heart"></span>Popular Ideas</a>
					</li>
					<li>
						<a ng-click="signIn()"><span class="login_icon"></span>Sign In</a>
					</li>
					<li>
						<a ng-click="signUp()"><span class="fui-user"></span>Sign Up</a>
					</li>
				</ul>
			</div>
			<div class="popular_tags">
				<span class="popular_tags_title">Trending:</span>
				<ul>
					<li ng-repeat="tag in popularTags">
						<a ng-href="?tags={{tag}}" ng-click="tagAction(tag)">{{tag}}</a>
					</li>
				</ul>
			</div>
			<div class="slider_menu" ng-switch="loggedIn">
				<ul ng-switch-when="true">
					<li>
						<a ng-click="openSearch()" title="Search"><span class="fui-search"></span></a>
					</li>
					<li ng-class="{true: 'viewing_popular_ideas'}[viewingPopularIdeas]">
						<a ng-click="viewPopularIdeas()" title="Popular Ideas"><span class="fui-heart"></span></a>
					</li>
					<li>
						<a ng-click="openAddIdeaOverlay()" title="Add Idea"><span class="fui-radio-unchecked"></span></a>
					</li>
					<li ng-class="{true: 'viewing_my_ideas'}[viewingMyIdeas]">
						<a ng-click="myIdeas()" title="My Ideas"><span class="fui-radio-checked"></span></a>
					</li>
					<li>
						<a ng-href="{{'users/' + authorId + '/' + authorUrl}}" title="Profile"><span class="fui-gear"></span></a>
					</li>
					<li>
						<a ng-click="signOut()" title="Sign out"><span class="logout_icon"></span></a>
					</li>
				</ul>
				<ul ng-switch-default>
					<li>
						<a ng-click="openSearch()" title="Search"><span class="fui-search"></span></a>
					</li>
					<li>
						<a ng-click="viewMostPopularIdeas()" title="Popular Ideas"><span class="fui-heart"></span></a>
					</li>
					<li>
						<a ng-click="signIn()" title="Sign In"><span class="login_icon"></span></a>
					</li>
					<li>
						<a ng-click="signUp()" title="Sign Up"><span class="fui-user"></span></a>
					</li>
				</ul>
			</div>
		</div>
	</aside>
</script>