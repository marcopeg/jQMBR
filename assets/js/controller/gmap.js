/**
 * ---[[   B O I L E R P L A T E   ]]---
 * JqueryMobile + BackboneJS + RequireJS
 * =====================================
 *
 * Google Map API Asyncronlusly Loaded Utility
 * 
 */

define([
	'jquery', 'backbone', 
	'app',
	
	// app plugins
	'jqmbr/app.bodyFullsize',
	'jqmbr/app.loadGmap'


], function(
	$, Backbone, 
	App

) {
	
	var _page 	= '#page-gmap';
	var _map 	= null;
	
	var $page 	= null;
	var $body 	= null;
	
	// Setup API Key:
	// you can do this inside App's initialization logic!	
	App.gmapConfig = {
		key: 'AIzaSyC0MZmqeXyTIGTufiPV9s5lLh_d35fcedQ'
	};
	
	
	$(document).delegate(_page, 'pagecreate', function() {
		$page = $(this);
		$body = $page.find('[data-role=content]');
	});
	
	
	/**
	 * Load Map's API asyncronously and create a new map
	 * instance
	 */
	$(document).delegate(_page, 'pageshow', function() {
		App.loadGmap(function() {
			_map = new google.maps.Map($body[0], {
				center: 	new google.maps.LatLng(45,11),
				zoom: 		10,
				mapTypeId: 	google.maps.MapTypeId.ROADMAP
			});
		});
	});
	
	$(document).delegate(_page, 'pagehide', function() {
		$page.remove();
		$page 	= null;
		$body 	= null;
		_map 	= null; // free map's reference object
	});
	
	
	
});