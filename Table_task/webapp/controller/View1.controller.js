sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function (Controller) {
	"use strict";

	return Controller.extend("tbl.Table_task.controller.View1", {
		onInit: function () {

		},
		onAfterRendering: function (oEvent) {

			// debugger;
			var oTable = this.getView().byId("idTable");

			// oTable.addStyleClass("classTable");

		},
		oPopover: null,
		fnPop: function (oEvent) {
			// debugger;
			var oView = this.getView();
		var sData =	oEvent.getSource().getText();
			if (!this.oPopover) {
				// create dialog via fragment factory
				this.oPopover = sap.ui.xmlfragment(oView.getId(), "tbl.Table_task.fragments.popOver", this);
				// connect dialog to view (models, lifecycle)
				oView.addDependent(this.oPopover);

			}
		this.getView().byId("idPop").setTitle("this is data :" + " " + sData);
			this.oPopover.openBy(oEvent.getSource());
		}
	});
});