/**
 * ---[[   B O I L E R P L A T E   ]]---
 * JqueryMobile + BackboneJS + RequireJS
 * =====================================
 *
 * App.bodyFullsize()
 * Resize active page body's to fit all available space.
 *
 * You can run it manually when pageshow:
 * App.bodyFullsize()
 *
 * Or you can set a data-fullsize="true" params to the page's content tag
 * to run it automagically.
 * NOTE: this also attach "fullsize" behavior when viewport resize!
 *
 * It trigger a "fullsize" event on resized page's content tag!
 *
 */

define([
	'jquery',
	'./AppClass'
	

], function(
	$,
	AppClass
) {
	
	
	/**
	 * Setup a global DFD object.
	 * it's scope is to handle the first body resizing event at page startup.
	 */
	AppClass.prototype.initialized.done(function() {
		this.bodyFullsized = $.Deferred();
	});
	
	
	AppClass.prototype.bodyFullsize = function() {
		if (!$.mobile.activePage) return;
		
		var $body = $.mobile.activePage.find('[data-role=content]');
		if ($body.attr('data-fullsize') != 'true') return;
		
		var $header = $.mobile.activePage.find('[data-role=header]');
		var $footer = $.mobile.activePage.find('[data-role=footer]');
		
		var height = $(window).height();
		if ($header.length) height -= $header.outerHeight();
		if ($footer.length) height -= $footer.outerHeight();
		
		$body.css({
			padding: 0,
			height: height
		});
		
		$body.trigger('fullsize');
		this.bodyFullsized.resolveWith(this, [$body, height]);
	};
	
	
	AppClass.prototype.bodyFullsizeDeferred = function($obj) {
		var dfd = $.Deferred();
		
		if ($obj.length) {
			$obj.on('fullsize', $.proxy(function() {
				dfd.resolveWith(this);
			}, this));
		}
		
		return dfd.promise();
	};
	
	
	/**
	 * Automagically Setup
	 */
	$(document).delegate('[data-role="page"]', 'pageshow', function() {
		App.bodyFullsize();
		App.on('resize', App.bodyFullsize, App);
	});
	
});