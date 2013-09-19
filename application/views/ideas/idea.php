<script type="text/ng-template" id="idea.html">
	<article 
		class="idea_container" 
		ng-class="{'overlay_container': viewingOverlay, 'container': !viewingOverlay}"
		overlay-close-dir="viewingOverlay" 
		overlay-close-func="closeOverlay()" 
		pull-down-to-window-dir 
		ng-show="!notFoundError"
	>
		<header class="idea_header">
			<div class="idea_heading">
				<h1><a ng-href="ideas/{{idea.id}}/{{idea.titleUrl}}">{{idea.title}}</a></h1>
				<div class="idea_short">{{idea.descriptionShort}}</div>
			</div>
			<button 
				class="idea_close overlay_close" 
				ng-click="closeOverlay()" 
				ng-show="viewingOverlay"
			>
				<span class="fui-cross"></span>
			</button>
			<button 
				class="edit_item" 
				ng-click="openEditIdeaOverlay()" 
				ng-show="loggedInAndOwns()" 
			>
				<span class="fui-new"></span>
			</button>
		</header>
		<div class="idea_content">
			<div class="idea_inner_content">
				<div ng-switch="viewingOverlay">
					<img 
						ng-switch-when="true" 
						class="idea_main_image" 
						ng-src="{{idea.image}}/convert?w=546&fit=max" 
						image-centering-dir 
						image-centering-limit="40px" 
						ng-show="idea.image" 
					/>
					<img 
						ng-switch-when="false" 
						class="idea_main_image" 
						ng-src="{{idea.image}}/convert?w=819&fit=max" 
						image-centering-dir 
						image-centering-limit="40px" 
						ng-show="idea.image" 
					/>
				</div>
				<div class="idea_description" ng-bind-html="idea.descriptionParsed"></div>
			</div>
			<aside class="idea_meta gradient">
				<div class="idea_author">
					<img class="idea_author_image" ng-src="{{idea.authorAvatar + '?s=184&d=mm'}}" />
					<div class="idea_aside_text">
						<span class="idea_author_name">
							<a ng-href="{{'users/' + idea.authorId + '/' + idea.authorUrl}}">{{idea.author}}</a>
						</span>
						<ul class="idea_author_additonal_information">
							<li>{{idea.authorType}}</li>
						</ul>
					</div>
				</div>
				<hr />
				<div class="idea_data idea_aside_text">
					<ul>
						<li>Submitted: {{idea.date}}</li>
						<li>Feedback: {{idea.commentCount}}</li>
						<li>Likes: {{idea.likes}}</li>
						<li>Tags: 
							<ul class="idea_tags_list">
								<li ng-repeat="tag in idea.tags">
									<a ng-href="?tags={{tag}}" ng-click="tagAction(tag)">{{tag}}</a>
								</li>
							</ul>
						</li>
					</ul>
				</div>
				<hr />
				<div class="idea_actions idea_aside_text">
					<ul>
						<li sign-in-prompt-dir="{{loggedIn}}" sign-in-prompt-message="Sign in to like ideas!"><a ng-click="likeAction(idea.id)"><span class="fui-heart"></span>Like</a></li>
						<li><a ng-click="contactAuthor(idea.authorId, idea.id)" ng-show="loggedInDeveloper"><span class="fui-mail"></span>Contact</a></li>
						<li>
							<a 
								share-this-dir 
								share-this-publisher-id="{{dreamItAppConfig.apiKeys.shareThis}}" 
								share-this-url="{{baseUrl + 'ideas/' + idea.id + '/' + idea.titleUrl}}" 
								share-this-title="{{idea.title}}" 
								share-this-summary="{{idea.descriptionShort}}" 
								share-this-image="{{idea.image}}"
							>
								<span class="fui-plus"></span>Share
							</a>
						</li>
						<li sign-in-prompt-dir="{{loggedIn}}" sign-in-prompt-message="Sign in to give feedback!"><a anchor-scroll-dir="feedback"><span class="fui-chat"></span>Give Feedback</a></li>
					</ul>
				</div>
			</aside>
		</div>
		<section id="feedback" class="idea_comments" ng-controller="CommentsCtrl">
			<h2 ng-show="loggedInAndComments">Feedback</h2>
			<form class="comment_form" ng-submit="submitComment(idea.id)" name="comment_form" ng-show="loggedIn">
				<div 
					class="control-group" 
					ng-class="{
						error: comment_form.comment.$invalid && comment_form.comment.$dirty
					}"
				>
					<div class="controls">
						<textarea 
							class="input-block-level" 
							name="comment" 
							ng-model="comment" 
							rows="3" 
							ng-minlength="10" 
							ng-maxlength="2000" 
							required
						></textarea>
						<span class="help-block" ng-show="comment_form.comment.$error.minlength">Comment is too short, write at least 10 characters.</span>
						<span class="help-block" ng-show="comment_form.comment.$error.maxlength">Comment is too long, write less than 2000 characters.</span>
					</div>
				</div>
				<div class="validation_errors text-center" ng-show="validationErrors">
					<em class="text-warning">Oops! Please fix up these errors:</em>
					<ul>
						<li class="alert alert-error" ng-repeat="error in validationErrors">{{error}}</li>
					</ul>
				</div>
				<div class="success_submit alert alert-success text-center" ng-show="successSubmit">
					{{successSubmit}}
				</div>
				<div class="form-actions">
					<button type="submit" class="btn btn-primary">Add Comment</button>
				</div>
			</form>
			<div 
				class="comment_list" 
				when-scrolled-dir="getComments(ideaId)" 
				when-scrolled-idea="{{idea.id}}" 
				when-scrolled-container="{{{true: '.overlay_backdrop', false: 'window'}[viewingOverlay]}}" 
				when-scrolled-disabled="commentsServiceBusy"
			>
				<div class="comment_box" ng-repeat="comment in comments">
					<div class="comment_meta">
						<img class="comment_avatar" ng-src="{{comment.authorAvatar}}?s=184&d=mm" />
						<div class="comment_author"><a href="users/{{comment.authorId}}/{{comment.authorUrl}}">{{comment.author}}</a></div>
					</div>
					<div class="comment_content">{{comment.comment}}</div>
				</div>
			</div>
		</section>
	</article>
	<article 
		class="idea_container" 
		ng-class="{'overlay_container': viewingOverlay, 'container': !viewingOverlay}" 
		overlay-close-dir="viewingOverlay" 
		overlay-close-func="closeOverlay()" 
		pull-down-to-window-dir 
		ng-show="notFoundError"
	>
		<header class="page-header">
			<div class="alert alert-error alert-block">
				<h1>404 Error!</h1>
				{{notFoundError}}
			</div>
		</header>
	</article>
</script>