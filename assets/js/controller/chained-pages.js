/**
 * ---[[   B O I L E R P L A T E   ]]---
 * JqueryMobile + BackboneJS + RequireJS
 * =====================================
 *
 * Chained Dynamic Pages Example
 * 
 */
 
 define([
	'jquery', 'underscore', 'jqmbr/backbone',
	'pages/ChainedPage2',
	'pages/ChainedPage3'

], function(
	$, _, Backbone,
	ChainedPage2,
	ChainedPage3

) {

	
	
	
	/**
	 * the first dynamic page instance PageView giving a full configuration
	 * to organize result page.
	 *
	 * this action is delegated to an UI interaction (clicking on a link)
	 */
	$(document).delegate('[href="#ChainedPage1"]', 'click', function(e) {
		e.preventDefault();
		
		new Backbone.jqmbr.PageView({
			id:			'chained-page1',
			title:		'ChainedPage1',
			autoRender: true,
			//scrollin:	false,
			
			
			beforePageCreate: function() {
				
				// add some dynamic text using a TemplateView object
				new Backbone.jqmbr.TemplateView({
					data: this.options,
					template: '<p>i\'m a dynamic generated page.<br>'
							+ 'my title is <b><%= data.title %></b></p>'
				}).renderTo(this.content.$el);
				
				// add an action button into the body
				new Backbone.jqmbr.BtnView({
					href:		'#ChainedPage2',
					show: 		'Go to ChainedPage2',
					icon: 		'arrow-r',
					iconPos: 	'right',
					theme: 		'b'
				}).renderTo(this.content.$el);
				
				// add an action button to the header
				new Backbone.jqmbr.BtnView({
					href:		'#ChainedPage2',
					show: 		'Go',
					icon: 		'arrow-r',
					iconPos: 	'right'
				}).renderTo(this.header.$el);
				
				this.content.$el.append('<hr>');
				
				// add some input controls to test
				this.input = new TestInput01({container: this.content});
				this.textarea = new TestInput02({container: this.content});
				
			}
			
		});
		
	});
	
	
	var TestInput01 = Backbone.jqmbr.TemplateView.extend({
		template: 	'<input type="text" placeholder="<%= data.pl %>" /><p></p>',
		data: 		{pl:'try write some text on me!'},
		events: {
			"keyup input" : "onChange"
		},
		onChange: function() {
			this.$el.find('p').html(this.$el.find('input').val());
		}
	});
	
	var TestInput02 = Backbone.jqmbr.TemplateView.extend({
		template: 	'<textarea type="text" placeholder="<%= data.pl %>"></textarea><p></p>',
		data: 		{pl:'try write some text on me!'},
		events: {
			"keyup textarea" : "onChange"
		},
		onChange: function() {
			this.$el.find('p').html(this.$el.find('textarea').val());
		}
	});
	
	
	
	
	
	
	
	/**
	 * Pages 2 and 3 are defined in separated files as extensions of PageView object.
	 * you can see how easy to open that kind of pages!
	 */
	
	$(document).delegate('[href="#ChainedPage2"]', 'click', function(e) {
		e.preventDefault();
		new ChainedPage2;
	});
	
	$(document).delegate('[href="#ChainedPage3"]', 'click', function(e) {
		e.preventDefault();
		new ChainedPage3;
	});	
	
});