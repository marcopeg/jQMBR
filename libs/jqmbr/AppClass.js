/**
 * ---[[   B O I L E R P L A T E   ]]---
 * JqueryMobile + BackboneJS + RequireJS
 * =====================================
 *
 * Main Application Class prototype 
 * inherit Backbone's event system!
 */

define([
	'jquery', 'backbone'
	

], function(
	$, Backbone
) {
	
	/**
	 * Empty class with Backbone's Events System
	 */
	var AppClass = function() {this.initialize.apply(this, arguments);};
	_.extend(AppClass.prototype, Backbone.Events);
	
	
	/**
	 * App Constructor
	 * !! does not write anything here !!
	 * !! will be overridden by the initialization file !!
	 */
	AppClass.prototype.initialize = function() {};
	
	
	/**
	 * On iOS I found a little refreshing bug so screen updates only
	 * after a user click or a user scroll.
	 *
	 * This trivial fix trigger a click on active $.mobile page
	 * to force that refresh.
	 *
	 * Is is useful after listview("refresh") or similar activities.
	 */
	AppClass.prototype.updateUi = function(timeout) {
		timeout = timeout || 100;
		setTimeout(function(){$.mobile.activePage.trigger('click');}, timeout);
	};
	
	return AppClass;
});