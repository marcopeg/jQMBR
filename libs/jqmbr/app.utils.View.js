/**
 * ---[[   B O I L E R P L A T E   ]]---
 * JqueryMobile + BackboneJS + RequireJS
 * =====================================
 *
 * 
 */

define([
	'jquery', 'backbone',
	'./AppClass',
	'./app.utils'
	

], function(
	$, Backbone,
	AppClass
	
) {
	
	
	/**
	 * Build utils namespaces and global settings
	 */
	AppClass.prototype.utils.View 	= {};
	AppClass.prototype.utils.View._delayTimeout = 1;
	
	
	
	
	
	
	/**
	 * Mishellaneous utilities
	 */
	
	AppClass.prototype.utils.View.appendTo = function($target) {
		if ($target instanceof Backbone.View) {
			this.$el.appendTo($target.el);
		} else {
			this.$el.appendTo($target);
		}
		return this;
	};
	
	AppClass.prototype.utils.View.renderTo = function($target) {
		this.render();
		this.appendTo($target);
		return this;
	};
	
	
	
	
	
	
	
	
	
	/**
	 * [delayed] fitContainer()
	 * resize View's $el to fit parent() dimensions
	 */
	AppClass.prototype.utils.View.fitContainer = function() {
		clearTimeout(this._fitContainerTimeout);
		this._fitContainerTimeout = setTimeout($.proxy(function() {
			AppClass.prototype.utils.View._fitContainer.apply(this, arguments);
		}, this), AppClass.prototype.utils.View._delayTimeout);
	};
	
	AppClass.prototype.utils.View._fitContainer = function($container, $target) {
		$container 	= $container || this.$el.parent();
		$target		= $target || this.$el;
		if ($container.length && $target.length) {
			$target.css({
				width:		$container.width() - ($target.outerWidth() - $target.width()),
				height:		$container.height() - ($target.outerHeight() - $target.height())
			});
		}	
	};
	
	
	
	/**
	 * [delayed] render()
	 */
	AppClass.prototype.utils.View.render = function() {
		clearTimeout(this._renderTimeout);
		this._renderTimeout = setTimeout($.proxy(function() {
			this._render.apply(this, arguments);
		}, this), AppClass.prototype.utils.View._delayTimeout);
		return this;
	};
	
	
	
	
	
	
	
	
	
	
	
	/**
	 * Deferred Ready Status API
	 * you can use this method to check or set deferred object status
	 * - if called with no arguments returns internal DeferredObject
	 * - true/false resolve or reject deferred
	 * - callback+context binds to dfd resolution
	 *
	 * this method is responsible to auto initialize internal deferred
	 * object when first usage happen.
	 */
	AppClass.prototype.utils.View.ready = function(callback, context) {
		var that 	= this;
		context 	= context || this;
		
		// implicit initialization od internal deferred object
		if (!this._ready) {
			this._ready = $.Deferred();
		}
		// resolve deferred object with another deferred object!
		// (useful with SQLite library!)
		if (AppClass.prototype.isDeferredObject(callback)) {
			$.when(callback).then(
				function() {that.ready(true, context)},
				function() {that.ready(false, context)}
			);
			return this;
		}
		// resolve deferred
		if (callback === true) {
			this._ready.resolveWith(context);
			return this;
		// reject deferred object
		} else if (callback === false) {
			this._ready.rejectWith(context);
			return this;
		}
		// check deferred to run some logic
		if (_.isFunction(callback)) this._ready.done(_.bind(callback, context));
		return this._ready;
	};
	
	AppClass.prototype.utils.View.error = function(callback, context) {
		// implicit initialization od internal deferred object
		if (!this._ready) {
			this._ready = $.Deferred();
		}
		// resolve deferred
		if (callback === true) {
			this._ready.rejectWith(this);
			return this;
		}
		// check deferred to run some logic
		context = context || this;
		if (_.isFunction(callback)) this._ready.fail(_.bind(callback, context));
		return this._ready;
	};
	
	// shortcut to above API
	AppClass.prototype.utils.View.setReady 		= function(context) {this.ready(true, context)};
	AppClass.prototype.utils.View.setFailed 	= function(context) {this.ready(false, context)};
	AppClass.prototype.utils.View.setError 		= function(context) {this.ready(false, context)};
	
	AppClass.prototype.utils.View.renderWhenReady = function() {
		this.ready(this.render, this);
		return this;
	};
	
	
	
	
	/**
	 * It listen to an "options.autoRender" setting to be
	 * [true|false|ready]
	 *
	 * it trigger render() accordling to that option.
	 * 
	 * "ready" model will use the renderWhenReady() method
	 */
	AppClass.prototype.utils.View.autoRender = function(doit) {
		
		doit = doit || this.options.autoRender;
		
		if (typeof doit == undefined) return;
		
		if (doit === true) {
			this.render();
		
		// auto render with explicit deferred object
		} else if (AppClass.prototype.isDeferredObject(doit)) {
			$.when(doit).then(_.bind(this.render, this));
			
		} else if (doit === 'ready') {
			this.renderWhenReady();
		}
	};
	
	
	
	
	
	
	return AppClass;
	
});