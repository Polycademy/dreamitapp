<script type="text/ng-template" id="post.html">
	<article class="container post" pull-down-to-window-dir ng-show="!notFoundError">
		<header class="post_header page-header">
			<h1 class="post_heading"><a ng-href="blog/{{post.id}}/{{post.titleUrl}}">{{post.title}}</a></h1>
			<button class="add_edit_blog_button" ng-click="openAddEditBlog()" ng-show="loggedInAdmin"><span class="fui-new"></span> Edit this Blog Post</button>
		</header>
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