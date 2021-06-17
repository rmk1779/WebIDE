sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"BT/BatchTest/controller/BaseController"
], function (Controller, BaseController) {
	"use strict";

	return BaseController.extend("BT.BatchTest.controller.DetailPage", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf BT.BatchTest.view.DetailPage
		 */
		onInit: function () {

			this.getRouter().getRoute("MasterToDetail").attachPatternMatched(this._onObjectMatched, this);
		},

		_onObjectMatched: function (oEvent) {
			let oView = this.getView(),
				oArg = oEvent.getParameters("arguments");

			oView.setModel(this.getOwnerComponent().getModel());

			oView.bindElement("/ZRMK_EMPSet('" + oArg.arguments.empPath + "')");

		},
		
		
		onBackHome: function(){
			
			this.getRouter().navTo("Home");
			
			this.setFCLayout("OneColumn");
		}

	});

});