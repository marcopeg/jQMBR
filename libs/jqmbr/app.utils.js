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
	'jquery', 'underscore', './AppClass'
	

], function(
	$, _, AppClass
	
) {
	
	
	
	/**
	 * Build utils namespaces
	 */
	AppClass.prototype.utils 		= {};
	
	
	
	
	
	/**
	 * random()
	 * return a randomization of given input:
	 *
	 * - [10]    return a number between 0 and 10
	 * - [5,10]  return a number between 5 and 10
	 * - [array] return a random array item
	 */
	AppClass.prototype.utils.random = function() {
		
		// array as input
		if (arguments.length == 1 && _.isArray(arguments[0])) {
			var from 	= 0;
			var to		= arguments[0].length-1;
			var _array	= arguments[0];
		
		// higer limit only, start from [0]
		} else if (arguments.length == 1) {
			var from 	= 0;
			var to 		= arguments[0];
		
		// lower and higer limits was given
		} else if (arguments.length == 2) {
			var from 	= arguments[0];
			var to 		= arguments[1];
		} else {
			return;
		}
		
		//console.log("random ["+from+" - "+ to +"]");
		
		if (_array) {
			return _array[Math.floor(Math.random() * (to - from + 1) + from)];
		} else {
			return Math.floor(Math.random() * (to - from + 1) + from);
		}
	};
	
	
	/**
	 * Array shuffle utility
	 */
	AppClass.prototype.utils.shuffle = function(o) {
	    for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
	    return o;
	};
	
	
	AppClass.prototype.utils.lpad = function(number, length) {
		var str = '' + number;
		while (str.length < length) {
		    str = '0' + str;
		}
		return str;		
	}
	
	
	
	return AppClass;
	
});