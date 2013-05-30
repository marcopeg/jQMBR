/**
 * ScrollSticky Plugin
 * ===================
 *
 * Apply this plugin to any item to prevent them to scroll outside viewport.
 * Useful for menus and badges.
 *
 * // Sticky it to the top of the page
 * $('#target').scrollSticky();
 *
 * // Sticky it at 200px from the top of the page
 * $('#target').scrollSticky({
 *   offset: 200
 * });
 *
 * // Sticky it at 200px from the top of the page then
 * // push up at 100px from the bottom of the page
 * $('#target').scrollSticky({
 *   offset: 200,
 *   clearfix: 100
 * });
 *
 */



;(function($){
	
	var _targets, _scrollTop, _check, _pushUp;
	
	_targets = [];
	
	
	
	
	/**
	 * It is responsible of "push-up" behavior
	 */ 
	_pushUp = function( scrollTop, e ) {
		
		// Refresh stikyStop position to pushUp stiky element
		_stickyStop.call( this );
		
		// Check for clearfix behaviors delimitation params
		if ( !this.stickyStop || !$(this.cfg.clearfix).length ) return;
		
		// Dinamic calculates "stopTop" by linked clearfix item position
		var stopTop	= this.stickyStop;
		if ( stopTop === 'auto' ) stopTop = $(this.cfg.clearfix).first().offset().top;
		stopTop -= scrollTop;
		
		// Apply an offset to the clearfix delimiter
		if ( this.cfg.clearfixOffset ) stopTop -= this.cfg.clearfixOffset;
		
		
		var stickyBottom 	= this.cfg.stickyTop + this.$.outerHeight();
		
		var delta = stopTop - stickyBottom;
		
		if ( delta < 0 ) {
			this.$.css( 'top', this.cfg.stickyTop + delta );
			
		} else {
			this.$.css( 'top', this.cfg.stickyTop );
			
		}
		
	}
	
	
	
	
	/**
	 * It is responsible of sticky/unsticky target object
	 */
	_check = function( scrollTop, e ) {
		
		
		// Refresh stikyStart position if not already sticky.
		if ( !this.$.hasClass(this.cfg.stickyClass) ) _stickyStart.call( this );
		
		
		// CALLBACK: Scrolling Event
		this.cfg.scrolling.call( this.$, scrollTop, this, e );
		
		
		
		// Sticky Happens!
		if ( _scrollTop >= this.stickyStart ) {
			
			// Check for "pushUp" behavior and prevent multiple stiky events on the same item!
			if ( this.$.hasClass(this.cfg.stickyClass) ) return _pushUp.call( this, scrollTop, e );
			
			// Throw "onSticky" callback. Return "false" to block "sticky" behavior.
			if ( this.cfg.onSticky.call( this.$, scrollTop, this, e ) === false ) return;
			
			
			// Drop a placeholder element 
			if ( this.cfg.usePlaceholder ) {
				
				// Build placeholder
				this.$placeholder = $('<div>',{
					display:	'block',
					width:		this.$.outerWidth(),
					
					// height need to consider margins for blocking elements
					height:		this.$.outerHeight( this.$.css('display') === 'inline-block' || this.$.css('display') === 'block' ? true : false ),
					background: '#eee'
				}).addClass(this.cfg.placeholderClass);
				
				// Drop placeholder
				this.$.after( this.$placeholder );
			
			}
			
			
			// save actual inline stylesheet
			this.$.data('scrollSticky-style', this.$.attr('style') );
			
			
			// Sticky the element
			this.$.css({
				position: 	this.cfg.stickyPosition,
				top:		this.cfg.stickyTop,
				zIndex:		this.cfg.stickyZIndex,
				width:		this.$.width(),
				marginTop:	0
			}).addClass(this.cfg.stickyClass);
			
			
			
			// Apply pushup to the stiky element
			_pushUp.call( this, scrollTop, e );
			
			
		// Unsticky Happens!
		} else {
			
			// Check if it is already sticky to prevent multiple call to "onUnsticky" callback!
			if ( !this.$.hasClass(this.cfg.stickyClass) ) return;
			
			// Throw "onUnsticky" callback. Return "false" to block "unsticky" behavior.
			if ( this.cfg.onUnsticky.call( this.$, scrollTop, this, e ) === false ) return;
			
			// Remove the placeholder from the page (if present)
			if ( this.$placeholder != null ) {
				this.$placeholder.remove();
				this.$placeholder = null;
			}
			
			// Unsticky the element
			this.$.css({
				position: 	'relative',
				top:		'auto'
			}).removeClass(this.cfg.stickyClass);
			
			// reset inline stylesheet
			this.$.removeAttr('style');
			this.$.attr('style',this.$.data('scrollSticky-style'));
			
		}
		
		
	} // EndOf: "_check()"
	
	
	var _stickyStart = function() {
		
		// Calculates the scroll value to start fixed position.
		if ( this.cfg.stickyStart == 'auto' ) {
			
			// Consider object's margin-top value
			//var offsetTop = obj.$.offset().top - parseFloat(obj.$.css('marginTop').replace("px","")) ;
			var offsetTop = this.$.offset().top;
			
			this.stickyStart = offsetTop - this.cfg.stickyTop;
			
		} else {
			this.stickyStart = this.cfg.stickyStart;
			
		}

	}
	
	var _stickyStop = function() {
		
		// styckyTop string->number utility
		if ( typeof this.cfg.stickyStop === 'string' && parseInt(this.cfg.stickyStop).toString() === this.cfg.stickyStop  ) this.cfg.stickyStop = parseInt(this.cfg.stickyStop);
		
		// Setup a link to the element who push up the sticky
		if ( this.cfg.clearfix != null && typeof this.cfg.clearfix !== 'number' ) {
			this.stickyStop = 'auto';
		
		// Setup a distance from the bottom edge of the page to consider as clearfix.
		} else {
			this.stickyStop = $('body').outerHeight() - this.cfg.clearfix;
			
		}
		
	}
	
	
	
	$.fn.scrollSticky = function(cfg) {
		
		var i, found;
		
		var config = $.extend({},{
			stickyStart:		'auto',
			clearfix:			null,
			
			onSticky:			function( scrollTop, obj, e ) {},
			onUnsticky:			function( scrollTop, obj, e ) {},
			scrolling:			function( scrollTop, obj, e ) {},
			
			stickyPosition:		'fixed',
			stickyTop:			0,
			stickyZIndex:		9999,
			stickyClass:		'scrollsticky',
			
			usePlaceholder:		true,
			placeholderClass:	'scrollsticky-placeholder'
			
		},cfg);
		
		// new option name for "stickyTop"
		if ( config.offset ) config.stickyTop = config.offset;
		
		$(this).each(function(){
		
			var obj = {
				_:				this,
				$:				$(this),
				cfg:			config,
				stickyStart:	0,
				stickyStop:		null,
				
				placeholderId: 	null,
				$placeholder:	null
			}
			
			// Check object presence in _targets[] and update info.
			found = false;
			for ( i=0; i<_targets;i++ ) {
				if ( _targets[i]._ == this ) {
					found = true;
					_targets[i] = $.extend({},_targets[i],obj);
				}
			}
			
			// Append item to _targets[] if not found!
			if ( !found ) _targets.push(obj);
		
		
		});
		
		
		return this;
		
	};
	
	
	
	
	
	/**
	 * The Functional Code
	 * any ideas about this code optimization??
	 */
	
	$(window).bind('scroll',function(e){
		
		// Fetch the window's visible area info once for each scroll event.
		// (load balance optimization)
		_scrollTop = $(window).scrollTop();
		
		// Walk through the active items to define if they are visible or not!
		for ( var i=0; i<_targets.length; i++ ) _check.call( _targets[i], _scrollTop, e );
		
			
	});
	
	// Trigger the first scroll event to activate the scrollSticky plugin.
	// Delayed instruction is mandatory with firefox.
	$(document).ready(function(){ 
		
		// Webkit version
		if ( $.browser && $.browser.webkit ) {
			$(window).scroll( $(window).scrollTop() );
		
		// Other browsers version
		} else {
			setTimeout(function(){ $(window).trigger('scroll'); },1);
			
		}
		
	 });
	 
	 
	 
	 
	$(document).ready(function(){
	
		$("*[data-scrollsticky=on],*[data-scrollsticky=true]").each(function(){
			
			$(this).scrollSticky({
				offset: 			parseInt($(this).attr('data-scrollsticky-offset')) || null,
				clearfix:			$(this).attr('data-scrollsticky-clearfix') || null,
				clearfixOffset: 	parseInt($(this).attr('data-scrollsticky-clearfix-offset')) || null
			});
			
		});
		
	});	 
	 
	 
	
})(jQuery);
