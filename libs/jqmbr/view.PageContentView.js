/**
 * ---[[   B O I L E R P L A T E   ]]---
 * JqueryMobile + BackboneJS + RequireJS
 * =====================================
 *
 * JQueryMobile PageContentView
 *
 */
define([
	'jquery', 'underscore', 'backbone'

], function(
	$, _, Backbone

) {
	
	var PageContentView = Backbone.View.extend({
		
		initialize: function(options) {
			
			this.options = $.extend({}, {
				html:		''
			}, options || {});
			
			this.$el.attr('data-role', 'content').append(this.options.html);
			
		}
		
	});
	
	
	
	
	
	
	
		
	
	
	
	
	
	return PageContentView;
	
});