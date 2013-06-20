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
	
	
	var ChainedPage2 = Backbone.jqmbr.PageView.extend({
		
		pageDefaults: {
			autoRender: true,
			id: 		'chained-page-2',
			title: 		'ChainedPage2',
			scrollin:	true
		},
		
		pageInitialize: function() {
			console.log("initialize");
		},
		
		beforePageCreate: function() {
			
			var $ul = $('<ul data-role="listview">');
			for (var i=0; i<100; i++) {
				$ul.append('<li>para '+i+'</li>');
			}
			this.content.$el.append($ul);
			
			new Backbone.jqmbr.BtnView({
				href:		'#ChainedPage3',
				show: 		'Go',
				icon: 		'arrow-r',
				iconPos: 	'right'
			}).renderTo(this.header.$el);
			
		}
	});
	
	
	
	
	return ChainedPage2;
	
});