/**
 * ---[[   B O I L E R P L A T E   ]]---
 * JqueryMobile + BackboneJS + RequireJS
 * =====================================
 *
 * JQueryMobile PageFooterView
 *
 */
define([
	'jquery', 'underscore', 'backbone'

], function(
	$, _, Backbone

) {
	
	var PageFooterView = Backbone.View.extend({
		
		initialize: function() {
			
			this.$el.attr('data-role', 'footer');
			
		}
		
	});
	
	
	
	
	
	
	
		
	
	
	
	
	
	return PageFooterView;
	
});