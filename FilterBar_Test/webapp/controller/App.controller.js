sap.ui.define([
	"sap/ui/core/mvc/Controller",
		"sap/ui/model/Filter"
], function (Controller, Filter) {
	"use strict";

	return Controller.extend("FB.FilterBar_Test.controller.App", {
		onInit: function () {

		},

		onSearch: function (oEvent, selectionSet) {
			let oTable = this.byId("idProductsTable"),
				mParams = oEvent.getParameters(),
				oBinding = oTable.getBinding("items"),
				aFilters = [];

			mParams.selectionSet.forEach(function (oItem) {
				let sValue = oItem.getSelectedKey(),
					sPath = oItem.getCustomData()[0].getKey(),
					sOperator = "EQ",
					
					
					oFilter = new Filter(sPath, sOperator, sValue);
				aFilters.push(oFilter);
			});

			// apply filter settings
			oBinding.filter(aFilters);

			// let sel = oEvent.selectionSet();
			console.log(params);

		}
	});
});