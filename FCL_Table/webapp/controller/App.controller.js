sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function (Controller) {
	"use strict";

	return Controller.extend("fcl.FCL_Table.controller.App", {
		onInit: function () {
			// this.oOwnerComponent = this.getOwnerComponent();
			// this.oRouter = this.oOwnerComponent.getRouter();
			// this.oRouter.attachRouteMatched(this.onRouteMatched, this);
			// this.oRouter.attachBeforeRouteMatched(this.onBeforeRouteMatched, this);
		}
		// onBeforeRouteMatched: function (oEvent) {
		// 	var oModel = this.oOwnerComponent.getModel(),
		// 		sLayout = oEvent.getParameters().arguments.layout,
		// 		oNextUIState;

		// 	// If there is no layout parameter, query for the default level 0 layout (normally OneColumn)
		// 	if (!sLayout) {
		// 		oNextUIState = this.oOwnerComponent.getHelper().getNextUIState(0);
		// 		sLayout = oNextUIState.layout;
		// 	}
		// 	oModel.setProperty("/layout", sLayout);
		// },

		// onRouteMatched: function (oEvent) {
		// 	var sRouteName = oEvent.getParameter("name"),
		// 		oArguments = oEvent.getParameter("arguments");

		// 	// Save the current route name
		// 	this.currentRouteName = sRouteName;
		// 	this.currentProduct = oArguments.product;
		// }
	});
});