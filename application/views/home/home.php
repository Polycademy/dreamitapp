<script type="text/ng-template" id="home.html">
	<div class="wall_container">
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
				<h3 class="item_header"><a ng-href="ideas/{{idea.id}}/{{idea.titleUrl}}" ng-click="openIdeaOverlay(idea.id, idea.titleUrl)">{{idea.title}}</a></h3>
				<div class="item_image_container" ng-show="idea.image">
					<img ng-src="{{idea.image}}/convert?w=239&h=1000&fit=max" />
					<a ng-href="ideas/{{idea.id}}/{{idea.titleUrl}}" ng-click="openIdeaOverlay(idea.id, idea.titleUrl)"><div class="item_rollover"></div></a>
					<a 
						class="share_button" 
						share-button-dir 
						share-this-dir 
						share-this-publisher-id="{{dreamItAppConfig.apiKeys.shareThis}}" 
						share-this-url="{{baseUrl + 'ideas/' + idea.id + '/' + idea.titleUrl}}" 
						share-this-title="{{'Check out this great idea for an app I found on Dream it App: ' + idea.title}}" 
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
							sign-in-or-sign-up-prompt-dir="{{loggedIn}}" 
							sign-in-or-sign-up-prompt-idea-id="{{idea.id}}" 
							sign-in-or-sign-up-prompt-idea-url="{{idea.titleUrl}}" 
							sign-in-or-sign-up-prompt-message="Sign In or Up to Like Ideas!"
							ng-href="ideas/{{idea.id}}/{{idea.titleUrl}}#feedback" 
							ng-click="disableOverlay || openIdeaOverlay(idea.id, idea.titleUrl)" 
						>
							<div class="item_icon fui-chat">
								<span class="item_number">{{idea.commentCount | NumCounter:2}}</span>
							</div>
						</a>
						<a 
							class="item_likes" 
							sign-in-or-sign-up-prompt-dir="{{loggedIn}}" 
							sign-in-or-sign-up-prompt-idea-id="{{idea.id}}" 
							sign-in-or-sign-up-prompt-idea-url="{{idea.titleUrl}}" 
							sign-in-or-sign-up-prompt-message="Sign In or Up to Like Ideas!" 
							like-toggle-dir 
							like-index="{{$index}}" 
							like-id="{{idea.id}}"
						>
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
	<aside class="control_panel" ng-controller="ControlPanelCtrl" affix-dir="133">
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
					<a ng-href="{{'users/' + user.id + '/' + user.usernameUrl}}"><span class="fui-gear"></span>Profile</a>
				</li>
				<li>
					<a ng-click="signOut()"><span class="logout_icon"></span>Sign out</a>
				</li>
			</ul>
			<ul ng-switch-default>
				<li ng-class="{true: 'viewing_popular_ideas'}[viewingPopularIdeas]">
					<a ng-click="viewPopularIdeas()"><span class="fui-heart"></span>Popular Ideas</a>
				</li>
				<li>
					<a>
						<span class="fui-radio-unchecked"></span>I have an Idea
					</a>
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
		<div class="control_adverts" rotating-adverts-dir="advertNum" rotate-between="1:3" ng-switch="advertNum">
			<div class="image_advert" ng-switch-when="1">
				<a target="_blank" href="http://www.shareasale.com/r.cfm?b=520409&u=875004&m=32431&urllink=&afftrack=">
					<img src="http://www.shareasale.com/image/32431/300x250-Galaxy.jpg" alt="Galaxy of accessories. Upgrade your beloved Samsung!" />
				</a>
			</div>
			<div class="image_advert" ng-switch-when="2">
				<a target="_blank" href="http://www.shareasale.com/r.cfm?b=270822&u=875004&m=30338&urllink=&afftrack=">
					<img src="http://www.shareasale.com/image/30338/100x100.jpg" alt="Bizness Apps" />
				</a>
			</div>
			<div class="image_advert" ng-switch-when="3">
				<a target="_blank" href="http://www.shareasale.com/r.cfm?b=485235&u=875004&m=21459&urllink=&afftrack=">
					<img src="http://www.shareasale.com/image/21459/BuildForMe125_00.jpg" alt="Need an iPhone App Built? Dedicated iOS developer starting at $15 an Hour!" />
				</a>
			</div>
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
					<a ng-href="{{'users/' + user.id + '/' + user.usernameUrl}}" title="Profile"><span class="fui-gear"></span></a>
				</li>
				<li>
					<a ng-click="signOut()" title="Sign out"><span class="logout_icon"></span></a>
				</li>
			</ul>
			<ul ng-switch-default>
				<li>
					<a ng-click="openSearch()" title="Search"><span class="fui-search"></span></a>
				</li>
				<li ng-class="{true: 'viewing_popular_ideas'}[viewingPopularIdeas]">
					<a ng-click="viewPopularIdeas()" title="Popular Ideas"><span class="fui-heart"></span></a>
				</li>
				<li>
					<a ng-click="signIn()" title="Sign In"><span class="login_icon"></span></a>
				</li>
				<li>
					<a ng-click="signUp()" title="Sign Up"><span class="fui-user"></span></a>
				</li>
			</ul>
		</div>
	</aside>
</script>