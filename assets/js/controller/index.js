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
	'app'


], function(
	$, Backbone, 
	App

) {
	
	var $page = null;
	var $body = null;
	
	$(document).delegate('#page-index', 'pagecreate', function() {
		$page = $(this);
		console.log('index works');
	});
	
	$(document).delegate('#page-index', 'pageshow', function() {
		$page.find('[data-role=content]').html('jQM + BackboneJS + RequireJS is running!');
	});
	
	
	
});