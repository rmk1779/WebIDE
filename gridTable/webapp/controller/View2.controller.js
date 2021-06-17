sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function (Controller) {
	"use strict";

	return Controller.extend("grd.gridTable.controller.View2", {

	
		onInit: function () {
			this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			this.oRouter.getRoute("View2").attachPatternMatched(this._onObjectMatched, this);
		},
		_onObjectMatched: function (oEvent) {
			var oArg = oEvent.getParameters("arguments");

			// var path= "/" + oEvent.getParameter("arguments").miniPath;
			// this.getView().bindElement({
			// 	path: "/" + oEvent.getParameter("arguments").miniPath,
			// 	model: "miniData/despicable/"

			// });
			var oView = this.getView();
			oView.setModel(this.getOwnerComponent().getModel());
			oView.bindElement("/Employees/" + oArg.arguments.miniPath);
		},

	

	});

});