/**
 * ---[[   B O I L E R P L A T E   ]]---
 * JqueryMobile + BackboneJS + RequireJS
 * =====================================
 *
 * GmapView supplies a convenient API to display a GoogleMap into a container
 *
 */
define(['jquery', 'underscore', 'backbone'], function($, _, Backbone) {
	
	var GmapView = Backbone.View.extend({
		
		// instance options placeholder
		options: {},
		
		// Instance level DeferredObject
		// it solve after first rendering
		ready: null,
		
		_map: null,
		
		_renderTimeout: null,
		
		// this is a LatLng object computed from "options[center]" param
		// it is used at map initialization time
		_center: null,
		
		
		initialize: function(options) {
			
			this._defaults(options);
			
			this.ready = $.Deferred();
			this.ready.done(_.bind(this.onReady, this));
			
			// bind render() to events and trigger first rendering.
			// (an external callback should influence or prevent that logic!)
			if (check = this.afterInitialize() === false) return;
			$.when(check).then(_.bind(function() {
				this.options.resizeObj.on(this.options.resizeEvt, _.bind(this.render,this));
				this.render();	
			}, this));
			
		},
		
		
		/**
		 * Free memory and remove all behaviors
		 */
		destroy: function() {
			this.options.resizeObj.off(this.options.resizeEvt);
			this.mapEvents(false);
			this._map = null;
		},
		
		
		/**
		 * Real rendering of the map is delayed to prevent very near requests.
		 */
		render: function() {
			clearTimeout(this._renderTimeout);
			this._renderTimeout = setTimeout(_.bind(this._render, this), 50);
			return this.$el;
		},
		
		
		
		
		/**
		 * CALLBACK:
		 * triggered during initialization process just before to run first rendering.
		 *
		 * - it can return "false" to prevent rendering
		 * - it can return a DeferredObject to delay rendering untill some external
		 *   logic performs. So yoy can resolve() or reject() DFD deciding if to 
		 *   allow or prevent first rendering
		 */
		afterInitialize: function() {
			
			// prevent first rendering:
			/*
			return false;
			*/
			
			// perform some complex logic and allow first rendering
			/*
			var dfd = $.Deferred();
			setTimeout(function() {
				dfd.resolve();
			}, 3000);
			return dfd;
			*/
			
			// perform some complex logic but prevent first rendering
			/*
			var dfd = $.Deferred();
			setTimeout(function() {
				dfd.reject();
			}, 3000);
			return dfd;
			*/
		},
		
		
		
		/**
		 * CALLBACK:
		 * triggered at first time map initialization process.
		 * it receive new map setup properties to be edited.
		 *
		 * it should return any of these values
		 * - null: no modifications happens
		 * - {}: modified options set
		 * - $.promise(): to be solved with an options set as first param!
		 *                --- xxx.resolve({modified options}) ---
		 *
		 * Just look inside this example code to learn how to use this
		 * callback the best way!
		 */
		beforeInitializeMap: function(options) {
			
			// return a options modified variation
			// (use this solution for non time expensive modifications)
			/*
			return _.extend(options,{
				center: 'via Leogra 11, Isola Vicentina, Vicenza',
				zoom: 18
			});
			*/
			
			// return a DeferredObject promise so you can perform
			// very complex, time expensive and asyncronous operations!
			/*
			var dfd = $.Deferred();
			setTimeout(function() {
				dfd.resolve(_.extend(options,{
					center: 'San Diego',
					zoom: 	7
				}));
			}, 1000);
			return dfd.promise();
			*/
		},
		
		
		/**
		 * UI Events Callbacks
		 * @TODO: should events be temporary shutten down?
		 */
		onReady: function() {},
		onCenterChange: function() {},
		onZoomChange: function() {},
		onClick: function() {},
		
	t:3});
	
	
	/**
	 * Build internal options data structure from initialization
	 * options set.
	 */
	GmapView.prototype._defaults = function(options) {	
		
		options = options || {};
		delete(options.el);
		
		this.options = $.extend({},{
			
			// setup an external component resize info to trigger map resizing
			resizeEvt: 'resize',
			resizeObj: this.$el,
			
			// setup initial map position
			type: 		'ROADMAP',		// [ROADMAP|TERRAIN]
			center:		'padua, italy',	// [LatLng Object, address string, coords array]
			zoom: 		8,				// zoom level, integer
			
			// array of LatLng to drop pins on
			pins: [],
		
		// "t:3" and following deletion operation is a developing facility!
		t:3},options);
		delete(this.options.t);
		
		// Overrides local callbacks with configuration's versions
		if (typeof this.options.onReady == 'function') 				this.onReady 					= this.options.onReady;
		if (typeof this.options.onCenterChange == 'function') 		this.onCenterChange 			= this.options.onCenterChange;
		if (typeof this.options.onZoomChange == 'function') 		this.onZoomChange 				= this.options.onZoomChange;
		if (typeof this.options.onClick == 'function') 				this.onClick 					= this.options.onClick;
		if (typeof this.options.onClick == 'function') 				this.onClick 					= this.options.onClick;
		if (typeof this.options.beforeInitializeMap == 'function') 	this.beforeInitializeMap 		= this.options.beforeInitializeMap;
		if (typeof this.options.afterInitialize == 'function') 		this.afterInitialize 			= this.options.afterInitialize;
		
		return this.options;
	};
	
	
	/**
	 * Map Rendering
	 */
	GmapView.prototype._render = function() {
		//console.log("--- start rendering map:");
		var dfd = $.Deferred();
		
		// initialization block updating logics
		var doUpdate = true;
		if (!this._map) doUpdate = this._initializeMap();	
		
		// update maps and resolve rendering DFD
		$.when(doUpdate).then(_.bind(function() {
			$.when(this._updateMap()).then(_.bind(function() {
				//console.log('end rendering map ---');
				dfd.resolveWith(this);
				if (this.ready.state() == 'pending') {
					this.ready.resolveWith(this);
				}
			}, this));
		}, this));
		
		return dfd;
	};
	
	
	/**
	 * Build a new GoogleMap instance into _map property and
	 * resolve startup centering for the map.
	 *
	 * Returns a DeferredObject who resolve when map is idle.
	 *
	 * It uses instance options to centering the map but also
	 * call at "beforeInitializeMap()" callback to allow
	 * external customization of startup centering.
	 *
	 * Please look at callback in-code documentation to learn
	 * how to use it the best way!
	 */
	GmapView.prototype._initializeMap = function() {
		var dfd = $.Deferred();
		
		// map initialization defaults
		this.$el.html('loading map...');
		var defaultOptions = {
			center:		this.options.center,
			zoom:		this.options.zoom,
			mapTypeId: 	google.maps.MapTypeId[this.options.type]
		};
		
		
		// Use external callback to give possibility of alter startup
		// configuration (es loading from localStorage)
		var callbackDeferred = $.Deferred();
		var customOptions = this.beforeInitializeMap(defaultOptions);
		if (!customOptions) {
			customOptions = defaultOptions;
		}
		$.when(customOptions).always(_.bind(function(options) {
			if (!options) {
				options = defaultOptions;
			}
			customOptions = options;
			callbackDeferred.resolveWith(this);
		}, this));
		
		
		// Try to resolve map center option who can exists in various formats
		var centerDeferred = $.Deferred();
		$.when(callbackDeferred).always(function() {
			this.getLatLng(customOptions.center).always(function(LatLng) {
				customOptions.center = LatLng;
				centerDeferred.resolveWith(this);
			});
		});
		
		
		// Run map and resolve method Deferred when map is idle!
		$.when(centerDeferred).then(function() {
			this._map = new google.maps.Map(this.el, customOptions);
			this.mapEvents(true);
			google.maps.event.addListenerOnce(this._map, 'idle', _.bind(function() {
				dfd.resolveWith(this);
			}, this));
		});
		
		return dfd.promise();
	};
	
	
	
	/**
	 * Bind or unbind map's events listeners
	 */
	GmapView.prototype.mapEvents = function(mode) {
		if (mode === true || mode.toString().toLowerCase() == 'on') {
			google.maps.event.addListener(this._map, 'center_changed', 	$.proxy(this.onCenterChange, this));
			google.maps.event.addListener(this._map, 'zoom_changed', 	$.proxy(this.onZoomChange, this));
			google.maps.event.addListener(this._map, 'click',			$.proxy(this.onClick, this));
		} else {
			google.maps.event.clearListeners(this._map, 'center_changed');
			google.maps.event.clearListeners(this._map, 'zoom_changed');
			google.maps.event.clearListeners(this._map, 'click');
		}
	};
	
	
	
	
	/**
	 *
	 */
	GmapView.prototype._updateMap = function() {
		var dfd = $.Deferred();
		
		// apply to 
		google.maps.event.trigger(this._map, 'resize');
		
		// drop existing pins
		if (this._pins && this._pins.length) {
			_.each(this._pins, function(pin) {
				this.removePin(pin);
			}, this);
		}
		
		// put new pins on the map
		if (this.options.pins.length) {
			this._pins = [];
			_.each(this.options.pins, function(pin) {
				this.pin(pin).done(function(pin) {
					this._pins.push(pin)
				});
			}, this);
		}
		
		
		dfd.resolveWith(this);
		return dfd.promise();
	};
	
	
	/**
	 * Direct access to GMap API
	 */
	GmapView.prototype.map = function() {
		return this._map;
	};
	
	
	
	/**
	 * Resolve a LatLng object form various kink of sourcer
	 * - (string) geoloc
	 * - (array) es. [45.21, 11.9]
	 * - (object) es. {lat:45.21, lng:11.9}
	 * - (LatLng) just send it back
	 *
	 * It returns a DeferredObject you can watch to be solved with
	 * instance context and a LatLng instance as first params.
	 *
	 * If it is not possible to resolve LatLang DeferredObject is
	 * rejected with a static LatLng instance!
	 */
	GmapView.prototype.getLatLng = function(source) {
		var dfd = $.Deferred();
		
		// build a static fallback LatLng to serve in failure cases	
		var fallback = new google.maps.LatLng(45,11);
		
		// (string) use geolocalization service
		if (_.isString(source)) {
			(new google.maps.Geocoder()).geocode({address:source}, _.bind(function(r, s) {
				if (s == google.maps.GeocoderStatus.OK) {
					dfd.resolveWith(this, [new google.maps.LatLng(r[0].geometry.location.jb, r[0].geometry.location.kb)]);
				} else {
					dfd.rejectWith(this, [fallback]);
				}
			}, this));
		
		// (LatLng object) just send it back
		} else if (_.isObject(source) && source instanceof google.maps.LatLng) {
			dfd.resolveWith(this, [source]);
		
		// (array)
		} else if (_.isArray(source) && source.length == 2) {
			dfd.resolveWith(this, [new google.maps.LatLng(source[0], source[1])]);
			
		// (object)
		} else if (_.isObject(source) && source.lat && source.lng) {
			dfd.resolveWith(this, [new google.maps.LatLng(source.lat, source.lng)]);
		
		// failed to resolve!
		// reject DFD with a static LatLng instance
		} else {
			dfd.rejectWith(this, [fallback]);
		}
		
		return dfd.promise();
	};
	
	
	
	
	
	
	
	
	
	
	
	
	/**
	 * Set a new center for the map
	 * it returns a DeferredObject who can be solver or rejected
	 * based on center rule request solution.
	 *
	 * you can give LatLng, [lat, lng], "just the name of the center"
	 * as rules to center the map.
	 *
	 * @TODO: implement "beforeCenterChange" method
	 */
	GmapView.prototype.center = function() {
		var dfd = $.Deferred();
		if (!this._map) {
			dfd.rejectWith(this);
			return dfd.promise();
		}
		
		if (arguments.length == 2) {
			source = [arguments[0], arguments[1]];
			
		} else if (arguments.length) {
			source = arguments[0];
			
		} else {
			dfd.rejectWith(this);
			return dfd.promise();
		}
		
		$.when(this.getLatLng(source)).then(function(LatLng) {
			this._map.setCenter(LatLng);
			dfd.resolveWith(this);
		}, function() {
			dfd.rejectWith(this);
		});
		
		return dfd.promise();
	};
	
	
	/**
	 * Get map center coords as google LatLng object.
	 * (false if map is not available)
	 */
	GmapView.prototype.getCenterObj = function() {
		if (!this._map) return false;
		return this._map.getCenter();
	};
	
	
	/**
	 * Get map canter coords as array of [lat, lng]
	 * (false if map is not available)
	 */
	GmapView.prototype.getCenter = function() {
		if ((center = this.getCenterObj()) !== false) {
			return [
				center.jb,
				center.kb
			];
		} else {
			return false;
		}
	};
	
	
	/**
	 * Set a new zoom level for the map.
	 * @TODO: implement "beforeZoomChange" method
	 */
	GmapView.prototype.zoom = function(zoom) {
		var dfd = $.Deferred();
		if (!this._map) {
			dfd.rejectWith(this);
			return dfd.promise();
		}
		
		this._map.setZoom(zoom);
		dfd.resolveWith(this);
		
		return dfd.promise();
	};
	
	
	/**
	 *	Get map zoom level as integer
	 */
	GmapView.prototype.getZoom = function() {
		if (!this._map) return false;
		return this._map.getZoom();
	};
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	/**
	 * Drop a pin on the map.
	 * it supports a simple attached infowindow
	 */
	GmapView.prototype.pin = function(cfg) {
		var dfd = $.Deferred();
		
		// handle multiple kind of input for this method.
		// - {}: full config object
		// - [lat, lng]: a "getLatLng()" compatibile source (string, array, LatLng)
		// - [lat, lng], {}: a mix of above
		// - {lat:45.123, lng:45.123}, {other configs}
		if ((_.isObject(cfg) && cfg instanceof google.maps.LatLng) || (_.isObject(cfg) && cfg.lat && cfg.lng) || _.isArray(cfg) || _.isString(cfg)) {
			cfg = {
				position: cfg
			};
			if (arguments.length > 1) {
				cfg = $.extend({}, cfg, arguments[1]);
			}
		}
		
		// apply defaults
		cfg = $.extend({}, {
			position: 	this.getCenterObj(),
			title:		'',
			draggable:	false,
			
			// infoWindow options
			// try open/close events like "click/click" or "mouseover/mouseout" or "true"
			info:			null,
			infoIsOpen:		false,
			infoOpenEvt:	'click',
			infoCloseEvt:	'click'
			
		}, cfg||{});
		
		
		
		// resolve pin position and place it into the map
		$.when(this.getLatLng(cfg.position)).then(function(position) {
			cfg.position 	= position;
			cfg.map 		= this._map;
			var pin 		= new google.maps.Marker(cfg);
			
			// Attach simple infowindow
			if (cfg.info != null) {
				pin.info = new google.maps.InfoWindow({content:cfg.info});
				// start open option
				if (cfg.infoIsOpen) {
					pin.info.open(this._map, pin);
					pin.info.isOpen = true;
				}
				// opening event
				if (cfg.infoOpenEvt) {
					google.maps.event.addListener(pin, cfg.infoOpenEvt, _.bind(function() {
						if (!pin.info.isOpen) {
							pin.info.open(this._map, pin);
							pin.info.isOpen = true;
						} else if (cfg.closeInfoEvt == cfg.openInfoEvt) {
							pin.info.setMap(null);
							pin.info.isOpen = false;
						}
					}, this));
				}
				// hiding event
				if (cfg.closeInfoEvt && cfg.infoCloseEvt != cfg.infoOpenEvt) {
					google.maps.event.addListener(pin, cfg.infoCloseEvt, _.bind(function() {
						if (pin.info.isOpen) {
							pin.info.setMap(null);
							pin.info.isOpen = false;
						}
					}, this));
				}
			}
			
			dfd.resolveWith(this, [pin]);
		}, function() {
			dfd.rejectWith(this);
		});
		
		return dfd.promise();
	};
	
	GmapView.prototype.removePin = function(pin) {
		var dfd = $.Deferred();
		
		// remove optional infowindow
		if (pin.info) {
			pin.info.setMap(null);
			pin.info = null;
		}
		
		// remove pin itself
		pin.setMap(null);
		pin = null;
		
		dfd.resolveWith(this);
		return dfd.promise();
	};
	
	
	
	
	GmapView.prototype.bound = function(pins) {
		var dfd = $.Deferred();
		
		// need a list of pins to bound the map!
		if (!pins || !_.isArray(pins)) {
			dfd.rejectWith(this);
			return dfd.promise();
		}
		
		var bounds = new google.maps.LatLngBounds();
		_.each(pins, function(pin) {
			if (pin instanceof google.maps.Marker) {
				bounds.extend(pin.getPosition());
			} else if (pin instanceof google.maps.LatLng) {
				bounds.extend(pin);
			}
		});
		
		this._map.fitBounds(bounds);
		this._map.panToBounds(bounds);
		
		dfd.resolveWith(this);
		return dfd.promise();
	};
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
		
	
	
	
	
	
	return GmapView;
	
});