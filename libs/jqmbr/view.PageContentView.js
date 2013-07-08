/**
 * ---[[   B O I L E R P L A T E   ]]---
 * JqueryMobile + BackboneJS + RequireJS
 * =====================================
 *
 * JQueryMobile PageContentView
 *
 */
define([
	'jquery', 'underscore', 'backbone',
	'./view.GeneralView',

], function(
	$, _, Backbone,
	GeneralView

) {
	
	var PageContentView = GeneralView.extend({
		
		initialize: function(options) {
			
			this.options = $.extend({}, {
				html:		'',
				attrs:		{}
			}, options || {});
			
			
			// apply custom attributes
			_.each($.extend({},{
				'data-role':	'content'
			},this.options.attrs), function(val, key) {this.$el.attr(key, val)}, this);
			
			this.$el.append($('<div>').html(this.options.html));
			
		},
		
		
		/**
		 * Obeserve DOM to check for changes (structural) and trigger some "contentchanged" events
		 * to the view itself.
		 */
		observe: function() {
			var self = this;
			
			var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
			var _observerTimeout = null;
			
			var observer = new MutationObserver(function(mutuations) {
				
				// filter only "childList" changes
				var tree = false;
				for (var i=0; i<mutuations.length; i++) {
					if (mutuations[i].type == "childList") tree = true;
				}
				
				// block non interesting update events
				if (!tree) return;
				
				clearTimeout(_observerTimeout);
				_observerTimeout = setTimeout(function() {
					self.trigger('contentchanged');
				}, 100);
				
			});
			
			observer.observe(this.$el[0], {
				childList: true,
				subtree: true,
				attributes: true
			});
		}
		
	});
	
	
	
	return PageContentView;
	
});