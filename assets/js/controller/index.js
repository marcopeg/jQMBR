/**
 * ---[[   B O I L E R P L A T E   ]]---
 * JqueryMobile + BackboneJS + RequireJS
 * =====================================
 *
 * Entry Point Controller 
 * 
 */

define([
	'jquery', 'jqmbr/backbone', 
	'app',
	
	'controller/chained-pages'


], function(
	$, Backbone, 
	App

) {
	
	// Global controller scoped logic vars, Objects, etc...
	var _page 	= '#page-index';
	
	// Global controller scoped DOM references
	var $page 	= null;
	var $body 	= null;
	
	
	/**
	 * Fetch global DOM reference scoped to this page-controller
	 * so internal logic can save DOM hits
	 */
	$(document).delegate(_page, 'pagecreate', function() {
		$page = $(this);
		$body = $page.find('[data-role=content]');
	});
	
	$(document).delegate(_page, 'pageshow', function() {
		
		
		//new ChainedPage2();
		
		
	});
	
	/**
	 * Unload page DOM items and free private vars 
	 * to improve global performaces!
	 */
	$(document).delegate(_page, 'pagehide', function() {
		$page.remove();
		$page = null;
		$body = null;
	});
	
	
});