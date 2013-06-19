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
	'./view.GeneralView'

], function(
	$, _, Backbone,
	GeneralView

) {
	
	
	
	var _itemView = GeneralView.extend({
		tagName: 'li',
		render: function() {
			this.$el.html('item: ' + this.model.cid);
		}
	});
	
	var ListView = GeneralView.extend({
		
		tagName: 	'ul',
		itemView: 	_itemView,
		
		inset:		false,
		theme:		null,
		
		initialize: function() {
			this.options = $.extend({}, {
				itemView: 		this.itemView,
				inset:			this.inset,
				theme:			this.theme,
				beforeRender:	this.beforeRender,
				afterRender:	this.afterRender
			}, this.options);
			
			this.$el.attr('data-role', 'listview');
			if (this.options.inset) this.$el.attr('data-inset', true);
			if (this.options.theme) this.$el.attr('data-theme', this.options.theme);
			
		},
		
		render: function() {
			this.$el.html('');
			this.items = [];
			
			this.options.beforeRender.apply(this, arguments);
			this.collection.each(function(item) {
				this.items.push(new this.options.itemView({
					parent: this,
					model: 	item
				}).renderTo(this.$el));
			}, this);
			
			this.options.afterRender.apply(this, arguments);
			
			return this;
		},
		
		beforeRender: 	function() {},
		afterRender: 	function() {}
	});
	
	
		
	
	return ListView;
	
});