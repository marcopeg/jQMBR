/**
 * ---[[   B O I L E R P L A T E   ]]---
 * JqueryMobile + BackboneJS + RequireJS
 * =====================================
 *
 * bodyScrollin Example
 *
 * bodyScrollin combine bodyFullsize behavior with iScroll plugin to 
 * create an in-content scroller.
 *
 * this scroller is much more fluid than native and can be
 * enhanced with pull-to-update actions and other iScroll gestoures.
 *
 * the iScroll istance is applied to the [data-role="content"] item:
 * $('[data-role="content"]').data('iScroll')
 *
 * bodyScrollin works without iScroll plugin with a subset of features
 * using native in-div scrolling (very bad on iOS!)
 * 
 */

define([
	'jquery', 'backbone', 
	'app',
	
	// app plugins
	'jqmbr/app.bodyScrollin',


], function(
	$, Backbone, 
	App

) {
	
	// Global controller scoped logic vars, Objects, etc...
	var _page 	= '#page-scrollin';
	var _pane	= null;
	
	// Global controller scoped DOM references
	var $page 	= null;
	var $body 	= null;
	
	
	$(document).delegate(_page, 'pagecreate', function() {
		$page = $(this);
		$body = $page.find('[data-role=content]');
		
		// Activate bodyScrollin on page's content box
		App.bodyScrollin($body);
		
	});
	
});