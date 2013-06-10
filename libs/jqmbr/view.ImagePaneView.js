/**
 * ---[[   B O I L E R P L A T E   ]]---
 * JqueryMobile + BackboneJS + RequireJS
 * =====================================
 *
 *
 */
define([
	'jquery', 'underscore', 'backbone',
	'plugins/jquery.easing'

], function(
	$, _, Backbone

) {
	
	var ImagePaneView = Backbone.View.extend({
		
		initialize: function(options) {
			
			if (typeof options == 'object' && options instanceof jQuery) {
				this.el = options[0];
				this.$el = options;
				options = {};
			}
			
			this.options = $.extend({}, {
				src:				'',
				mode:				'',		// [contain(default)|cover|zoom]
				startupDfd:			true,	// delay startup rendering to a DFD to be complete (optional)
				updateEvt:			false,	// bind rendering to an event triggered on view.$el
				
				draggable:			true,
				changeEvt:			'click',
				resizeDuration:		200
			}, (options || {}));
			
			
			// reference to existing image or create new DOM element
			this.$img = this.$el.find('img');
			if (!this.$img) {
				this.$img = $('<img>').attr('src', options.src);
			}
			
			// image empty properties
			this.imageReady = false;
			this.m = null;	// active display mode [contain|fit|zoom]
			this.f = null;	// image format [p=portrait|l=landscape]
			this.w = 0;		// image original width
			this.h = 0;		// image original height
			this.r = 0;		// image ratio
			
			
			// setup custom classes to the view container
			this.$el.addClass('uxImagePaneView');
			
			// launch component setup when both image have been loaded and container is ready!
			$.when(this.imageLoad(), this.options.startupDfd).then($.proxy(this.setup, this));
			
		},
		
		
		/**
		 * Setup original image details and build user interactions
		 */
		setup: function() {
			//console.log("setup");
			this.imageReady = true;
			this.w = this.$img.width();
			this.h = this.$img.height();
			this.r = this.w / this.h;
			this.f = this.r > 1 ? 'l' : 'p';
			
			//console.log(this.w +'x' + this.h + " // " + this.r + " - " + this.f);
			
			// enable behaviors
			this.enable();
			
			// first render and display content image
			this.render();
			setTimeout($.proxy(function() {
				this.$img.show();
			}, this), this.options.resizeDuration);
		},
		
		
		/**
		 * Enable pane behaviors like dragging and changing view mode
		 */
		enable: function() {
			if (this.options.draggable) {
				this.$img.draggable({
					stop:			$.proxy(this.onDragStart, this),
					drag: 			$.proxy(this.onDragging, this),
					stop:			$.proxy(this.onDragStop, this),
				});
			}
			if (this.options.changeEvt) {
				this.$img.on(this.options.changeEvt, $.proxy(function(e) {
					e.preventDefault();
					var dfd = $.Deferred();
					if (this.m == 'zoom') {
						if (this.options.mode != 'zoom') {
							this._render(dfd);
						} else {
							this._renderContain(dfd);
						}
					} else {
						this._renderZoom(dfd);
					}
				}, this));
			}
			if (this.options.updateEvt) {
				this.$el.on(this.options.updateEvt, $.proxy(function(e) {
					e.preventDefault();
					this.render();
				}, this));
			}
		},
		
		
		/**
		 * Disable every pane behaviors
		 */
		disable: function() {
			if (this.options.draggable) {
				this.$img.draggable('destroy');
			}
			
			if (this.options.changeEvt) {
				this.$img.off(this.options.changeEvt);
			}
			
			if (this.options.updateEvt) {
				this.$el.off(this.options.updateEvt);
			}
		},
		
		
		/**
		 * Reset to initial status and detach all behaviors
		 */
		destroy: function() {
			this.disable();
			this.$el.removeClass('uxImagePaneView');
			this.$img.width(this.w).height(this.h).hide();
		},
		
		
		
		
		
		
		
		/**
		 * Render action is delayed to reduce performance issues
		 * when bind rendering to continuos events (resize)
		 */
		render: function() {
			this._render();
			return this.$el;
		},
		
		_rendering: false,
		_render: function() {
			
			if (!this.imageReady) return $.Deferred();
			
			switch (this.options.mode) {
				case 'zoom':
					return this._renderZoom();
				case 'cover':
					return this._renderCover();
				default:
					return this._renderContain();
			}
			
		},
		
		
		/**
		 * Image is full contained into container and some margins are visible
		 * around image itself where image ratio discard container's ratio
		 * 
		 * @TODO: do not scale image bigger than original!
		 */
		_renderContain: function() {
			var dfd = $.Deferred();
			this.m	= 'contain';
			
			var _w = 0;
			var _h = 0;
			var _t = 0;
			var _l = 0;
			
			if (this.canvasRatio() > this.r) {
				_h = this.$el.height();
				_w = _h * this.r;
				_l = (this.$el.width() - _w) / 2;
			} else {
				_w = this.$el.width();
				_h = _w / this.r;
				_t = (this.$el.height() - _h) / 2;
			}
			
			this.$img.stop().animate({
				width: 	_w,
				height: _h,
				top:	_t,
				left:	_l
			}, this.options.resizeDuration, 'expoinout', $.proxy(function() {
				if (this.options.draggable) {
					this.$img.draggable('disable');
				}
				dfd.resolveWith(this);
			}, this));
			
			return dfd.promise();
		},
		
		
		/**
		 * Image fit all available space with lower dimension
		 * other dimension is centered so image can move on
		 * single axis.
		 *
		 * @TODO: do not scale image bigger than original!
		 */
		_renderCover: function() {
			var dfd = $.Deferred();
			this.m	= 'cover';
			
			var _w = 0;
			var _h = 0;
			var _t = 0;
			var _l = 0;
			
			if (this.canvasRatio() > this.r) {
				_w = this.$el.width();
				_h = _w / this.r;
				_t = 0 - (_h - this.$el.height()) / 2;
			} else {
				_h = this.$el.height();
				_w = _h * this.r;
				_l = 0 - (_w - this.$el.width()) / 2;
			}
			
			this.$img.stop().animate({
				width: 	_w,
				height: _h,
				top:	_t,
				left:	_l
			}, this.options.resizeDuration, 'expoinout', $.proxy(function() {
				if (this.options.draggable) {
					this.$img.draggable('enable');
				}
				dfd.resolveWith(this);
			}, this));
			
			return dfd.promise();
		},
		
		/**
		 * Full zoom in and center image into the canvas
		 */
		_renderZoom: function() {
			var dfd = $.Deferred();
			this.m	= 'zoom';
			
			var _w = this.w;
			var _h = this.h;
			var _t = 0;
			var _l = 0;
			
			if (_w > this.$el.width()) {
				_l = 0 - (_w - this.$el.width()) / 2;
			} else {
				_l = (this.$el.width() - _w) / 2;
			}
			
			if (_h > this.$el.height()) {
				_t = 0 - (_h - this.$el.height()) / 2;
			} else {
				_t = (this.$el.height() - _h) / 2;
			}
			
			this.$img.stop().animate({
				width: 	_w,
				height: _h,
				top:	_t,
				left:	_l
			}, this.options.resizeDuration, 'expoinout', $.proxy(function() {
				if (this.options.draggable) {
					this.$img.draggable('enable');
				}
				dfd.resolveWith(this);
			}, this));
			
			return dfd.promise();
		},
		
		
		
		onDragStart: function() {
			//console.log('dragstart');
		},
		
		onDragStop: function() {
			//console.log('dragend');
		},
		
		onDragging: function(e, ui) {
			//console.log("dragging");
		},
		
		
		
		
		
		/**
		 * Return component canvas format.
		 * [l=landscape|p=portrait]
		 */
		canvasFormat: function() {
			if (this.$el.width() > this.$el.height()) {
				return 'l';
			} else {
				return 'p';
			}
		},
		
		canvasRatio: function() {
			return this.$el.width() / this.$el.height();
		},
		
		
		/**
		 * Detect when target image being loaded.
		 * It solve a DFD object so you can attach multiple
		 * callbacks at any time!
		 *
		 * Explicit callback is optional and it is run before
		 * any other attached callbacks!
		 */
		imageLoad: function(callback) {
			var dfd 	= $.Deferred();
			
			// setup DOM agnostic image object to detect it's loading
			// independently from original DOM object
			var _img = new Image();
			
			// image load event handler
			$(_img).load($.proxy(function() {
				dfd.resolveWith(this);
				_img = null;
			}, this));
			
			// startup loading!
			_img.src = this.$img.attr('src');
			
			return dfd.promise();
		},
		
		
		
		/**
		 * Utility to connect an ImagePane to a SplitView panel
		 */
		connectToSplitViewPanel: function($panel) {
			$panel.on('splitviewresize', $.proxy(function() {
				this.$el.width($panel.width());
				this.$el.height($panel.height());
				this.render();
			}, this));
		}
		
	});
	
	
	
	
	
	
	
	
	
	/**
	 * Widget Custom Styles
	 */
	var _style = ''
		+ '<style type="text/css">'
		
		+ '.uxImagePaneView {overflow:hidden;position:relative}'
		+ '.uxImagePaneView img {display:none;position:absolute;top:0;left:0}'
				
		+ '</style>';

	
	/**
	 * Add custom styles
	 */
	$(document).ready(function() {$(_style).appendTo('head');});
	
	
	return ImagePaneView;
	
});