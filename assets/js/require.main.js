/**
 * ---[[   B O I L E R P L A T E   ]]---
 * JqueryMobile + BackboneJS + RequireJS
 * =====================================
 * 
 * Main Application Module
 * here loads every required library then start up all things!
 * 
 */

require([
	// 3rd party
	'jquery', 'backbone', 'underscore',
	'jqueryuit', 'jqm',
	
	
	// App Libraries
	//'inc/locale', 		// local storage access layer
	'app',
	
	// App Controllers
	'controller/index',
	'controller/gmap',
	'controller/splitview',
	'controller/imagepaneview',
	'controller/imagepaneview-splitview',
	'controller/scrollin',
	
	'controller/splitview-chain-a',
	'controller/splitview-chain-b',
	'controller/splitview-chain-c',
	'controller/splitview-chain-d',
	'controller/splitview-chain-e',
	
	// JQM
	'lib/iscroll/iscroll'
	


], function() {
	
	
	/**
	 * Prevent JQM flickering!
	 * when loading heavy scripts you may see unformatted page contents before JQM
	 * starts up and render a real mobile page.
	 *
	 * My little solution is to:
	 * - hide page's body with an inline CSS
	 * - setup JQM to do not auto initialize
	 * - fadeIn body and initialize JQM here
	 *
	 * NOTICE: it seem do does not work in some Android devices!
	 */
	
	// prevent to save hashtags ehrn reloading pages!
	window.location.hash = "#";
	
	$('body').show();
	$.mobile.initializePage();
	
});
