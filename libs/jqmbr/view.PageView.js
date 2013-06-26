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
	'jqmbr/view.GeneralView',
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
			this._pagecreate 	= $.Deferred();
			this._pageshow 		= $.Deferred();
			this._pagehide		= $.Deferred();
			
			// loading widget implementation (with autoRender enabled)
			if (this.options.loading && this.options.autoRender != false) {
				$.mobile.loading("show");
				this.ready(function() {$.mobile.loading("show")});
			}
			
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
			/*
			this.$el.on('pagecreate', 	_.bind(this.options.pageCreate	, this));
			this.$el.on('pageshow', 	_.bind(this.options.pageShow	, this));
			this.$el.on('pagehide', 	_.bind(this.options.pageHide	, this));
			*/
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
		
		render: function(options) {
			
			options = $.extend({}, this.options, options||{});
			
			// loading widget implementation (without autorender enabled)
			if (options.loading && options.autoRender === false) {
				$.mobile.loading("show");
				this.ready(function() {$.mobile.loading("show")});
			}
			
			// callback
			options.beforePageCreate.apply(this, arguments);
			
			if (!this.$el.parent().length) {
				this.$el.appendTo('body');
			}
			
			// activate bodyScrollin behavior
			if (options.scrollin) App.bodyScrollin(this.content.$el);
			
			
			this.show(options);
			return this;
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
				$.mobile.changePage(this.$el, $.extend({}, {
					dataUrl: options.id
				}, options || {}, options.changePage));
			}
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