/**
 * ---[[   B O I L E R P L A T E   ]]---
 * JqueryMobile + BackboneJS + RequireJS
 * =====================================
 *
 * 
 */

define([
	'jquery',
	'./AppClass',
	'./app.utils'
	

], function(
	$, 
	AppClass
	
) {
	
	
	/**
	 * Build utils namespaces and global settings
	 */
	AppClass.prototype.utils.View 	= {};
	AppClass.prototype.utils.View._delayTimeout = 1;
	
	
	
	
	AppClass.prototype.utils.View.appendTo = function($target) {
		this.$el.appendTo($target);
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
		return this.$el;
	};
	
	
	return AppClass;
	
});