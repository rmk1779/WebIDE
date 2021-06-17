sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"BT/BatchTest/controller/BaseController"
], function (Controller, BaseController) {
	"use strict";

	return BaseController.extend("BT.BatchTest.controller.App", {
		onInit: function () {
				// Ensure the router is initialized -
			this.getRouter().initialize();

			// var FlexibleColumnUIState = this.getModel("FlexibleColumnUIState");
			// FlexibleColumnUIState.setProperty("/layout", "TwoColumnsBeginExpanded");
			
			this.setFCLayout("OneColumn");
		}
	});
});