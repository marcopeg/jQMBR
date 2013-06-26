/**
 * ---[[   B O I L E R P L A T E   ]]---
 * JqueryMobile + BackboneJS + RequireJS
 * =====================================
 *
 * JQueryMobile PageFooterView
 *
 */
define([
	'jquery', 'underscore', 'backbone',
	'./view.GeneralView',
	'./view.BtnView'

], function(
	$, _, Backbone,
	GeneralView,
	BtnView

) {
	
	var PageFooterView = GeneralView.extend({
		
		initialize: function(options) {
		
			this.options = $.extend({}, {
				title:		'',
				titleTag:	PageFooterView.prototype.titleTag || 'h2',
				theme:		PageFooterView.prototype.theme || 'c',
				fixed:		true,
				attrs:		{},
				
				// a set of buttons into the footerbar
				buttons: 	[],
				grouped:	true,
				centered:	true,
				
				// a set of actions displayed as toolbar
				actions:	[]
				
			}, options || {});
			
			
			this.options.attrs['data-role'] = 'footer';
			if (this.options.dataId) 	this.options.attrs['data-id'] 		= this.options.dataId;
			if (this.options.theme) 	this.options.attrs['data-theme'] 	= this.options.theme;
			if (this.options.fixed) 	this.options.attrs['data-position'] = 'fixed';
			
			// apply custom attributes
			_.each(this.options.attrs, function(val, key) {this.$el.attr(key, val)}, this);
			
			this.initializeTitle();
			this.initializeButtons();
		}
		
	});
	
	
	/**
	 * Some global static configurations
	 */
	PageFooterView.prototype.theme 			= '';
	PageFooterView.prototype.titleTag 		= '';
	
	
	PageFooterView.prototype.initializeTitle = function() {
		if (this.options.title.length) {
			this.$title = $('<' + this.options.titleTag + '>').appendTo(this.$el);
			this.$title.append(this.options.title);
		}
	};
	
	
	PageFooterView.prototype.initializeButtons = function() {
		
		this.buttons = [];
		if (!this.options.buttons.length) return;
		
		if (this.options.grouped) {
			var $wrap = $('<div data-role="controlgroup" data-type="horizontal" style="margin-left:5px;margin-right:5px;">').appendTo(this.$el);
		} else {
			var $wrap = this.$el;
		}
		
		if (this.options.centered) $wrap.css('text-align', 'center');
		
		_.each(this.options.buttons, function(cfg) {
			this.buttons.push(new BtnView(cfg).appendTo($wrap));
		}, this);
	};
	
	return PageFooterView;
	
});