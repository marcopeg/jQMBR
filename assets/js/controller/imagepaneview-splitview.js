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
			updateEvt: 	'fullsize',
			p1: '#left',
			p2: '#right'
		});
		
		_pane1 = new ImagePaneView({
			el: _split.$p1.find('.ImagePane')
		});
		
		_pane2 = new ImagePaneView({
			el: _split.$p2.find('.ImagePane'),
			mode: 'cover'
		});
		
		_split.on('splitviewrender', function() {
			_pane1.$el.width(_split.$p1.width());
			_pane1.$el.height(_split.$p1.height());
			_pane1.render();
			_pane2.$el.width(_split.$p2.width());
			_pane2.$el.height(_split.$p2.height());
			_pane2.render();
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