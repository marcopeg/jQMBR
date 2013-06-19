/**
 * ---[[   B O I L E R P L A T E   ]]---
 * JqueryMobile + BackboneJS + RequireJS
 * =====================================
 *
 * Generic template driven BackboneView
 *
 */
define([
	'jquery', 'underscore', 'backbone',
	'./view.GeneralView'

], function(
	$, _, Backbone,
	GeneralView

) {
	
	var TemplateView = GeneralView.extend({
		
		template: 	_.template('tpl source'),
		data:		{},
		dataVar:	'data',
		modelVar:	'model',
		
		initialize: function(options) {
			this.options = $.extend({}, {
				autoRender: 	true,
				template:		this.template,
				data:			this.data,
				dataVar:		this.dataVar,				// explicit variables tpl namespace
				modelVar:		this.modelVar,				// model tpl namespace
				beforeRender: 	this.beforeRender,
				afterRender: 	this.afterRender
			}, options||{});
			
			this.autoRender();
		},
		
		render: function() {
			this.options.beforeRender.apply(this, arguments);
			this.$el.html(this.options.template(this.templateData()));
			this.options.afterRender.apply(this, arguments);
			return this;
		},
		
		templateData: function() {
			
			// build templates variables with data and model namespaces
			var _data = {};
			_data[this.options.dataVar] 	= this.options.data;
			_data[this.options.modelVar]	= this.model || new Backbone.Model();
			
			// dataVar===false exposes data or model's attributes as
			// first level variabiles to the template
			if (this.options.dataVar === false) {
				if (!_.isEmpty(this.options.data)) {
					_data = this.options.data;
				} else {
					_data = this.model.attributes;
				}
			}
			
			return _data;
		},
		
		beforeRender: function() {},
		afterRender: function() {}
		
	});
	
	return TemplateView;
	
});