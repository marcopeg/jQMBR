/**
 * ---[[   B O I L E R P L A T E   ]]---
 * JqueryMobile + BackboneJS + RequireJS
 * =====================================
 *
 *
 */

requirejs.config({
	baseUrl: 'assets/js/',
	urlArgs: "devTime=" + (new Date()).getTime(),
	paths: {
		lib:		'../../libs',
		jqueryui:	'../../libs/jqueryui/jquery-ui-1.9.2.custom.min',
		jqueryuit:	'../../libs/jqueryui/jquery.ui.touch-punch',
		plugins:	'../../libs/jquery-plugins',
		jqm: 		'../../libs/jqm/jquery.mobile-1.3.1',
		backbone: 	'../../libs/backbonejs-1.0.0/backbone',
		underscore: '../../libs/underscorejs-1.4.4/underscore',
		jqmbr:		'../../libs/jqmbr'
	},
	shim: {
		'underscore': {
			deps: ['jquery'],
			exports: '_'
		},
		'backbone': {
			deps: ['underscore', 'jquery'],
			exports: 'Backbone'
		},
		'jqueryui' : {
			deps: ['jquery']
		},
		'jqueryuit' : {
			deps: ['jqueryui']
		},
		'jqm' : {
			deps: ['jquery']
		},
		'plugins' : {
			deps: ['jquery']
		}
	}
});





/**
 * jQuery AND jQueryMobile Setup
 */
;(function($){

	$.ajaxSetup({
		timeout: 60000
	});
	
	$(document).on('mobileinit', function() {
		
		$.extend($.mobile, {
			defaultPageTransition: 	'slide',
			autoInitializePage:		false,
		t:3});
		
		
		$(document).ajaxStart(function(){
			$.mobile.loading('show');
		});
		
		$(document).ajaxStop(function(){
			$.mobile.loading('hide');
		});		
		
	});

})(jQuery);






/**
 * Load Application Entry Point
 */
require(['require.main']);


