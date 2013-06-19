/**
 * ---[[   B O I L E R P L A T E   ]]---
 * JqueryMobile + BackboneJS + RequireJS
 * =====================================
 *
 *
 */
define(['jquery', 'underscore'], function($, _) {
	
	/**
	 * Constructor
	 */
	var LocaleClass = function(options) {
		
		options = $.extend({}, {
			name:		'AppName',
			version:	'001'
		}, options||{});
		
		this.name 		= options.name;
		this.version 	= options.version;
	};
	
	
	
	/**
	 * Combine a data key with db name and version
	 */
	LocaleClass.prototype.key = function(key) {
		return this.name + '-' + this.version + '_' + key;
	};
	
	
	
	/**
	 * localStorage low level access with versioned database name
	 */
	
	LocaleClass.prototype.check = function(key) {
		var tmp = this.read(key);
		return !(_.isUndefined(tmp) || _.isNull(tmp));
	};
	
	LocaleClass.prototype.read = function(key) {
		var val = localStorage.getItem(this.key(key));
		if (!val) return;
		
		// try to parse JSON data
		try {
			val = JSON.parse(val);	
		} catch(e) {};
		
		return val;
	};
	
	LocaleClass.prototype.write = function(key, val) {
		if (_.isObject(val)) {
			val = JSON.stringify(val);
		}
		localStorage.setItem(this.key(key), val);
		return this.check(key);
	};
	
	LocaleClass.prototype.remove = function(key) {
		localStorage.removeItem(this.key(key));
		return !this.check(key);
	};
	
	
	
	
	return LocaleClass;
	
});