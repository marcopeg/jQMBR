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
	
	
	var __bodyFullsizeDfd = function($obj) {
		var dfd = $obj.data('bodyFullsizeDfd') || $.Deferred();
		$obj.data('bodyFullsizeDfd', dfd);
		return dfd;
	};
	
	var __bodyFullsizeObj = function($obj) {
		if (!$obj || !$obj.length || ($obj[0] && $obj[0].target)) {
			if ($.mobile && $.mobile.activePage) {
				$obj = $.mobile.activePage.find('[data-role=content]');
			} else {
				$obj = $('[data-role=content]').first();
			}
		}
		return $obj;
	};
	
	
	AppClass.prototype.bodyFullsize = function($obj) {
		var $obj = __bodyFullsizeObj($obj);
		if ($obj.attr('data-fullsize') != 'true') return;
		
		// setup new DFD for given DOM item
		var dfd = __bodyFullsizeDfd($obj);
		
		var $page	= $obj.parent('[data-role=page]');
		var $header = $page.find('[data-role=header]');
		var $footer = $page.find('[data-role=footer]');
		
		var height = $(window).height();
		if ($header.length) height -= $header.outerHeight();
		if ($footer.length) height -= $footer.outerHeight();
		
		$obj.css({
			padding: 0,
			height: height
		});
		
		$obj.trigger('fullsize');
		dfd.resolveWith(this, [$obj, height]);
		
		return dfd.promise();
	};
	
	
	AppClass.prototype.bodyFullsized = function($obj) {
		return __bodyFullsizeDfd(__bodyFullsizeObj($obj)).promise();
	};
	
	
	/**
	 * Automagically Setup
	 */
	$(document).delegate('[data-role="page"]', 'pageshow', function() {
		App.bodyFullsize();
		App.on('resize', App.bodyFullsize, App);
	});
	
});