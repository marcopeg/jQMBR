/**
 * ---[[   B O I L E R P L A T E   ]]---
 * JqueryMobile + BackboneJS + RequireJS
 * =====================================
 *
 * JQueryMobile Button
 *
 */
define([
	'jquery', 'underscore', 'backbone',
	'./view.GeneralView'

], function(
	$, _, Backbone,
	GeneralView

) {
	
	var BtnView = GeneralView.extend({
		
		tagName: 'a',
		
		initialize: function(options) {
			
			this.options = $.extend({}, {
				href:		'#back',
				show:		'',
				title:		'',
				icon:		'',
				iconPos:	'',
				theme:		null,
				right:		null,
				
				id:			'Link' + this.cid.charAt(0).toUpperCase() + this.cid.slice(1),
				class:		'',
				style:		'',
				attrs:		{},
				
				onClick:	this.onClick,
				autoRender:	false
				
			}, options || {});
			
			
			if (this.options.right == true) {
				this.options.class += ' ui-btn-right ';
			}
			
			
			this.$el
				.append(this.options.show)
				.attr('href', 	this.options.href)
				.attr('title', 	this.options.title)
				.attr('id', 	this.options.id)
				.attr('class', 	this.options.class)
				.attr('style', 	this.options.style)
				.attr('data-role', 'button')
			;
			
			// some known attributes from the global configuration
			if (this.options.theme) 			this.options.attrs["data-theme"] 		= this.options.theme;
			if (this.options.icon.length) 		this.options.attrs["data-icon"] 		= this.options.icon;
			if (this.options.iconPos.length) 	this.options.attrs["data-iconpos"] 		= this.options.iconPos;
			
			
			_.each(this.options.attrs, function(val, key) {
				this.$el.attr(key, val);
			}, this);
			
			this.$el.on('vclick', _.bind(this.options.onClick, this));
			
			// export parent property
			this.parent = this.options.parent;
			if (this.parent && !this.options.container && this.options.container !== false) {
				this.options.container = this.parent;
			}
			
			// auto append to existing DOM
			if (!this.$el.parent().length && this.options.container) {
				this.appendTo(this.options.container);
			}
			
			this.autoRender();
		},
		
		render: function() {
			
			// auto append to existing DOM
			if (!this.$el.parent().length && this.options.container) {
				this.appendTo(this.options.container);
			}
			
			this.$el.button();
			return this;
		}
		
	});
	
	BtnView.prototype.onClick = function(e) {
		this.trigger('click', e);
	};
	
	BtnView.prototype.click = function(e) {
		this.$el.click();
	};
	
	
	return BtnView;
	
});