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
	'./view.GeneralView',
	'./view.BtnView'

], function(
	$, _, Backbone,
	GeneralView,
	BtnView

) {
	
	var PageHeaderView = GeneralView.extend({
		
		initialize: function(options) {
			
			this.options = $.extend({}, {
				title:		'',
				titleTag:	PageHeaderView.prototype.titleTag || 'h1',
				backBtn:	true,
				onBackBtn:	this.onBackBtn,
				theme:		PageHeaderView.prototype.theme || 'c',
				fixed:		true,
				attrs:		{}
			}, options || {});
			
			this.options.attrs['data-role'] = 'header';
			if (this.options.dataId) 	this.options.attrs['data-id'] 		= this.options.dataId;
			if (this.options.theme) 	this.options.attrs['data-theme'] 	= this.options.theme;
			if (this.options.fixed) 	this.options.attrs['data-position'] = 'fixed';
			
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
			rel:	'back',
		};
		
		var linkOptions = {
			show:	btn.show,
			icon:	btn.icon,
			attrs: 	{},
			onClick: _.bind(function(e) {
				this.options.page.trigger('backbtnclick', e);
				this.options.onBackBtn.call(this, e);
			}, this)
		};
		
		linkOptions.attrs = $.extend({}, {
			"data-rel"			: btn.rel,
			"data-direction" 	: "reverse"
		}, btn.attrs);
		
		this.backBtn = new BtnView(linkOptions);
		this.$el.prepend(this.backBtn.$el);
		
	};
	
	PageHeaderView.prototype.onBackBtn = function(e) {};
	
	
	
	
	
	return PageHeaderView;
	
});