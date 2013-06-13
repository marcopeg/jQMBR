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
	var _page 	= '#page-splitview';
	var _split	= null;
	
	// Global controller scoped DOM references
	var $page 	= null;
	var $body 	= null;
	
	
	
	$(document).delegate(_page, 'pagecreate', function() {
		$page = $(this);
		$body = $page.find('[data-role=content]');
		
		
		_split = new SplitView({
			el: 		$body,
			type: 		'vertical',
			startupDfd:	App.bodyFullsized($body),
			updateEvt: 	'fullsize', // update on viewport resize
			split: 		'50px',
			p1: 		'#panel-top',
			p2: {
				split: 		.3,
				resizable: 	true,
				p1: 		'#panel-bottom-left',
				p2: {
					type:	'vertical',
					resizable: true,
					split: 	'-100px', // assign size to second panel
					
					// some panels generated on the fly
					p1:		{
						split: 		.333,
						resizable: 	false,
						p1: 		$('<div>').append($('<div>').addClass('inner').html('A')),
						p2: {
							split: 		.5,
							resizable:	false,
							p1: 		$('<div>').append($('<div>').addClass('inner').html('B')),
							p2: 		$('<div>').append($('<div>').addClass('inner').html('C'))
						}
					},
					
					// another panel from existing DOM
					p2:	$('#panel-bottom-right-bottom')
				}
			}
		});
		
	});
	
	$(document).delegate(_page, 'pageshow', function() {
		
	});
	
	
	$(document).delegate(_page, 'pagehide', function() {
		$page.remove();
		$page 	= null;
		$body 	= null;
		_split	= null; // free SplitView instance
	});

	
	
	
});