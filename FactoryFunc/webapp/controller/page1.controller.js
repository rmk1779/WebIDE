
sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageToast"
], function (Controller, MessageToast) {
	"use strict";

	return Controller.extend("factr.FactoryFunc.controller.page1", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf factr.FactoryFunc.view.page1
		 */
		onInit: function () {

		},
		
		Myfactoryfunction : function(sId, oContext){
			// MessageToast("qwer");
			// debugger;
			//get
			var UnitPrice = oContext.getProperty("unitPrice");
			if(UnitPrice > 20){
				return new sap.m.ColumnListItem({
					cells: [new sap.m.Text({
						text:"{m1>orderId}"
					}),
					new sap.m.Text({
						text:"{m1>productId}"
					}),
					new sap.m.Text({ 
						text:"{m1>productName}"
					}),
					new sap.m.Text({
						text:"{m1>unitPrice}"
					}),
					new sap.m.Text({
						text:"{m1>quantity}"
					}).addStyleClass("redclass")
						
						]
				});
			}else if(UnitPrice < 20){
				return new sap.m.ColumnListItem({
					cells: [new sap.m.Text({
						text:"{m1>orderId}"
					}),
					new sap.m.Text({
						text:"{m1>productId}"
					}),
					new sap.m.Text({
						text:"{m1>productName}"
					}),
					new sap.m.Text({
						text:"{m1>unitPrice}"
					}),
					new sap.m.Text({
						text:"{m1>quantity}"
					}).addStyleClass("greenclass")
					]
				});
			}
		
		}

	});

});