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
	
	var GeneralCollection = Backbone.Collection.extend();
	
	
	$.extend(GeneralCollection.prototype, {
		ready:		AppClass.prototype.utils.View.ready,
		error:		AppClass.prototype.utils.View.error,
		setReady:	AppClass.prototype.utils.View.setReady,
		setError:	AppClass.prototype.utils.View.setError,
		setFailed:	AppClass.prototype.utils.View.setFailed
	});
	
	return GeneralCollection;
	
});