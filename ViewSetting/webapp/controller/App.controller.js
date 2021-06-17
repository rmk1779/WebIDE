sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"VS/ViewSetting/controller/BaseController",
	"sap/m/MessageToast",
	"sap/ui/core/Fragment",
	"sap/m/MessageBox",
	"sap/ui/model/Filter",
	"../model/formatter",
	"sap/m/GroupHeaderListItem"
], function (Controller, BaseController, MessageToast, Fragment, MessageBox, Filter, formatter, GroupHeaderListItem) {
	"use strict";

	return BaseController.extend("VS.ViewSetting.controller.App", {
		onInit: function () {
			// this.getOwnerComponent().getModel();
			// this.getOwnerComponent().getModel("filtersModel");

			this.busyIndicator();

		},

		formatter: formatter,

		getAge: function (oContext) {

			return {
				key: oContext.getProperty('age')
			};

		},

		// getGroupHeader: function (oControlEvent, oGroup) {
		// 	return new GroupHeaderListItem({
		// 		title: oControlEvent.getSource()
		// 	});
		// },

		handleFilterButtonPressed: function () {
			let oTable = this.byId("idProductsTable"),
				oView = this.getView(),
				oDialog = this._createFragment(oView.getId(), "VS.ViewSetting.view.fragments.filterDialog"),
				oBinding = oTable.getBinding("items"),
				oModel = this.getOwnerComponent().getModel(),
				oModelFilter = this.getOwnerComponent().getModel("filtersModel"),
				aData = oModel.getProperty("/userDetails");

			oView.addDependent(oDialog);

			// names property unique array object
			let aMap = aData.map((oItem) => {
				return oItem.name
			});

			let aMapUnique = [...new Set(aMap)];

			let aMapUniqueObj = aMapUnique.map((oItem) => {
				return oItem = {
					name: oItem
				}
			});

			oModelFilter.setProperty("/filterNames", aMapUniqueObj);

			//weight property unique array object
			let aMapWeight = aData.map((oItem) => {
				return oItem.weight
			});

			let aMapUniqueWeight = [...new Set(aMapWeight)];

			let aMapUniqueObjWeight = aMapUniqueWeight.map((oItem) => {
				return oItem = {
					weight: oItem
				}
			});

			oModelFilter.setProperty("/filterWeight", aMapUniqueObjWeight);

			//Salary property unique array object
			let aMapSalary = aData.map((oItem) => {
				return oItem.salary
			});

			let aMapUniqueSalary = [...new Set(aMapSalary)];

			let aMapUniqueObjSalary = aMapUniqueSalary.map((oItem) => {
				return oItem = {
					salary: oItem
				}
			});

			oModelFilter.setProperty("/filterSalary", aMapUniqueObjSalary);

			oModelFilter.refresh();

			//open filter Dialog
			oDialog.open();

		},

		handleFilterDialogConfirm: function (oEvent) {
			let oTable = this.byId("idProductsTable"),
				mParams = oEvent.getParameters(),
				oBinding = oTable.getBinding("items"),
				aFilters = [];

			mParams.filterItems.forEach(function (oItem) {

				let sPath = oItem.getKey(),
					sOperator = "EQ",
					sValue1 = oItem.getText(),

					oFilter = new Filter(sPath, sOperator, sValue1);
				aFilters.push(oFilter);
			});

			// apply filter settings
			oBinding.filter(aFilters);

			// update filter bar
			this.byId("vsdFilterBar").setVisible(aFilters.length > 0);
			this.byId("vsdFilterLabel").setText(mParams.filterString);

			this.busyIndicator();

		},

		removeFilter: function () {
			let oTable = this.byId("idProductsTable"),
				oBinding = oTable.getBinding("items");

			this.busyIndicator();

			oBinding.filter(null);

			this.byId("vsdFilterBar").setVisible(false);

		},

		busyIndicator: function () {
			let oTable = this.byId("idProductsTable");
			oTable.setBusy(true);

			setTimeout(function () {
				oTable.setBusy(false);
			}, 2000);
		}

	});
});