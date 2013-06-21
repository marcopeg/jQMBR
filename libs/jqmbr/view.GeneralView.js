/**
 * ---[[   B O I L E R P L A T E   ]]---
 * JqueryMobile + BackboneJS + RequireJS
 * =====================================
 *
 * A BackboneJS view who inherit all jQM{BR} utility methods
 *
 * It is best recommend to extend this component in place of using "AppClass.prototype.utils.View"
 * who become deprecated!
 *
 */
define([
	'jquery', 'underscore', 'backbone',
	'./app.utils.View'

], function(
	$, _, Backbone,
	AppClass

) {
	
	var GeneralView = Backbone.View.extend();
	$.extend(GeneralView.prototype, AppClass.prototype.utils.View);
	GeneralView.prototype._render = function() {return this};
	return GeneralView;
	
});