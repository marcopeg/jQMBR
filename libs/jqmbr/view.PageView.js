/**
 * ---[[   B O I L E R P L A T E   ]]---
 * JqueryMobile + BackboneJS + RequireJS
 * =====================================
 *
 * JQueryMobile PageView
 *
 */
define([
	'jquery', 'underscore', 'backbone',
	'./view.GeneralView',
	'./view.PageHeaderView',
	'./view.PageContentView',
	'./view.PageFooterView',
	'./app.bodyScrollin'

], function(
	$, _, Backbone,
	GeneralView,
	PageHeaderView,
	PageContentView,
	PageFooterView

) {
	
	
	var PageView = GeneralView.extend({
		
		/**
		 * Specialized end point pages should use this property to
		 * customize general properties and behaviours
		 */
		pageDefaults: {},
		
		/**
		 * Allow to override defaults in sub classes
		 */
		defaults: function(options) {
			
			// allow to define "pageDefaults" as function
			if (_.isFunction(this.pageDefaults)) {
				this.pageDefaults = this.pageDefaults.apply(this, arguments);
			}
			
			return $.extend({}, {
				id:				'Page' + this.cid.charAt(0).toUpperCase() + this.cid.slice(1),
				title:			'', // title for page header
				html:			'', // raw HTML content for the page
				theme:			'c',
				headerTheme:	'b',
				footerTheme:	'b',
				attrs:			{},
				
				// back button management
				backBtn:		true,				// set to "history" to implement history back with backbone router...
				onBackBtn:		this.onBackBtn,
				destroyOnBack: 	true,
				
				// implement loading widget until page ready
				loading:		true,
				
				header: 		true,
				content: 		true,
				footer: 		false,
				
				// events callbacks
				pageInitialize:		this.pageInitialize,
				beforePageCreate: 	this.beforePageCreate,
				pageCreate:			this.pageCreate,
				pageShow:			this.pageShow,
				pageHide:			this.pageHide,
				
				// general change page configuration used when render and display this page
				changePage: 	{},
				
				// auto rendering options
				autoRender:		false,		// [false|true|ready]
				
				// bodyScrollin behavior
				scrollin:		true
			}, this.pageDefaults);
			
		},
		
		initialize: function(options) {
			var that = this;
			
			this.options = $.extend({}, this.defaults(options), options || {});
			
			// these DeferredObjects are solved
			this._pageinject	= $.Deferred();		// when page is injected into the DOM
			this._pagecreate 	= $.Deferred();
			this._pageshow 		= $.Deferred();
			this._pagehide		= $.Deferred();
			
			// loading widget implementation (with autoRender enabled)
			try {
				if (this.options.loading && this.options.autoRender != false) {
					$.mobile.loading("show");
					this.ready(function() {$.mobile.loading("show")});
				}
			} catch(e) {};
			
			// apply custom attributes
			_.each($.extend({},{
				id:				this.options.id,
				'data-role':	'page',
				'data-theme':	this.options.theme
			},this.options.attrs), function(val, key) {this.$el.attr(key, val)}, this);
			
			// page main pieces
			this.header 	= null;
			this.content 	= null;
			this.footer 	= null;
			
			this._initializeHeader();
			this._initializeContent();
			this._initializeFooter();
			
			
			// apply bodyScrollin data attribute
			// try to restore scroll position when bage get visible
			// (es after a back of another page)
			if (this.options.scrollin) {
				this.content.$el.attr('data-scrollin', 'true');
				this.$el.on('pagebeforehide', function() {
					that._resetScroll = that.content.$el.data('iScrollTop');
				});
				this.$el.on('pageshow', function() {
					if (!that._resetScroll) return;
					that.content.$el.data('iScroll').scrollTo(0, that._resetScroll, 300);
				});
			}
			
			
			// callback
			this.options.pageInitialize.apply(this, arguments);
			
			// bind jQueryMobile page events
			this.$el.on('pagecreate', function(e) {
				that._pagecreate.resolveWith(that);
				that.options.pageCreate.apply(that, arguments);
			});
			this.$el.on('pageshow', function(e) {
				that._pageshow.resolveWith(that);
				that.options.pageShow.apply(that, arguments);
			});
			this.$el.on('pagehide', function(e) {
				that._pagehide.resolveWith(that);
				that.options.pageHide.apply(that, arguments);
			});
			
			// refresh on content changes
			this.on('contentchanged', _.bind(this.refresh, this));
			
			// destroy page on back button option
			if (this.options.destroyOnBack) {
				this.on('backbtnclick', function() {
					that.$el.on('pagehide', function() {
						that.destroy();
					});
				});
			}
			
			// handle auto rendering
			this.autoRender();
		},
		
		
		/**
		 * Drop HTML into body's DOM
		 * "_pageinject" deferred is solved when first run!
		 */
		create: function(options) {
			var self 	= this;
			var _dfd 	= $.Deferred();
			options 	= $.extend({}, this.options, options||{});
			
			// if page is already dropped into the body there is no need to proceed
			if (this.$el.parent().length) {
				_dfd.resolveWith(this);
				return _dfd.promise();
			}
			
			// create DOM callback
			// should return a DeferredObject if complex actions performed!
			$.when(options.beforePageCreate.apply(this, arguments)).then(function() {
				
				// append to body
				self.$el.appendTo('body');
				
				// activate bodyScrollin behavior
				// page's body can listen to internal DOM changes and update iScroll!
				if (options.scrollin) {
					App.bodyScrollin(self.content.$el).done(function() {
						self.content.observe();
						self.content.on('contentchanged', function() {
							self.trigger('contentchanged');
						});
					});
					
				};
				
				// slightly delay page creation to fix strange behavior in Android's fake browser
				setTimeout(function(){_dfd.resolveWith(self)}, 100);
				
			});
			
			_dfd.done(function() {
				self._pageinject.resolveWith(self);
			});
			
			return _dfd.promise();
		},
		
		
		/**
		 * Invoke a "changePage" to show that page.
		 * it listen to 
		 */
		show: function(options) {
			
			// local options are overridden by every other options!
			// they are used 
			var localOptions = {};
			try {
				if (window.App._goingBack === true) {
					localOptions.reverse = true;
					window.App._goingBack = null;
				}
			} catch(e) {};
			
			options = $.extend({}, localOptions, this.options, options||{});
			
			if (options.changePage !== false) {
				try {
					$.mobile.changePage(this.$el, $.extend({}, {
						dataUrl: options.id
					}, options || {}, options.changePage));
				} catch(e) {};
			}
			
		},
		
		
		
		/**
		 * Complete process of DOM creation and page display
		 */
		render: function(options) {
			var self = this;
			options = $.extend({}, this.options, options||{});
			
			// loading widget implementation (without autorender enabled)
			try {
				if (options.loading && options.autoRender === false) {
					$.mobile.loading("show");
					this.ready(function() {$.mobile.loading("hide")});
				}
			} catch(e) {};
			
			// create and show
			$.when(this.create(options)).then(function() {
				self.show(options);
			});
			
			return this;
		},
		
		
		
		
		
		
		
		/**
		 * Refresh a page after content changed
		 * - triggered by "contentchanged" on content
		 * - triggered by "contentchanged" on the page itself
		 *
		 * it is delayed to let transitions end.
		 * need a way to wait for all transitions to end!
		 */
		refresh: function() {
			var self = this;
			clearTimeout(this._refreshTimer);
			this._refreshTimer = setTimeout(function() {
				
				// update iScroll
				iS = self.content.$el.data('iScroll')
				if (iS) iS.refresh();
				
			}, 500);
		},
		
		
		
		
		remove: function() {
			this.$el.remove();
		},
		
		destroy: function() {
			this.remove();
			this.header = null;
			this.content = null;
			this.footer = null;
			this.options = null;
		}
		
	});
	
	
	
	
	
	PageView.prototype._initializeHeader = function() {
		if (this.options.header === false ) return;
		if (this.options.header === true) this.options.header = {};
		
		
		if (this.options.scrollin) {
			if (this.options.header === true) this.options.header = {};
			if (_.isObject(this.options.header)) {
				this.options.header = $.extend({}, {fixed:true}, this.options.header);
			}
		}
		
		if (this.options.backBtn == 'history') {
			this.options.backBtn = true;
			this.options.onBackBtn = function(e) {
				e.preventDefault();
				try {window.App.back()} catch(e) {};
			};
		}
		
		this.header = new PageHeaderView($.extend({}, {
			title:		this.options.title,
			theme:		this.options.headerTheme,
			backBtn:	this.options.backBtn,
			onBackBtn:	_.bind(this.options.onBackBtn, this)
		}, this.options.header, {
			page: 		this
		}));
		this.$el.append(this.header.$el);
		
	};
	
	PageView.prototype._initializeContent = function() {
		if (this.options.content === false ) return;
		if (this.options.content === true) this.options.content = {};
		this.content = new PageContentView($.extend({}, this.options.content, {
			page: this,
			html: this.options.html
		}));
		this.$el.append(this.content.$el);
	};
	
	PageView.prototype._initializeFooter = function() {
		if (this.options.footer === false ) return;
		if (this.options.footer === true) this.options.content = {};
		this.footer = new PageFooterView($.extend({}, {
			theme:		this.options.footerTheme
		}, this.options.footer, {
			page: 		this
		}));
		this.$el.append(this.footer.$el);
	};
	
	
	
	
	/**
	 * Child object callbacks
	 */
	PageView.prototype.pageInitialize 	= function() {};
	PageView.prototype.beforePageCreate = function() {};
	PageView.prototype.pageCreate 		= function() {};
	PageView.prototype.pageShow 		= function() {};
	PageView.prototype.pageHide 		= function() {};
	PageView.prototype.onBackBtn 		= function(e) {};
	
	
	
	
	
	
	/**
	 * Back Action
	 * (using header's back btn if available)
	 */
	PageView.prototype.back = function() {
		if (this.header && this.header.backBtn) {
			this.header.backBtn.click();
		}
	};
	
	
	return PageView;
	
});