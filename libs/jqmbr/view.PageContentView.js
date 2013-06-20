/**
 * ---[[   B O I L E R P L A T E   ]]---
 * JqueryMobile + BackboneJS + RequireJS
 * =====================================
 *
 * JQueryMobile PageContentView
 *
 */
define([
	'jquery', 'underscore', 'backbone',
	'./view.GeneralView',

], function(
	$, _, Backbone,
	GeneralView

) {
	
	var PageContentView = GeneralView.extend({
		
		initialize: function(options) {
			
			this.options = $.extend({}, {
				html:		'',
				attrs:		{}
			}, options || {});
			
			
			// apply custom attributes
			_.each($.extend({},{
				'data-role':	'content'
			},this.options.attrs), function(val, key) {this.$el.attr(key, val)}, this);
			
			this.$el.html(this.options.html);
			
			
		}
		
	});
	
	
	
	return PageContentView;
	
});