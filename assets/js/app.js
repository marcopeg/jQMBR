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
	 * every piece of logic will listen to App Events!
	 */
	
	var _resizeEvt = null;
	$(window).resize(function(e) {
		clearTimeout(_resizeEvt);
		_resizeEvt = setTimeout(function() {
			window.App.trigger('resize', [e]);
		}, 50);
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