/**
 * ---[[   B O I L E R P L A T E   ]]---
 * JqueryMobile + BackboneJS + RequireJS
 * =====================================
 *
 * ImagePaneView + SplitView Example
 * 
 */

define([
	'jquery', 'backbone', 
	'app',
	'jqmbr/view.SplitView',
	'jqmbr/view.ImagePaneView',
	
	// app plugins
	'jqmbr/app.bodyFullsize',


], function(
	$, Backbone, 
	App,
	SplitView,
	ImagePaneView

) {
	
	// Global controller scoped logic vars, Objects, etc...
	var _page 	= '#page-imagepaneview-splitview';
	var _split	= null;
	var _pane1	= null;
	var _pane2	= null;
	
	// Global controller scoped DOM references
	var $page 	= null;
	var $body 	= null;
	
	
	$(document).delegate(_page, 'pagecreate', function() {
		$page = $(this);
		$body = $page.find('[data-role=content]');
		
		_split = new SplitView({
			el: $body,
			startupDfd:	App.bodyFullsized($body),
			updateEvt: 	'fullsize',
			p1: '#left',
			p2: '#right'
		});
		
		$.when(_split.ready).then(function() {
			
			_pane1 = new ImagePaneView({
				el: _split.$w1
			});
			
			_pane2 = new ImagePaneView({
				el: _split.$w2,
				mode: 'cover'
			});
			
			// Connect ImagePane to SplitView
			_pane1.connectToSplitViewPanel(_split.$w1);
			_pane2.connectToSplitViewPanel(_split.$w2);
			
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
		_pane1.destroy();
		_pane1 = null;
		_pane2.destroy();
		_pane2 = null;
		_split = null;
	});
	
	$(document).delegate(_page, 'pagehide', function() {
		$page.remove();
		$page 	= null;
		$body 	= null;
	});
	
	
});