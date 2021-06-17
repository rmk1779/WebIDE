sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function (Controller) {
	"use strict";

	return Controller.extend("TAR.Table_AddRow.controller.App", {
		onInit: function () {

		},

		onAddRole: function () {

			let oTable = this.getView().byId("idTeamTable"),
				jModel = this.getView().getModel(),
				aTeam = jModel.getProperty("/Team"),
				rowObj = {
					"Role": "",
					"Delivery Org": "",
					"Work Package": ""
				};

			aTeam.push(rowObj);
			
			jModel.refresh();

		}
	});
});