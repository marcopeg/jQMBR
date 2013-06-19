/**
 * ---[[   B O I L E R P L A T E   ]]---
 * JqueryMobile + BackboneJS + RequireJS
 * =====================================
 *
 * 
 *
 */
define([
	'jquery', 'underscore', 'backbone',
	'jqmbr/app.utils.View'

], function(
	$, _, Backbone,
	AppClass

) {
	
	var GeneralModel = Backbone.Model.extend();
	
	$.extend(GeneralModel.prototype, {
		ready:		AppClass.prototype.utils.View.ready,
		setReady:	AppClass.prototype.utils.View.setReady,
		setFailed:	AppClass.prototype.utils.View.setFailed
	});
	
	return GeneralModel;
	
});