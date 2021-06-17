sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function (Controller) {
	"use strict";

	return Controller.extend("TBL.Table_test.controller.App", {
		onInit: function () {
			
		let oResourceBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle(),
			count = 123;
			this.getView().byId("tableHeader").setText(oResourceBundle.getText("worklistTableTitle", [count] ));
		
		
		
		}
	});
});