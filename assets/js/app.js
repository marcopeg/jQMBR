/**
 * ---[[   B O I L E R P L A T E   ]]---
 * JqueryMobile + BackboneJS + RequireJS
 * =====================================
 * 
 * Global Application Instance
 * initialization logic, plugins, events digitalization...
 * 
 */

define([
	'jquery',
	'jqmbr/AppClass',
	
	// boilerplate plugins
	//'jqmbr/app.bodyFullsize',
	//'jqmbr/app.loadGmap'
	

], function(
	$, 
	AppClass
) {
	
	
	/**
	 * App Constructor
	 */
	AppClass.prototype.initialize = function() {
		// ... application initialization code goes here!
	};
	
	
	
	/**
	 * Create singleton instance and share it to the global namespace
	 */
	if (!window.App) {
		window.App = new AppClass();
	}
	
	
	
	
	/**
	 * Digitalize UI Events to App singleton
	 * every piece of application logic will listen to App Events!
	 */
	
	var _eventDelay = 250;
	
	var _resizeEvt = null;
	$(window).resize(function(e) {
		clearTimeout(_resizeEvt);
		_resizeEvt = setTimeout(function() {
			window.App.trigger('resize', [e]);
		}, _eventDelay);
	});
	
	var _mousemoveEvt = null;
	$(window).mousemove(function(e) {
		clearTimeout(_mousemoveEvt);
		_mousemoveEvt = setTimeout(function() {
			window.App.trigger('mousemove', [e]);
		}, _eventDelay);
	});
	
	var _scrollEvt = null;
	$(window).scroll(function(e) {
		clearTimeout(_scrollEvt);
		_scrollEvt = setTimeout(function() {
			window.App.trigger('scroll', [e]);
		}, _eventDelay);
	});
	
	$(document).on('keydown', function(e) {
		window.App.trigger('keydown', [e]);
	});
	
	$(document).on('keyup', function(e) {
		window.App.trigger('keyup', [e]);
	});
	
	$(document).on('keypress', function(e) {
		window.App.trigger('keypress', [e]);
	});
	
	return window.App;
});