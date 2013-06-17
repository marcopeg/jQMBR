/**
 * ---[[   B O I L E R P L A T E   ]]---
 * JqueryMobile + BackboneJS + RequireJS
 * =====================================
 *
 * split a panel into 2 resizable sub panels.
 *
 * // two horizontal resizable panels
 * var _splitH = new SplitView({
 * 	 el: $('#container'),
 *   p1: $('#container .left'),
 *   p2: $('#container .right'),
 *   split: .25
 * });
 *
 *
 * OPTIONS
 * ==========
 *
 * ### p1, p2: sub-panels
 * should be Backbone Views, jQuery objects, XPath strings or simple strings.
 * it is not mandatory DOM existance, they should be appended by the view's component itself
 * 
 *
 *
 * ### split
 * define panels size configuration.
 * it take values from 0-1 with or withoud decimal.
 *
 * if you set something like ".25" you mean "the first panel is 25% of available space,
 * second panel is calculated"
 *
 * "0" means "use first panel fixed dimensions and adapt second panel"
 * "1" means "use second panel fixed dimensions and adapt first panel"
 *
 * You can give a dimension string "250px" or "-250px" to set first or second
 * panel dimension, the other panel will adapt!
 * 
 * 
 * 
 * ### resizable (bool)
 * if true display a resize handler and allow resizing with drag'n drop behavior
 * (require jqueryUI.draggable to be loaded)
 *
 *
 *
 * ### type
 * [horizontal/vertical]
 *
 *
 *
 *
 * ### updateEvt
 * the name of an element to listen on "this.$el" to trigger internal render()
 *
 *
 *
 *
 * ### propagationChain (array)
 * a list of Backbone.View where to trigger "render()" after this view renders.
 * is a panel is a BackboneView it is automagically appended to that list.
 *
 */
