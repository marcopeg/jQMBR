/**
 * ---[[   B O I L E R P L A T E   ]]---
 * JqueryMobile + BackboneJS + RequireJS
 * =====================================
 *
 * ImagePaneView Example
 * 
 */

define([
	'jquery', 'backbone', 
	'app',
	'jqmbr/view.ImagePaneView',
	
	// app plugins
	'jqmbr/app.bodyFullsize',


], function(
	$, Backbone, 
	App,
	ImagePaneView

) {
	
	// Global controller scoped logic vars, Objects, etc...
	var _page 	= '#page-imagepaneview';
	var _pane	= null;
	
	// Global controller scoped DOM references
	var $page 	= null;
	var $body 	= null;
	
	
	$(document).delegate(_page, 'pagecreate', function() {
		$page = $(this);
		$body = $page.find('[data-role=content]');
		
		
		_pane = new ImagePaneView({
			el: 		$body.find('img:first'),
			
			// wait for bodyFullsize to happen
			startupDfd:	App.bodyFullsized($body),
			
			// bind render() to bodyFullsize 
			updateEvt: 	'fullsize'
		});
		
		
	});
	
	/**
	 * Here you can see an alternative initialization for ImagePaneView
	 */
	$(document).delegate(_page, 'pageshow', function() {
		//_pane = new ImagePaneView($body);
		//$body.on('fullsize', $.proxy(_pane.render, _pane));
	});
	
	
	/**
	 * Free ImagePaneView instance
	 */
	$(document).delegate(_page, 'pagebeforehide', function() {
		_pane.destroy();
		_pane = null;
	});
	
	$(document).delegate(_page, 'pagehide', function() {
		$page.remove();
		$page 	= null;
		$body 	= null;
	});
	
	
});