sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/UIComponent"

], function (Controller, UIComponent) {
	"use strict";

	return Controller.extend("FCL.Flex_Col_Layout.controller.BaseController", {
		onInit: function () {

		},

		/**
		 * Convenience method for accessing the router.
		 * @public
		 * @returns {sap.ui.core.routing.Router} the router for this component
		 */
		getRouter: function () {
			return UIComponent.getRouterFor(this);
		},

		/**
		 * Convenience method for getting the view model by name.
		 * @public
		 * @param {string} [sName] the model name
		 * @returns {sap.ui.model.Model} the model instance
		 */
		getModel: function (sName) {
			return this.getOwnerComponent().getModel(sName);
		},

		/**
		 * Convenience method for setting the view model.
		 * @public
		 * @param {sap.ui.model.Model} oModel the model instance
		 * @param {string} sName the model name
		 * @returns {sap.ui.mvc.View} the view instance
		 */
		setModel: function (oModel, sName) {
			return this.getOwnerComponent().setModel(oModel, sName);
		},

		/**
		 * Getter for the resource bundle.
		 * @public
		 * @returns {sap.ui.model.resource.ResourceModel} the resourceModel of the component
		 */
		getResourceBundle: function () {
			return this.getOwnerComponent().getModel("i18n").getResourceBundle();
		},

		/**
		 * Convenience method for setting the Flexible Coulmn Layout type.
		 * @public
		 * @param {String} sNewLayout Layout info
		 */
		setFCLayout: function (sNewLayout) {
			let ctr = this.byId("idFCLayout");
			if (ctr) {
				this.byId("idFCLayout").setLayout(sNewLayout);
			}
			this.getOwnerComponent().getModel("FlexibleColumnUIState").setProperty("/layout", sNewLayout);
		},

		/**
		 * Convenience method for getting the Flexible Coulmn Layout type.
		 * @public
		 * @returns {sap.f.LayoutType} the layout for this component
		 */
		getFCLayout: function () {
			return this.getOwnerComponent().getModel("FlexibleColumnUIState").getProperty("/layout");
		},

		/**
		 * Convenience method for getting the Table by Id.
		 * @public
		 * @param {string} [sTableId] the Table Id
		 * @returns {sap.m.Table} the Table instance
		 */
		getTable: function (sTableId) {
			return this.getView().byId(sTableId);
		},
		
		/**
		 * Convenience Method for Creating Fragments.
		 * @public
		 * @param {String} [sFragmentID] Id of Fragment
		 * @param {String} [sFragmentName] name of Fragment 
		 * @returns {sap.ui.xmlfragment} the fragment for this view
		 */
		_createFragment: function (sFragmentID, sFragmentName) {
			jQuery.sap.assert(sFragmentName, "Trying to instantiate fragment but fragmentName is not provided.");
			var oFragment = sap.ui.xmlfragment(sFragmentID, sFragmentName, this);
			return oFragment;
		}

	});
});