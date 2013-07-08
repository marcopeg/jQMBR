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
	'./AppClass',
	'./app.bodyFullsize'
	

], function(
	$,
	AppClass
) {	

	/*
	$('document').bind("touchmove",function(e){
		e.preventDefault();
	});
	*/
	
	
	
	AppClass.prototype.bodyScrollin = function($obj) {
		
		var $obj = __bodyScrollinObj($obj);
		
		// skip items who does not have correct data attributes and already initializated widgets
		if ($obj.attr('data-scrollin') != 'true' || $obj.data('bodyScrollinInit')) return;
		
		// setup new DFD for given DOM item
		var dfd = __bodyScrollinDfd($obj);
		
		// apply internal wrapper to use with iScroll
		var $wrap 	= $('<div style="padding:15px;min-height:90%">').append($obj.children()).appendTo($obj);
		$obj.attr('data-fullsize', 'true');
		
		// apply iScroll
		if (window.iScroll) {
			$obj.on('fullsize', _.bind(function() {
				if ($obj.data('bodyScrollinInit')) {
					__updateBodyScrollin($obj, $wrap);
					dfd.resolveWith(this);
				} else {
					__initBodyScrollin($obj, $wrap);
				}
			}, this));
		
		// or a simple overflowing div behavior
		} else {
			dfd.resolveWith(this);
		}
		
		// prevent default page scroll behavior on mobile device!
		$obj.parent().bind("touchmove",function(e){e.preventDefault()});
		
		// click on headerbar will scroll top internal page!
		var $page	= $obj.parent('[data-role=page]');
		var $header = $page.find('[data-role=header]');
		$header.find(':header').on('click', function() {
			try {
				$obj.stop().data('iScroll').scrollTo(0,0,300);
			} catch (e) {
				$obj.stop().animate({ scrollTop: 0 }, 300);
			};
		});
		
		this.bodyFullsize($obj);
		return dfd.promise();
	};
	
	
	
	
	var __bodyScrollinDfd = function($obj) {
		var dfd = $obj.data('bodyScrollinDfd') || $.Deferred();
		$obj.data('bodyScrollinDfd', dfd);
		return dfd;
	};
	
	var __bodyScrollinObj = function($obj) {
		if (!$obj || !$obj.length || ($obj[0] && $obj[0].target)) {
			if ($.mobile && $.mobile.activePage) {
				$obj = $.mobile.activePage.find('[data-role=content]');
			} else {
				$obj = $('[data-role=content]').first();
			}
		}
		return $obj;
	};
	
	var __initBodyScrollin = function($obj, $wrap, content) {
		var iS = new iScroll($obj[0], {
			// allow to control forms and select text!
			onBeforeScrollStart: function(e) {
				var ok = ['INPUT', 'TEXTAREA', 'SELECT', 'RADIO'];
				if (ok.indexOf(e.target.tagName.toUpperCase()) != -1) return true;
				e.preventDefault();
			},
			onScrollEnd: function() {
				$obj.data('iScrollLeft', this.x);
				$obj.data('iScrollTop', this.y);
			}
		});
		
		$obj.data('iScroll', iS);
		$obj.data('bodyScrollinInit', true);
		//$wrap.html(content);
		iS.refresh();
	};
	
	var __updateBodyScrollin = function($obj, $wrap) {
		try {
			$obj.data('iScroll').refresh();
		} catch (e) {};
	};
	
	
	
	
	/**
	 * Automagically Setup
	 * setting up using only DOM attribute causes a flashing during page
	 * initalization.
	 *
	 * it is real better to call bodyScrollin($target) in "pagecreate" event!
	 */
	$(document).delegate('[data-role="page"]', 'pageshow', function() {
		setTimeout(function() {
			var $candidate = $('[data-role="page"]:visible [data-scrollin="true"]');
			if ($candidate.length) App.bodyScrollin($candidate);
		}, 10);
	});
	
});