/**
 * ---[[   B O I L E R P L A T E   ]]---
 * JqueryMobile + BackboneJS + RequireJS
 * =====================================
 *
 * PaheView extension configured to act as first page to be loaded into the App
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
			return $.extend({}, PageView.prototype.defaults.apply(this, options), {
				autoRender: 	true,
				loading: 		false,
				changePage: 	false,
				backBtn:		false
			}, this.pageDefaults);
		}
	});
	
	
	return EntryPageView;
	
});