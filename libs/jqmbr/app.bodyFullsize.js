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
	}
	
	
	/**
	 * Automagically Setup
	 */
	$(document).delegate('[data-role="page"]', 'pageshow', function() {
		console.log("run");
		App.bodyFullsize();
		App.on('resize', App.bodyFullsize, App);
	});
	
});