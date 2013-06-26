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
		css:		{},
		
		initialize: function(options) {
			this.options = $.extend({}, {
				parent:			null,
				container:		null,						// DOM element to append content to
				autoRender: 	true,
				template:		this.template,
				data:			this.data,
				dataVar:		this.dataVar,				// explicit variables tpl namespace
				modelVar:		this.modelVar,				// model tpl namespace
				afterInitialize:this.afterInitialize,
				beforeRender: 	this.beforeRender,
				afterRender: 	this.afterRender,
				css:			this.css
			}, options||{});
			
			// transform a tring template into a real UnderscoreJS template
			if (_.isString(this.options.template)) {
				this.options.template = _.template(this.options.template);
			}
			
			// export parent property
			this.parent = this.options.parent;
			if (this.parent && !this.options.container && this.options.container !== false) {
				this.options.container = this.parent;
			}
			
			// auto append to existing DOM
			if (!this.$el.parent().length && this.options.container) {
				this.appendTo(this.options.container);
			}
			
			// apply custom styles
			this.$el.css(this.options.css);
			
			// -- CALLBACK
			this.options.afterInitialize.apply(this, arguments);
			
			/*
			// auto render "ready" binds to model to be ready!
			// model's need to extend GeneralModel!!
			if (this.options.autoRender == 'ready') {
				try {this.autoRender(this.model.ready())} catch(e) {};
			} else {
				this.autoRender();
			}
			*/
			this.autoRender();
		},
		
		render: function() {
			
			// auto append to existing DOM
			if (!this.$el.parent().length && this.options.container) {
				this.appendTo(this.options.container);
			}
			
			this.options.beforeRender.apply(this, arguments);
			this.$el.html(this.options.template(this.templateData()));
			this.options.afterRender.apply(this, arguments);
			
			this.trigger('render');
			return this;
		},
		
		templateData: function() {
			
			// build templates variables with data and model namespaces
			var _data = {};
			_data['self']					= this;
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
		
		afterInitialize: function() {},
		beforeRender: function() {},
		afterRender: function() {}
		
	});
	
	return TemplateView;
	
});