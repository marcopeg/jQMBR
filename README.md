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

## MVC Organization

## window.App singleton

## Smooth Startup

Often a _jQM_ mobile app take some time to load and you may see unformatted page contents
before mobile styles are applied.

This is a very ugly behavior!  
jQMBR hide page's body until all scripts are loaded then fade in wile initializing jQM page.

