/**
 * ---[[   B O I L E R P L A T E   ]]---
 * JqueryMobile + BackboneJS + RequireJS
 * =====================================
 *
 * Entry Point Controller 
 * 
 */

define([
	'jquery', 'backbone', 
	'app',
	'jqmbr/view.SplitView',
	
	// app plugins
	'jqmbr/app.bodyFullsize',


], function(
	$, Backbone, 
	App,
	SplitView

) {
	
	// Global controller scoped logic vars, Objects, etc...
	var _page 	= '#page-splitview-chain-c';
	var _split	= null;
	
	// Global controller scoped DOM references
	var $page 	= null;
	var $body 	= null;
	
	
	
	$(document).delegate(_page, 'pagecreate', function() {
		$page = $(this);
		$body = $page.find('[data-role=content]');
		
		_split = new SplitView({
			el: 		$body,
			startupDfd:	App.bodyFullsized($body),
			updateEvt: 	'fullsize',
			type: 		'vertical',
			resizable:	true,
			p1: {
				p1: $('<div>').html('panel1'),
				p2:	$('<div>').html('panel2')	
			},
			p2: {
				split: .333,
				resizable: false,
				p1: $('<div>').html('panel2'),
				p2: {
					resizable: false,
					p1: $('<div>').html('panel1'),
					p2: $('<div>').html('panel2')
				}
			}		
		});
		
	});
	
	
	$(document).delegate(_page, 'pagehide', function() {
		$page.remove();
		$page 	= null;
		$body 	= null;
		_split	= null; // free SplitView instance
	});
	
	
});