/**
 * ---[[   B O I L E R P L A T E   ]]---
 * JqueryMobile + BackboneJS + RequireJS
 * =====================================
 *
 * App.loadGmap() 
 * loads GoogleMaps v3 APIs the asyncronous way.
 *
 * It run a given callback when API are ready.
 * It trigger "gmapsload" event on application global object
 * 
 * EXAMPLE:
 * App.loadGmap(function() {
 *   console.log("GMAP LOADED");
 * });
 */

define([
	'jquery',
	'./AppClass'
	

], function(
	$, 
	AppClass
	
) {
	
	var _App				= null;
	var _gmapIsLoading 		= false;
	var _gmapIsLoaded		= false;
	var _gmapIsLoadedDfd 	= $.Deferred();
	
	// handle a queque of callbacks to allo multiple parallel calls to loadGmap()
	var _queque			= new Array();
	
	AppClass.prototype.loadGmap = function(callback) {
		
		// internal settings
		_App = this;
		callback = callback || function() {};
		
		// basic configuration
		// you can setup these options into your App.initialize() method!
		this.gmapConfig = this.gmapConfig || {};
		this.gmapConfig = $.extend({}, {
			key:		'--YOUR-API--',
			sensor:		'false',
			libraries:	'geometry'
		}, this.gmapConfig);
		
		// queque requests callback to be runned in right order
		if (_gmapIsLoading) {
			_queque.push(callback);
			return _gmapIsLoadedDfd.promise();
		
		// set internal flag to teach application a loading is running
		// other parallel requests are quequed!
		} else {
			_gmapIsLoading = true;
		};
		
		
		// GMAP ASYNC LOADING
		if (!_gmapIsLoaded) {
			var script 	= document.createElement("script");
			script.type = "text/javascript";
			script.src 	= "http://maps.googleapis.com/maps/api/js?key="+this.gmapConfig.key+"&sensor="+this.gmapConfig.sensor+"&libraries="+this.gmapConfig.libraries+"&callback=googleMapaAsyncCallback";
			document.body.appendChild(script);
		} else {
			window.googleMapaAsyncCallback.call();
		};
		
		// GMAP ASYNC LOADED CALLBACK
		window.googleMapaAsyncCallback = function() {
			_gmapIsLoading 	= false;
			_gmapIsLoaded 	= true;
			
			// consume direct callback and callback queque
			callback.apply(_App);
			$.each(_queque, function(i,cb) {cb.call(_App)});
			
			// resolve global callback
			_gmapIsLoadedDfd.resolveWith(_App);
			
			// global event
			_App.trigger('gmapsload');
		}
		
		return _gmapIsLoadedDfd.promise();
	};
	
	
});