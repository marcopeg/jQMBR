/**
 * ---[[   B O I L E R P L A T E   ]]---
 * JqueryMobile + BackboneJS + RequireJS
 * =====================================
 *
 * JQueryMobile PageHeaderView
 *
 */
define([
	'jquery', 'underscore', 'backbone',
	'./view.LinkView'

], function(
	$, _, Backbone,
	LinkView

) {
	
	var PageHeaderView = Backbone.View.extend({
		
		initialize: function(options) {
			
			this.options = $.extend({}, {
				title:		'',
				titleTag:	PageHeaderView.prototype.titleTag || 'h1',
				backBtn:	true,
				theme:		PageHeaderView.prototype.theme || '',
				attrs:		{}
			}, options || {});
			
			this.$el
				.attr('data-role', 'header')
				.attr('data-theme', this.options.theme)
			;
			
			// apply custom attributes
			_.each(this.options.attrs, function(val, key) {this.$el.attr(key, val)}, this);
			
			this.initializeTitle();
			this.initializeBackBtn();
			
			
			//console.log(this.$el.html());
			
		}
		
	});
	
	
	/**
	 * Some global static configurations
	 */
	PageHeaderView.prototype.theme 			= '';
	PageHeaderView.prototype.titleTag 		= '';
	PageHeaderView.prototype.backBtnShow 	= 'Back';
	PageHeaderView.prototype.backBtnIcon 	= 'arrow-l';
	
	
	PageHeaderView.prototype.initializeTitle = function(btn) {
		this.$title = $('<' + this.options.titleTag + '>').appendTo(this.$el);
		this.$title.append(this.options.title);
	};
	
	PageHeaderView.prototype.initializeBackBtn = function(btn) {
		btn = btn || this.options.backBtn;
		if (btn === false) return;
		if (btn === true) btn = {
			show: 	PageHeaderView.prototype.backBtnShow,
			icon: 	PageHeaderView.prototype.backBtnIcon,
			rel:	'back'
		};
		
		var linkOptions = {
			show:	btn.show,
			attrs: {}
		};
		
		$.extend(linkOptions.attrs, {
			"data-icon" 		: btn.icon,
			"data-rel"			: btn.rel,
			"data-direction" 	: "reverse"
		}, btn.attrs);
		
		this.backBtn = new LinkView(linkOptions);
		this.$el.prepend(this.backBtn.$el);
		
	};
	
	
	
		
	
	
	
	
	
	return PageHeaderView;
	
});