/**
 * ---[[   B O I L E R P L A T E   ]]---
 * JqueryMobile + BackboneJS + RequireJS
 * =====================================
 *
 * Load all AppClass modules in a single call
 *
 */

define([
	'jquery',
	'./AppClass',
	'./app.utils',
	'./app.utils.View',
	'./app.bodyFullsize',
	'./app.loadGmap'
	

], function(
	$,
	AppClass
) {
	
	return AppClass;
});