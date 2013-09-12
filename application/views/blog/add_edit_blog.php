<script type="text/ng-template" id="add_edit_blog.html">
	<div 
		class="add_blog_container" 
		ng-class="{'overlay_container': viewingOverlay, 'container': !viewingOverlay}"
		overlay-close-dir="viewingOverlay" 
		overlay-close-func="closeOverlay()" 
		pull-down-to-window-dir 
		ng-show="!notFoundError"
	>
		<header class="add_blog_header">
			<h1 class="add_blog_heading" ng-switch="action">
				<span ng-switch-when="add">Add a New blog</span>
				<span ng-switch-when="edit">Edit blog</span>
			</h1>
			<button 
				class="add_blog_close overlay_close" 
				ng-click="closeOverlay()" 
				ng-show="viewingOverlay"
			>
				<span class="fui-cross"></span>
			</button>
		</header>
		<form class="add_blog_form form-horizontal" ng-submit="submitBlog()" name="add_blog_form">
			<div class="add_blog_form_internal">
				<div 
					class="control-group" 
					ng-class="{
						error: add_blog_form.add_blog_title.$invalid && add_blog_form.add_blog_title.$dirty
					}"
				>
					<label class="control-label" for="add_blog_title">Title:</label>
					<div class="controls">
						<input 
							type="text" 
							id="add_blog_title" 
							class="input-block-level" 
							name="add_blog_title" 
							ng-model="addBlogTitle" 
							ng-minlength="2" 
							ng-maxlength="50" 
							required 
						/>
						<span class="help-block" ng-show="add_blog_form.add_blog_title.$error.required">Required</span>
						<span class="help-block" ng-show="add_blog_form.add_blog_title.$error.minlength">Title is too short.</span>
						<span class="help-block" ng-show="add_blog_form.add_blog_title.$error.maxlength">Title is too long.</span>
					</div>
				</div>
				<div 
					class="control-group" 
					ng-class="{
						error: add_blog_form.add_blog_description.$invalid && add_blog_form.add_blog_description.$dirty
					}"
				>
					<label class="control-label" for="add_blog_description">Description:</label>
					<div class="controls">
						<textarea 
							id="add_blog_description" 
							class="input-block-level" 
							name="add_blog_description" 
							rows="10" 
							ng-model="addBlogDescription" 
							ng-minlength="10" 
							required
						></textarea>
						<span class="help-block" ng-show="add_blog_form.add_blog_description.$error.required">Required</span>
						<span class="help-block" ng-show="add_blog_form.add_blog_description.$error.minlength">Description is too short.</span>
						<span class="help-block">You are welcome to use <a href="http://net.tutsplus.com/tutorials/tools-and-tips/markdown-the-ins-and-outs/" target="_blank">Markdown</a>.</span>
					</div>
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
				<button type="submit" class="btn btn-large btn-block btn-primary" ng-switch="action">
					<span ng-switch-when="add">Add Blog Post</span>
					<span ng-switch-when="edit">Edit Blog Post</span>
				</button>
				<button type="button" class="btn btn-large btn-block btn-danger" ng-click="deleteBlog()" ng-show="editAction">
					Delete Blog Post (Irreversible)
				</button>
			</div>
		</form>
	</div>
	<div 
		class="add_blog_container" 
		ng-class="{'overlay_container': viewingOverlay, 'container': !viewingOverlay}" 
		pull-down-to-window-dir 
		overlay-close-dir="viewingOverlay" 
		overlay-close-func="closeOverlay()" 
		ng-show="notFoundError"
	>
		<header class="page-header">
			<div class="alert alert-error alert-block">
				<h1>404 Error!</h1>
				{{notFoundError}}
			</div>
		</header>
	</div>
</script>