define(['jquery', 'underscore', 'backbone'], function($, _, Backbone) {
	
	
	if (!window.__jQMBR__SplitViewIdsCollections) {
		window.__jQMBR__SplitViewIdsCollections = [];
	}
	
	var __getNewId = function() {
		var id = 'SplitView' + window.__jQMBR__SplitViewIdsCollections.length + 1;
		window.__jQMBR__SplitViewIdsCollections.push(id);
		return id;
	};
	
	var SplitView = Backbone.View.extend({
		
		initialize: function(options) {
			this.options = $.extend({}, {
				id:					__getNewId(),
				startupDfd:			true,			// delay initialization for a DFD to resolve (es full page load...)
				updateEvt:			false,			// bind render() to an event triggered on View.el
				type: 				'horizontal',
				split:				.5,
				resizable: 			'auto',
				p1:					$('<div>'),
				p2:					$('<div>'),
				
				// a list of Backbone.View on wich to call render() after instance render itself.
				propagationChain:	[],
				
				// prevent fixed header and footer to go away when clicking on the body
				stopClickPropagation:true,
				
				// enable fadeIn effect in place of "show" when panels are ready.
				startHidden:		true,
				fadeIn:				true 
			}, (options || {}));
			
			// hide panel at startup
			if (this.options.startHidden) this.$el.hide();
			
			this.ready = $.Deferred();
			this._rendered = false;
			
			// delayed initialization
			$.when(options.startupDfd).then(_.bind(function() {
				this._initialize();
			}, this));
			
		},
		
		// go on with initialization after delay
		_initialize: function() {
			
			this.type 				= this.options.type;
			this.split 				= this.options.split;
			this.propagationChain 	= this.options.propagationChain;
			
			
			/**
			 * Apply an internal wrapper
			 */
			this.$wrap = $('<div>').attr('id', this.options.id).appendTo(this.$el);
			
			
			/**
			 * Prevent click propagation option
			 * when you click into the body fixed headers may disappear and this may be a very
			 * owful behavior!
			 */
			if (this.options.stopClickPropagation) {
				this.$wrap.on('click', function(e) {
					e.stopPropagation();
				});
			}
			
			/**
			 * Identify sub panels DOM items from jQuery objects or Backbone.View instances
			 */
			if (this.options.p1 instanceof $) {
				this.$p1 = this.options.p1;
			} else if (this.options.p1 instanceof Backbone.View) {
				this.$p1 = this.options.p1.$el;
				this.chainTo(this.options.p1);
			} else if (typeof this.options.p1 == 'object') {
				this.options.p1 = new SplitView(this.options.p1);
				this.$p1 = this.options.p1.$el;
				this.chainTo(this.options.p1);
			} else {
				var _test = $(this.options.p1);
				if (_test.length) {
					this.$p1 = _test;
					delete(_test);
				} else {
					this.$p1 = $('<div>').html(this.options.p1);
				}
			}
			
			if (this.options.p2 instanceof $) {
				this.$p2 = this.options.p2;
			} else if (this.options.p2 instanceof Backbone.View) {
				this.$p2 = this.options.p2.$el;
				this.chainTo(this.options.p2);
			} else if (typeof this.options.p2 == 'object') {
				this.options.p2 = new SplitView(this.options.p2);
				this.$p2 = this.options.p2.$el;
				this.chainTo(this.options.p2);
			} else {
				var _test = $(this.options.p2);
				if (_test.length) {
					this.$p2 = _test;
					delete(_test);
				} else {
					this.$p2 = $('<div>').html(this.options.p2);
				}
			}
			
			/**
			 * Apply wrappers to each panel
			 */
			this.$w1 = $('<div>').attr('id', this.options.id+'W1').append(this.$p1);
			this.$w2 = $('<div>').attr('id', this.options.id+'W2').append(this.$p2);
			
			
			/**
			 * Move panel's wrappers inside SplitView wrapper
			 */
			this.$wrap.append(this.$w1);
			this.$wrap.append(this.$w2);
			
			
			/**
			 * Assign custom Classes
			 */
			this.$el.addClass('uxSplitView');
			this.$w1.addClass('uxSplitViewPanel');
			this.$w2.addClass('uxSplitViewPanel');
			this.$p1.addClass('uxSplitViewInnerPanel');
			this.$p2.addClass('uxSplitViewInnerPanel');
			this.$wrap.addClass('uxSplitViewWrap');
			switch (this.type) {
				case 'horizontal':
					this.$el.addClass('uxSplitViewH');
					this.$w1.addClass('uxSplitViewLPanel');
					this.$w2.addClass('uxSplitViewRPanel');
					this.$p1.addClass('uxSplitViewLInnerPanel');
					this.$p2.addClass('uxSplitViewRInnerPanel');
					this.$wrap.addClass('uxSplitViewWrapH');
					break;
				case 'vertical':
					this.$el.addClass('uxSplitViewV');
					this.$w1.addClass('uxSplitViewTPanel');
					this.$w2.addClass('uxSplitViewBPanel');
					this.$p1.addClass('uxSplitViewTInnerPanel');
					this.$p2.addClass('uxSplitViewBInnerPanel');
					this.$wrap.addClass('uxSplitViewWrapV');
					break;
			}
			
			
			
			
			/**
			 * [string split]
			 * assing a fixed value to first or second panel
			 * "250px" -> 250px to first panel, second adapt
			 * "-250px" -> 250px to second panel, first adapt
			 */
			if (typeof this.split == 'string') {
				if (this.split.substr(0, 1) == '-') {
					switch (this.type) {
						case 'horizontal':
							this.$w2.css('width', Math.abs(parseInt(this.split)));
							break;
						case 'vertical':
							this.$w2.css('height', Math.abs(parseInt(this.split)));
							break;
					}
					this.split = 1;
				} else {
					switch (this.type) {
						case 'horizontal':
							this.$w1.css('width', this.split);
							break;
						case 'vertical':
							this.$w1.css('height', this.split);
							break;
					}
					this.split = 0;
				}
			}
			
			
			
			/**
			 * [1/0] split value means the first or last panel
			 * have a fixed dimension and the other adapts.
			 *
			 * 0 = first panel (left/top)
			 * 1 = last panel (right/bottom)
			 */
			if ((this.split === 1 || this.split === 0) && this.options.resizable == 'auto') {
				this.options.resizable = false;
			}
			
			
			
			/**
			 * Initialize Resizable Behavior
			 */
			if (this.options.resizable != false) {
				this.initializeResizable();
			}
			
			/**
			 * Bind to self-render event
			 */
			if (this.options.updateEvt) {
				this.$el.on(this.options.updateEvt, $.proxy(this.render, this));
			}
			
			/**
			 * Display SplitView panel!
			 */
			if (this.options.fadeIn) {
				this.$el.fadeIn();
			} else {
				this.$el.show();
			}
			
			this.render();
			
		},
		
		
		
		/**
		 * Render action is delayed to reduce performance issues
		 * when bind rendering to continuos events (resize)
		 */
		render: function() {
			clearTimeout(this._delayedRender);
			this._delayedRender = setTimeout($.proxy(this._render, this), 10);
			return this.$el;
		},
		
		_render: function() {
			switch (this.type) {
				case 'horizontal':
					this.renderH();
					break;
				case 'vertical':
					this.renderV();
					break;
			}
			
			// tell rendering was done
			this.$p1.trigger('splitviewresize');
			this.$p2.trigger('splitviewresize');
			this.trigger('splitviewrender');
			
			
			
			
			/**
			 * iScroll Integration
			 * need iScroll plugin to be loaded
			 * need data-iscroll="true" attribute on panel object
			 */
			if (window.iScroll) {
				if (this.$p1.attr('data-iscroll') == "true") {
					var iS1 = this.$w1.data('iScroll');
					if (!iS1) {
						iS1 = new iScroll(this.$w1.attr('id'));
						this.$w1.data('iScroll', iS1);
					} else {
						iS1.refresh();
					}
				}
				if (this.$p2.attr('data-iscroll') == "true") {
					var iS2 = this.$w2.data('iScroll');
					if (!iS2) {
						iS2 = new iScroll(this.$w2.attr('id'));
						this.$w2.data('iScroll', iS2);
					} else {
						iS2.refresh();
					}
				}
			}
			
			
			
			// resolve "ready" deferred at first time rendering
			if (!this._rendered) {
				this.ready.resolveWith(this);
				this._rendered = true;
			}
			
			// propagate rendering to sub SplitView objects
			_.each(this.propagationChain, function(view) {
				view.render();
			});
		},
		
		renderH: function() {
			var _hV = this.$wrap.height();
			var _wV = this.$wrap.width();
			
			// left panel fixed width
			if (this.split === 0) {
				var _w1 = this.$p1.outerWidth();
				this.$w2.css({
					width:	_wV - _w1,
					height:	_hV
				});
			
			// right panel fixed width
			} else if (this.split === 1) {
				var _w1 = this.$w2.outerWidth();
				this.$w1.css({
					width:	_wV - _w1,
					height:	_hV
				});
			
			// both panels width are dynamic!
			} else {
				var _w1 = Math.floor(_wV * this.split);
				var _w2 = _wV - _w1;
				this.$w1.css({
					width:	_w1,
					height:	_hV
				});
				this.$w2.css({
					width:	_wV - _w1,
					height:	_hV
				});
			}
			
			// place resizer
			if (this.$resizer) {
				var _r12 = this.$resizer.width()/2;
				this.$resizer.css({
					top:	this.$el.height() / 2 - _r12,
					left: 	_w1 - _r12
				});
			}
		},
		
		renderV: function() {
			var _hV = this.$wrap.height();
			var _wV = this.$wrap.width();
			
			// top panel fixed width
			if (this.split === 0) {
				var _h1 = this.$w1.outerHeight();
				this.$w2.css({
					width:	_wV,
					height:	_hV - _h1
				});
			
			// bottom panel fixed width
			} else if (this.split === 1) {
				var _h1 = this.$w2.outerHeight();
				this.$w1.css({
					width:	_wV,
					height:	_hV - _h1
				});
			
			// both panels width are dynamic!
			} else {
				var _h1 = Math.floor(_hV * this.split);
				var _h2 = _hV - _h1;
				this.$w1.css({
					width:	_wV,
					height:	_h1
				});
				this.$w2.css({
					width:	_wV,
					height:	_hV - _h1
				});
			}
			
			// place resizer
			if (this.$resizer) {
				var _r12 = this.$resizer.width()/2;
				this.$resizer.css({
					top: 	this.$w1.outerHeight() - _r12,
					left: 	this.$wrap.width() / 2 - _r12
				});
			}
		},
		
		
		
		
		/**
		 * Append new object to propagation chain
		 */
		chainTo: function(view) {
			if ($.inArray(view, this.propagationChain)) {
				this.propagationChain.push(view);
			}
		},
		
		
		
		
		/**
		 * Resizable Handler is an optional behavior of this widget
		 */
		
		initializeResizable: function() {
			this.$resizer = $('<div>').appendTo(this.$wrap);
			this.$resizer.addClass('uxSplitViewResizer');
			switch (this.type) {
				case 'horizontal':
					var _resizable = {axis:'x'};
					this.$resizer.addClass('uxSplitViewResizerH');
					break;
				case 'vertical':
					var _resizable = {axis:'y'};
					this.$resizer.addClass('uxSplitViewResizerV');
					break;
			}
			
			this.$resizer.draggable($.extend({},{
				containment: 	"parent",
				stop:			$.proxy(this.onDragStart, this),
				drag: 			$.proxy(this.onDragging, this),
				stop:			$.proxy(this.onDragStop, this),
			},_resizable));
		},
		
		onDragStart: function() {
			this.$p1.trigger('splitresizestart');
			this.$p2.trigger('splitresizestart');
		},
		
		onDragStop: function() {
			this.$p1.trigger('splitresizestop');
			this.$p2.trigger('splitresizestop');
		},
		
		onDragging: function(e, ui) {
			switch (this.type) {
				case 'horizontal':
					this.split = (ui.position.left + this.$resizer.width() / 2) / this.$el.width();
					break;
				case 'vertical':
					this.split = (ui.position.top + this.$resizer.height() / 2) / this.$el.height();
					break;
			}
			this.render();
		}
		
	});
	
	
	
	
	
	
	
	
	
	/**
	 * Widget Custom Styles
	 */
	var _style = ''
		+ '<style type="text/css">'
		
		+ '.uxSplitView {display:block;height:100%;}'
		+ '.uxSplitViewH {}'
		+ '.uxSplitViewV {}'
		
		+ '.uxSplitViewWrap {position:relative;display:block;height:100%;overflow:hidden;padding:0 !important}'
		+ '.uxSplitViewWrapH {}'
		+ '.uxSplitViewWrapV {}'
		
		+ '.uxSplitViewPanel {position:absolute;top:0;left:0;display:block;overflow:auto;margin:0 !important;padding:0 !important}'
		+ '.uxSplitViewInnerPanel {overflow:hidden}'
		
		+ '.uxSplitViewWrapH>.uxSplitViewPanel {height:100%}'
		+ '.uxSplitViewLPanel {border-right:1px solid #fff}'
		+ '.uxSplitViewRPanel {left:auto;right:0;border-left:1px solid #666}'
		
		+ '.uxSplitViewWrapV>.uxSplitViewPanel {width:100%}'
		+ '.uxSplitViewTPanel {border-bottom: 1px solid #fff}'
		+ '.uxSplitViewBPanel {top:auto;bottom:0;border-top:1px solid #666}'
		
		+ '.uxSplitViewResizer {position:absolute;top:0;left:0;z-index:999;display:block;width:30px;height:30px;content:" ";cursor:move;border-radius:15px;box-shadow:1px 1px 2px #fff;background-color:#666}'
		+ '.uxSplitViewResizer {background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAABQCAYAAABrjzfBAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAK6wAACusBgosNWgAAABx0RVh0U29mdHdhcmUAQWRvYmUgRmlyZXdvcmtzIENTNXG14zYAAAAYdEVYdENyZWF0aW9uIFRpbWUAMjEtMDUtMjAxM7Jov6EAAAIfSURBVGiB7dk/bsIwFAbwLwwdm2zduvQCvVWn3CHX6OQuqOIWvQFSxV6JE1hFCrIIfR2aUMexC/HLnwq9T4oEvJD3kwEH2QkR4T9nMTfgXATIjQC5ESA30cAkSToHgBSAApB6anEhoqjDc52UiNb0kzURpYP0GQLo4Jq0kLMBA7gOchagD1dV1daHnBzow2mtVwDutNYrD3LyEVzsdrtXB5fVn3xmI+vzovokRHF/t+qpI9NaPwNAlmVPALR1SqtGRLp7lQv6MIHA76j5AKdadJ8BgBclts/13uqaEJEiItW31qcBZx5U1lSinOu2apNPM0SUHg6Hd2pHeXBUnzf9PJjn+YMxZuMgP+wnxphNnucPcwD/QrZwABZzAYNIG8f6rg8A7CBd3H8AnpBa65WL4wCHvpMsANwC+ATw5QKj+sS+capc/61u7AiQGwFyI0BuBMiNALkRIDcC5EaA3AiQGwFyI0BurgsY2N1cA1CemqprvJ3P2AUj6u40KaumrNdZO59RH3Hd8A3AY/Pafr+/8T2uz3lzkX2a9RpBz8i522CAsxXmjuSY64OX4M4iRwMej8cXu1tVVdsA7oR0t2fra4wDLIri3rNgHtyoIWc7whizKYrifjQgwqv6HaQPF7Pi3/tHcgnyL9yoPxIrHWRZlsumWJblMoSbCthChqYZH25K4AmJwDTjw/UFyio/NwLkRoDcCJAbAXIjQG4EyM03faruDv/UgxsAAAAASUVORK5CYII=)}'
		+ '.uxSplitViewWrapH>.uxSplitViewResizer {background-position: -5px -45px}'
		+ '.uxSplitViewWrapV>.uxSplitViewResizer {background-position: -6px -2px}'
		
		+ '</style>';

	
	/**
	 * Add custom styles
	 */
	$(document).ready(function() {$(_style).appendTo('head');});
	
	
	
	
	
	return SplitView;
	
});