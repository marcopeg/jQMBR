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
	
	AppClass.prototype.utils.rpad = function(number, length) {
		var str = '' + number;
		while (str.length < length) {
		    str = str + '0';
		}
		return str;		
	}
	
	
	AppClass.prototype.utils.nl2br = function(str, is_xhtml) {
		var breakTag = (is_xhtml || typeof is_xhtml === 'undefined') ? '<br ' + '/>' : '<br>'; // Adjust comment to avoid issue on phpjs.org display
		return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + breakTag + '$2');
	};
	
	
	
	/**
	 * return a sortable date string from a javascript date object
	 * YYYYMMDD[HHMM]
	 */
	AppClass.prototype.utils.strDate = function(date, time) {
		
		// try to convert timestamp to date object
		// accept timestamp with or without microseconds!
		if (!(date instanceof Date)) {
			try {
				date = new Date(parseInt(App.utils.rpad(date.toString(), 13)));
			} catch(e) {
				return false;
			}
		}
		
		var str = date.getFullYear() + App.utils.lpad(date.getMonth()+1,2) + App.utils.lpad(date.getDate(),2);
		if (time == true) {
			str+= App.utils.lpad(date.getHours());
			str+= App.utils.lpad(date.getMinutes());
		}
		return str;
	};
	
	
	
	/**
	 * create a date object form various string formats
	 * - timestamp (with or without microseconds); timestam must be at least 10 characters long!
	 * - sortable date string (20130530) - may conflict with timestamp!
	 * - today
	 * - yesterday
	 * - otherday, yesterday2 (l'altro ieri)
	 */
	AppClass.prototype.utils.str2date = function(str) {
		str = str.toString();
		var date = false;
		switch(str) {
			case 'today':
				date = new Date();
				break;
			case 'yesterday':
				date = new Date();
				date.setDate(date.getDate()-1);
				break;
			case 'yesterday2':
			case 'otherday':
				date: new Date();
				date.setDate(date.getDate()-2);
				break;
			// sortable string "20130530" or timestamp (with or without microseconds
			default:
				if (str.length == 8) {
					date = new Date(str.substring(0, 4), parseInt(str.substring(4, 6))-1, str.substring(6, 8));
				} else {
					date = new Date(parseInt(App.utils.rpad(str, 13)));
				}
				break;
		}
		return date;
	};
	
	
	return AppClass;
	
});