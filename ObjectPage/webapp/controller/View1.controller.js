sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel"
], function (Controller, JSONModel) {
	"use strict";

	return Controller.extend("opl.ObjectPage.controller.View1", {
		onInit: function () {
			var oMdl = new JSONModel();
			this.getOwnerComponent().setModel(oMdl, "oMdl");
		},
		
		sendData: function(oEvent){
			debugger;
			var oView = this.getView();
			
			var firstName = oView.byId("idFirstName").getValue();
			var lastName = oView.byId("idLastName").getValue();
			
			
			this.getOwnerComponent().getModel("oMdl").setProperty("/firstName", firstName);
			this.getOwnerComponent().getModel("oMdl").setProperty("/lastName", lastName);
			
		}
		
	});
});