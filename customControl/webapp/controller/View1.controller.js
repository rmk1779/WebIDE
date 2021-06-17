sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageToast"
], function (Controller, MessageToast) {
	"use strict";

	return Controller.extend("customControl.customControl.controller.View1", {
		onInit: function () {

		},
		onRatingChanged: function(oEvent){
			var iValue = oEvent.getParameter("value");
			if(iValue > 1){
			MessageToast.show(iValue + " " +":"+ " " + "xyz BRAIN IS FULL OF SHIT. Rating Should not exceed 1");
			}
			if(iValue == 1){
				MessageToast.show("This is xyz Brain Rating" + " " + iValue);
			}
		},
	
	});
});