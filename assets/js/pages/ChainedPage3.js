/**
 * ---[[   B O I L E R P L A T E   ]]---
 * JqueryMobile + BackboneJS + RequireJS
 * =====================================
 *
 * Chained Dynamic Pages Example
 * 
 */


define([
	'jquery', 'underscore', 'jqmbr/backbone'

], function(
	$, _, Backbone

) {
	
	
	var ChainedPage3 = Backbone.jqmbr.PageView.extend({
		
		pageDefaults: {
			autoRender: true,
			id: 		'chained-page-3',
			title: 		'ChainedPage3',
			html:		'now you can go back!'
		}
	});
	
	
	
	
	return ChainedPage3;
	
});