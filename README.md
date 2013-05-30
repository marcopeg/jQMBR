jQMBR
=========

> jQueryMobile + BackboneJS + RequireJS | Boilerplate to startup mobile apps!

`jQMBR` is little package to quick startup a new mobile app project with:

- jQuery
- UndescoreJS
- BackboneJS
- RequireJS
- some custom modules
- LESS source file

All things are ready to be deployed with _RequireJS's optimizer_ 
(all js packed up into one minified file) to speed up loading time in production mode!

## Smooth Startup

Often a _jQM_ mobile app take some time to load and you may see unformatted page contents
before mobile styles are applied.

This is a very ugly behavior!  
jQMBR hide page's body until all scripts are loaded then fade in wile initializing jQM page.



## MVC Organization

To talk about _MVC_ in javascript is quite hard.  
BackboneJS call itself a "_MV*_" framework but I think we can make things work right 
for a real _MVC_ pairing jQueryMobile and Backbone.

### Controllers

In a multi-page jQM application we should create **one controller per page** defining
it as a RequireJS AMD.

	define(['jquery', 'backbone'], function($,Backbone) {
	  var _target = '#pageId';
	  var $page = null;
	  $(document).delegate(_target, 'pagecreate', function() {
	  	 $page = $(this);
	  	 // fetch collections, other data stuff...
	  });
	  $(document).delegate(_target, 'pageshow', function() {
	  	 // create some Backbone's views to handle lists, buttons etc...
	  });
	});


## window.App singleton



