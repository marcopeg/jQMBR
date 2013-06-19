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
	'./view.PageFooterView'

], function(
	$, _, Backbone,
	GeneralView,
	PageHeaderView,
	PageContentView,
	PageFooterView

) {
	
	
	var PageView = GeneralView.extend({
	
		/**
		 * Allow to override defaults in sub classes
		 */
		defaults: function(options) {
			return {
				id:				'Page' + this.cid.charAt(0).toUpperCase() + this.cid.slice(1),
				title:			'', // title for page header
				html:			'', // raw HTML content for the page
				theme:			'c',
				headerTheme:	'b',
				attrs:			{},
				
				// back button management
				backBtn:		true,
				onBackBtn:		this.onBackBtn,
				
				header: 		true,
				content: 		true,
				footer: 		false,
				
				// events callbacks
				beforeCreate: 	this.beforePageCreate,
				pageCreate:		this.onPageCreate,
				pageShow:		this.onPageShow,
				pageHide:		this.onPageHide,
				
				// general change page configuration used when render and display this page
				changePage: 	{},
				
				// auto rendering options
				autoRender:		false		// [false|true|ready]
			};
		},
		
		initialize: function(options) {
			
			this.options = $.extend({}, this.defaults(options), options || {});
			
			// apply custom attributes
			_.each($.extend({},{
				id:				this.options.id,
				'data-role':	'page',
				'data-theme':	this.options.theme
			},this.options.attrs), 
				function(val, key) {this.$el.attr(key, val)}, this);
			
			// page main pieces
			this.header 	= null;
			this.content 	= null;
			this.footer 	= null;
			
			this._initializeHeader();
			this._initializeContent();
			this._initializeFooter();
			
			this.$el.on('pagecreate', 	_.bind(this.options.pageCreate	, this));
			this.$el.on('pageshow', 	_.bind(this.options.pageShow	, this));
			this.$el.on('pagehide', 	_.bind(this.options.pageHide	, this));
			
			// handle auto rendering
			this.autoRender();
		},
		
		render: function(options) {
			this.options.beforeCreate.apply(this, arguments);
			if (!this.$el.parent().length) {
				this.$el.appendTo('body');
			}
			$.mobile.changePage(this.$el, $.extend({}, {
				dataUrl: this.options.id
			}, options || {}, this.options.changePage));
			return this;
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
		this.footer = new PageFooterView($.extend({}, this.options.footer, {
			page: this
		}));
		this.$el.append(this.footer.$el);
	};
	
	
	
	
	/**
	 * Child object callbacks
	 */
	PageView.prototype.beforePageCreate = function() {};
	PageView.prototype.onPageCreate 	= function() {};
	PageView.prototype.onPageShow 		= function() {};
	PageView.prototype.onPageHide 		= function() {};
	PageView.prototype.onBackBtn 		= function() {};
	
	
	
	
	
	
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