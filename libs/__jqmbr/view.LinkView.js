/**
 * ---[[   B O I L E R P L A T E   ]]---
 * JqueryMobile + BackboneJS + RequireJS
 * =====================================
 *
 * Generic Link
 *
 */
define([
	'jquery', 'underscore', 'backbone',
	'./view.GeneralView'

], function(
	$, _, Backbone,
	GeneralView

) {
	
	var LinkView = GeneralView.extend({
		
		tagName: 'a',
		
		initialize: function(options) {
			
			this.options = $.extend({}, {
				href:		'#back',
				show:		'',
				title:		'',
				icon:		'',
				iconPos:	'',
				
				id:			'Link' + this.cid.charAt(0).toUpperCase() + this.cid.slice(1),
				class:		'',
				style:		'',
				attrs:		{},
				
				onClick:	this.onClick
				
			}, options || {});
			
			this.$el
				.append(this.options.show)
				.attr('href', 	this.options.href)
				.attr('title', 	this.options.title)
				.attr('id', 	this.options.id)
				.attr('class', 	this.options.class)
				.attr('style', 	this.options.style)
			;
			
			// some known attributes from the global configuration
			if (this.options.icon.length) this.options.attrs["data-icon"] = this.options.icon;
			if (this.options.iconPos.length) this.options.attrs["data-iconpos"] = this.options.iconPos;
			
			
			_.each(this.options.attrs, function(val, key) {
				this.$el.attr(key, val);
			}, this);
			
			this.$el.on('click', _.bind(this.options.onClick, this));
			
		}
		
	});
	
	LinkView.prototype.onClick = function(e) {
		this.trigger('click', e);
	};
	
	LinkView.prototype.click = function(e) {
		this.$el.click();
	};
	
	
	return LinkView;
	
});