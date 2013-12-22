CiTemplating
========

This is a simple static helper class that augments Codeigniter's view loading to add shared layout and partial template functionality.

Think of layouts as a template file that specifies the header, footer, sidebar and any other elements that are shared across web pages and hardly change. A large web application may have multiple layouts, one for the blog, one for the administration panel, one for the home page. Each of which may have different headers or lack/include a sidebar. Layouts are the master templates, the templates that specifies other templates.

Think of partials as reusable templates across many different areas. An example would be a table row that may get used in different tables in different pages in different layouts. Partials are the grand children templates, templates that don't specify any other template and doesn't know which parent will pick it up to use it.

There are a number of powerful templating libraries, however I prefered to augment CI's own loader instead of creating a whole new parser. Furthermore there's no DSL here, just normal PHP.

To use this:

* Each controller you have should have a corresponding folder with a matching name in the view folder. Therefore a controller named blog.php should have the folder views/blog.
* Each public method in a controller should have their own view with a matching name stored in their view controller folder. Therefore the controller blog.php with articles as a public method should have the view views/blog/articles_view.php.
* Partials are appended with _partial, and are stored in the partials folder such as views/partials/rows_partial.php.
* Layouts are appended with _layouts, and are stored in the layouts folder such as views/layouts/main_layout.php.

Your view structure will begin to look like this:

    views
        |
        |----layouts
        |       |
        |       |----default_layout.php
        |       |----admin_layout.php
        |       |----json_layout.php
        |
        |----partials
        |       |
        |       |----header_partial.php
        |
        |----home
        |       |
        |       |----index_view.php
        |
        |----blog
                |
                |----articles_view.php

Instead of loading views you:

    //first parameter is the name of the view stored in the controller view folder
	//second parameter is the array of view data
	//third parameter is an optional specification of the layout file, by default it's 'default'
    Template::compose('index', $view_data);
	//to load json view
	Template::compose(false, $json_array, 'json');

In your views and layouts, you can load partials directly like this:

    //first parameter is the name of the partial
	//second parameter is the data array to be passed in
	//third parameter is a boolean of whether you want the partial to be looped, in that case you need to use $row variable in the looped partial or $row->XXX or $row['XXX']
	//fourth parameter is a boolean of whether you want to buffer the output, so the partial returns a variable instead of echoing the output, in that cause you would have to <?= Template::partial... etc ?>
    Template::partial('header', $header);

This static class is installed via Composer and is therefore autoloaded. You can just assume Template::partial or Template:compose to be a global function!

In the layout file you have to echo out the $yield variable which is the passed in data from the actual view. For example default_layout.php could be:

    <?php defined('BASEPATH') OR exit('No direct script access allowed'); ?>
    <? Template::partial('header', $header) ?>
    <?= $yield ?>
    <? Template::partial('footer', $footer) ?>

You don't pass in the $yield from the data during `Template::compose`, you simply have a field for $header, a field for $footer, the rest of the fields go directly the _view file, and the resulting compiled template gets automatically put into the $yield.

Add this to your composer.json require list.

    "polycademy/citemplating": "*"

This library also works with controllers that are nested in a directory. You would then simply replicate the same directory structure in your view folder.