/**
 * ---[[   B O I L E R P L A T E   ]]---
 * JqueryMobile + BackboneJS + RequireJS
 * =====================================
 * 
 * RequireJS compiler configuration
 *
 */


({
	appDir: 	'./',
	baseUrl: 	'./',
	dir: 		'../js-deploy/',
	
	//optimize: "none",
	
	mainConfigFile: "require.config.js",
	
	modules:	[{name:'require.config'}]
	
})