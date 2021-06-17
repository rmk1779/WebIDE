sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"FCL/Flex_Col_Layout/controller/BaseController"
], function (Controller, BaseController) {
	"use strict";

	return BaseController.extend("FCL.Flex_Col_Layout.controller.App", {
		onInit: function () {

		
			// Ensure the router is initialized -
			this.getRouter().initialize();

			// var FlexibleColumnUIState = this.getModel("FlexibleColumnUIState");
			// FlexibleColumnUIState.setProperty("/layout", "TwoColumnsBeginExpanded");
			
			this.setFCLayout("TwoColumnsBeginExpanded");

		}
	});
});