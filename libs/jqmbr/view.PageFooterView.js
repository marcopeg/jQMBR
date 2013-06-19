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

], function(
	$, _, Backbone,
	GeneralView

) {
	
	var PageFooterView = GeneralView.extend({
		
		initialize: function() {
			
			this.$el.attr('data-role', 'footer');
			
		}
		
	});
	
	return PageFooterView;
	
});