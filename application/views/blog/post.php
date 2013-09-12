<script type="text/ng-template" id="post.html">
	<article class="container post" pull-down-to-window-dir ng-show="!notFoundError">
		<h1 class="post_header">
			<a ng-href="blog/{{post.id}}/{{post.titleUrl}}">{{post.title}}</a>
		</h1>
		<div class="post_item">
			<div class="post_description" ng-bind-html="post.descriptionParsed"></div>
			<div class="post_meta muted">
				<strong>Posted By: </strong> <a class="post_author_link" href="users/{{post.authorId}}/{{post.authorUrl}}">{{post.author}}</a>
			</div>
		</div>
	</article>
	<article class="container post" pull-down-to-window-dir ng-show="notFoundError">
		<header class="page-header">
			<div class="alert alert-error alert-block">
				<h1>404 Error!</h1>
				{{notFoundError}}
			</div>
		</header>
	</article>
</script>