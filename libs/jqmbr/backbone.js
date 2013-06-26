/**
 * ---[[   B O I L E R P L A T E   ]]---
 * JqueryMobile + BackboneJS + RequireJS
 * =====================================
 *
 * visualizza il dettaglio di un protocollo a partire dal suo ID
 *
 */
define([
	'jquery', 'underscore', 'backbone',
	
	'./model.GeneralModel',
	'./collection.GeneralCollection',
	
	'./view.GeneralView',
	'./view.LinkView',
	'./view.BtnView',
	'./view.ListView',
	'./view.TemplateView',
	
	'./view.PageView',
	'./view.PageHeaderView',
	'./view.PageContentView',
	'./view.PageFooterView',
	
	'./view.EntryPageView',
	
	'./view.GmapView',
	'./view.ImagePaneView'

], function(
	$, _, Backbone,
	
	GeneralModel,
	GeneralCollection,
	
	GeneralView,
	LinkView,
	BtnView,
	ListView,
	TemplateView,
	
	PageView,
	PageHeaderView,
	PageContentView,
	PageFooterView,
	
	EntryPageView,
	
	GmapView,
	ImagePaneView

) {
	
	
	Backbone.jqmbr = {
		
		GeneralModel:			GeneralModel,
		GeneralCollection:		GeneralCollection,
		
		GeneralView:			GeneralView,
		LinkView:				LinkView,
		BtnView:				BtnView,
		ListView:				ListView,
		TemplateView:			TemplateView,
		
		PageView:				PageView,
		PageHeaderView:			PageHeaderView,
		PageContentView:		PageContentView,
		PageFooterView:			PageFooterView,
		
		EntryPageView:			EntryPageView,
		
		GmapView:				GmapView,
		ImagePaneView:			ImagePaneView
	};
	
	
	return Backbone;
	
});