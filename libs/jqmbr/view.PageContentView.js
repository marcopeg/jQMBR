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
				html:		''
			}, options || {});
			
			this.$el.attr('data-role', 'content').append(this.options.html);
			
		}
		
	});
	
	
	
	return PageContentView;
	
});