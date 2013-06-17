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
	'./view.PageHeaderView',
	'./view.PageContentView',
	'./view.PageFooterView'

], function(
	$, _, Backbone,
	PageHeaderView,
	PageContentView,
	PageFooterView

) {
	
	var PageView = Backbone.View.extend({
		
		/**
		 * Allow to override defaults in sub classes
		 */
		defaults: function(options) {
			return {
				id:			'Page' + this.cid.charAt(0).toUpperCase() + this.cid.slice(1),
				title:		'', // title for page header
				html:		'', // raw HTML content for the page
				theme:		'c',
				attrs:		{},
				
				// back button management
				backBtn:	true,
				onBackBtn:	this.onBackBtn,
				
				header: 	true,
				content: 	true,
				footer: 	false,
				
				// events callbacks
				pageCreate:	this.onPageCreate,
				pageShow:	this.onPageShow,
				pageHide:	this.onPageHide,
				
				// general change page configuration used when render and display this page
				changePage: {}
			};
		},
		
		initialize: function(options) {
			
			this.options = $.extend({}, this.defaults(options), options || {});
			
			this.$el
				.attr('id', this.options.id)
				.attr('data-role', 'page')
				.attr('data-theme', this.options.theme)
			;
			
			// apply custom attributes
			_.each(this.options.attrs, function(val, key) {this.$el.attr(key, val)}, this);
			
			this.header 	= null;
			this.content 	= null;
			this.footer 	= null;
			
			this._initializeHeader();
			this._initializeContent();
			this._initializeFooter();
			
			this.$el.on('pagecreate', 	_.bind(this.options.pageCreate	, this));
			this.$el.on('pageshow', 	_.bind(this.options.pageShow	, this));
			this.$el.on('pagehide', 	_.bind(this.options.pageHide	, this));
			
		},
		
		render: function(options) {
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
	
	
	
	PageView.prototype.onPageCreate = function() {};
	PageView.prototype.onPageShow 	= function() {};
	PageView.prototype.onPageHide 	= function() {};
	PageView.prototype.onBackBtn 	= function() {};
	
	
	
		
	
	
	
	
	
	return PageView;
	
});