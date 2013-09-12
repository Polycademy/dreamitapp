<script type="text/ng-template" id="blog.html">
	<div class="container blog">
		<header class="blog_header page-header">
			<h1>Blog</h1>
		</header>
		<div class="blog_content">
			<div 
				class="blog_list"
				infinite-scroll="getBlog(limit)" 
				infinite-scroll-disabled="blogServiceBusy" 
				infinite-scroll-distance="2"
			>
				<div class="blog_item" ng-repeat="post in blog">
					<h3 class="post_header"><a ng-href="blog/{{post.id}}/{{post.titleUrl}}">{{post.title}}</a></h3>
					<div class="post_description" ng-bind-html="post.descriptionParsed"></div>
					<div class="post_meta">
						<strong>Posted By: </strong> <a class="post_author_link" href="users/{{post.authorId}}/{{post.authorUrl}}">{{post.author}}</a>
					</div>
				</div>
			</div>
		</div>
	</div>
</script>