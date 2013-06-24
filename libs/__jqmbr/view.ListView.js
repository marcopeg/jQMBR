/**
 * ---[[   B O I L E R P L A T E   ]]---
 * JqueryMobile + BackboneJS + RequireJS
 * =====================================
 *
 * 
 *
 */
define([
	'jquery', 'underscore', 'backbone',
	'./view.GeneralView',
	'./view.TemplateView'

], function(
	$, _, Backbone,
	GeneralView,
	TemplateView

) {
	
	
	
	var _itemView = TemplateView.extend({
		tagName: 	'li',
		template:	'item: <%= model.cid %>',
		events: 	{"click" : "onClick"},
		onClick: function(e) {
			this.parent.trigger('disclose', e, this.model, this);
		}
	});
	
	var ListView = GeneralView.extend({
		
		tagName: 	'ul',
		itemView: 	_itemView,
		itemTpl:	'--item--',
		itemConfig:	{},
		
		inset:		false,
		theme:		null,
		
		initialize: function() {
			this.options = $.extend({}, {
				container:		null,						// DOM element to append content to
				itemView: 		this.itemView,				// a ViewClass to use to render each item
				itemTpl:		this.itemTpl,				// a template string (or function) to give to the default itemView
				itemConfig:		this.itemConfig,			// a set of configurations to give to each item sub view
				inset:			this.inset,
				theme:			this.theme,
				afterInitialize:this.afterInitialize,
				beforeRender:	this.beforeRender,
				afterRender:	this.afterRender,
				disclose:		this.disclose,
				autoRender:		true
			}, this.options);
			
			this.$el.attr('data-role', 'listview');
			if (this.options.inset) this.$el.attr('data-inset', true);
			if (this.options.theme) this.$el.attr('data-theme', this.options.theme);
			
			// run disclose callback
			this.on('disclose', _.bind(this.options.disclose, this));
			
			this.options.afterInitialize.apply(this, arguments);
			this.autoRender();
		},
		
		render: function() {
			
			// auto append to existing DOM
			if (!this.$el.parent().length && this.options.container) {
				this.appendTo(this.options.container);
			}
			
			this.$el.html('');
			this.items = [];
			
			this.options.beforeRender.apply(this, arguments);
			this.collection.each(function(item) {
				
				// @TODO: may be a function??
				var cfg = this.options.itemConfig;
				
				var cfg = $.extend({}, cfg, {
					parent: this,
					model: 	item
				});
				
				// @TODO: may be a function??
				if (this.options.itemTpl && this.options.itemTpl != ListView.prototype.itemTpl) {
					cfg.template = this.options.itemTpl;
				}
				
				// create subView and render to the list
				this.items.push(new this.options.itemView(cfg).renderTo(this));
			}, this);
			
			this.options.afterRender.apply(this, arguments);
			
			return this;
		},
		
		afterInitialize:function() {},
		beforeRender: 	function() {},
		afterRender: 	function() {},
		disclose:		function(e, model, item) {}
	});
	
	
		
	
	return ListView;
	
});