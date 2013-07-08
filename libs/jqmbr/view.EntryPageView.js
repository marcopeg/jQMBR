/**
 * ---[[   B O I L E R P L A T E   ]]---
 * JqueryMobile + BackboneJS + RequireJS
 * =====================================
 *
 * PageView extension configured to act as first page to be loaded into the App
 *
 */
define([
	'jquery', 'underscore', 'backbone',
	'./view.PageView',

], function(
	$, _, Backbone,
	PageView

) {
	
	
	var EntryPageView = PageView.extend({
		defaults: function(options) {
			return $.extend({}, PageView.prototype.defaults.apply(this, arguments), {
				autoRender: 	true,
				loading: 		false,
				changePage: 	false,
				backBtn:		false
			}, this.pageDefaults);
		},
		render: function() {
			PageView.prototype.render.apply(this, arguments);
			$('body').show();
			$.mobile.initializePage();
			return this;
		},
		show: function() {
			return this;
		}
	});
	
	
	return EntryPageView;
	
});