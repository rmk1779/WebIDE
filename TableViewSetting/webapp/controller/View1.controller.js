sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/Filter"
], function (Controller, Filter) {
	"use strict";

	return Controller.extend("tvs.TableViewSetting.controller.View1", {
		onInit: function () {
			this._mViewSettingsDialogs = {};
			this.getOwnerComponent().getModel();
			this.getOwnerComponent().getModel("filters");
		},
		createViewSettingsDialog: function (sDialogFragmentName) {
			var oDialog = this._mViewSettingsDialogs[sDialogFragmentName];

			if (!oDialog) {
				oDialog = sap.ui.xmlfragment(sDialogFragmentName, this);
				this._mViewSettingsDialogs[sDialogFragmentName] = oDialog;
			}
			return oDialog;
		},

		handleFilterButtonPressed: function (oEvent) {

			let oTable = this.byId("idProductsTable"),
				oBinding = oTable.getBinding("items"),
				oModel = this.getOwnerComponent().getModel(),
				oModelFilter = this.getOwnerComponent().getModel("filters"),
				aData = oModel.getProperty("/userDetails");
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
			this.getView().addDependent(this.createViewSettingsDialog("tvs.TableViewSetting.view.fragments.filterDialog"));
			this.createViewSettingsDialog("tvs.TableViewSetting.view.fragments.filterDialog").open();
		},

		handleFilterDialogConfirm: function (oEvent) {
			let oTable = this.byId("idProductsTable"),
				mParams = oEvent.getParameters(),
				oBinding = oTable.getBinding("items"),
				aFilters = [];

			mParams.filterItems.forEach(function (oItem) {
				let aSplit = oItem.getKey().split("___"),
					sPath = aSplit[0],
					sOperator = aSplit[1],
					sValue1 = aSplit[2],
					sValue2 = aSplit[3],
					oFilter = new Filter(sPath, sOperator, sValue1, sValue2);
				aFilters.push(oFilter);
			});

			// apply filter settings
			oBinding.filter(aFilters);

			// update filter bar
			this.byId("vsdFilterBar").setVisible(aFilters.length > 0);
			this.byId("vsdFilterLabel").setText(mParams.filterString);
		},
		
		removeFilter: function(){
			
		}

	});
});