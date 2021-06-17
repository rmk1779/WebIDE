sap.ui.define([
	"sap/ui/core/mvc/Controller",

], function (Controller, Formatter) {
	"use strict";

	return Controller.extend("grd.gridTable.controller.View1", {

		onInit: function () {
			// this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);

			this.getOwnerComponent().getRouter().getRoute("RouteService").attachPatternMatched(
				this._onMasterMatched, this);
		},
		_onMasterMatched: function (oEvent) {
			debugger;
			var startupParams = this.getOwnerComponent().getComponentData().startupParameters; // get Startup params from Owner Component
			var param = startupParams.Sematic1ID[0]; //
			this.getView().setModel("jmodel");
			this.getView().getModel("jmodel").setProperty("/Cross_App_Value",
				param);

		},

		puri: function (oEvent) {

			var oItem = oEvent.getParameters().rowBindingContext.getObject();
			// console.log(oItem);
			// var mdl = this.getView().getModel();
			// mdl.setProperty("/miniName", oItem);

			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("View2", {
				miniPath: oItem.empId.substr(1)
			});

		},

		puruChange: function (oEvent) {

			var oView = this.getView();

			var oMdl = oView.getModel();
			var x = oEvent.getParameters().value;
			var inpVal = Number(oEvent.getParameters().value);

			if (isNaN(inpVal) || x === "") {
				// oEvent.setValueState(sap.ui.core.ValueState.Error);
				oEvent.getSource().setValueState(sap.ui.core.ValueState.Error);
				oEvent.getSource().getParent().addStyleClass("leftBorderColor");
				sap.m.MessageToast.show("this is not a number");
			} else {
				oEvent.getSource().setValueState(sap.ui.core.ValueState.None);
				oEvent.getSource().getParent().removeStyleClass("leftBorderColor");
			}

		}

	});

});