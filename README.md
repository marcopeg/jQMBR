jQMBR
=========

> jQueryMobile + BackboneJS + RequireJS | Boilerplate to startup mobile apps!

`jQMBR` is little package to quick startup a new mobile app project with:

*   jQuery
*   UndescoreJS
*   BackboneJS
*   RequireJS
*   some custom modules
*   LESS source file

All things are ready to be deployed with *RequireJS's optimizer*  
(all js packed up into one minified file) to **speed up loading time in production!**


## Smooth Startup

Often a *jQM* mobile app **take some time to load** and you may see unformatted page contents  
before mobile styles are applied. This is a very ugly behavior!

`jQMBR` hide page's body until all scripts are loaded then fade in wile initializing jQM page.

## MVC Organization

To talk about `MVC` in javascript is quite hard.  
BackboneJS call itself a `MV*` framework but I think we can make things work right  
for a real `MVC` pairing jQueryMobile and Backbone.

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
    

This *controller AMD* can define some **private vars** and listen to  
every jQueryMobile events to make things work with *Collections* and *Views*.

**Example:** A *listView* should be delegated to a *Backbone's View* who **update itself  
according to** a *Collection* data events.

**Example:** A *header button* should be listened by controller's code to **delegate  
it's action to** the global application object:

    $(document).delegate('#refreshBtn', 'click', function() {
      App.UsersCollection.fetch();
    });
    

## window.App singleton

A very useful component ready with this boilerplate is an **`App` global object**  
who can **be used as glue** for every piece of the application.

This object implements Backbone's Events system so **`App` can listen and trigger  
application events**.

### Global Events Digitalization

One of my personal strategies to improve my apps performance is **to worry a lot about  
continuos events** like "resize", "scroll", "mousemove".

These events triggers continuously during UI interaction and it is easy to understand  
what might happen if you hook heavy code to them!

`jQMBR`can't predict how good your code will be so **it delay event propagation to  
the `App object` to reduce hits**. You can set delay time the way you like.


### App Modules

`jQMBR` boilerplate comes with some **App Modules** who quick add some feature to your
application. These modules will gow with time.

You can choose what modules to use by uncommenting relative dependency line in your
`app.js` source file:

	define([
	  'jquery',
	  'jqmbr/AppClass',
	  
	  // boilerplate plugins
	  //'jqmbr/app.bodyFullsize',
	  //'jqmbr/app.loadGmap'

#### App.loadGmap()

#### App.bodyFullsize()




## Styling with LESS

**Why to write CSS if you can to write LESS?**  
`jQMBR` comes with a LESS source file who import jQueryMobile standard theme.

Inside this source you will find instructions to apply a custom theme and to add your
custom rules.


## Deploy Optimization

Particular attention is given to the deploy **optimization to reduce app loading time**, 
improve caching or offline manifest usage.

Your boilerplate comes with a `require.build.js` who can be used to optimize with `r.js` script:

    # /usr/src/app/assets/
    node r.js -o js/require.build.js

A new folder "js-deploy" will be created beside "js" folder and all files are
minified and uglyfied to reduce weight and readability.

At this point only "js-deploy/require.config.js" is required by your application:
you can delete other javascript files, "libs" and "less" folder and upload
to production server only optimized assets.