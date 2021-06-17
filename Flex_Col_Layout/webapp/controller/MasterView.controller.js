sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"FCL/Flex_Col_Layout/controller/BaseController",
	"sap/ui/model/Filter"
], function (Controller, BaseController, Filter) {
	"use strict";

	return BaseController.extend("FCL.Flex_Col_Layout.controller.MasterView", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf FCL.Flex_Col_Layout.view.MasterView
		 */
		onInit: function () {
			// this.getRouter();
		},
		onTripleColumn: function (oEvent) {

			// let FlexibleColumnUIState = this.getOwnerComponent().getModel("FlexibleColumnUIState");
			// FlexibleColumnUIState.setProperty("/layout", "ThreeColumnsMidExpanded");

				this.setFCLayout("ThreeColumnsMidExpanded");
				this.getRouter().navTo("tripleHome");

		},

		onSelectRows: function (oEvent) {
			// debugger;
			let oTable = this.getTable("idProductsTable"),
				aSelectContext = oTable.getSelectedItems(),
				oModel = this.getModel(),
				FlexibleColumnUIState = this.getModel("FlexibleColumnUIState"),
				aPassingData = [];
			if (aSelectContext && aSelectContext.length) {
				aSelectContext.forEach(function (oItem) {
					aPassingData.push(oItem.getBindingContext().getObject());
				});

				oModel.setProperty("/passedData", aPassingData);

				FlexibleColumnUIState.setProperty("/layout", "TwoColumnsMidExpanded");
				this.oRouter.navTo("secondHome");

			}

		},

		onSearch: function (oEvent) {
			let sQuery = oEvent.getParameter("query"),
				oModel = this.getModel(),
				FlexibleColumnUIState = this.getModel("FlexibleColumnUIState"),
				aFilters = [];

			if (!sQuery) {
				sQuery = oEvent.getParameter("newValue");
			}

			var oFilterSrNo = new sap.ui.model.Filter(
				"srNo",
				sap.ui.model.FilterOperator.Contains,
				sQuery
			);

			// var oFilter = new sap.ui.model.Filter({
			// 	filters: [oFilterSrNo],
			// 	and: false
			// });

			aFilters = [oFilterSrNo];

			oModel.setProperty("/passedData", aFilters);

			// FlexibleColumnUIState.setProperty("/layout", "TwoColumnsMidExpanded");
			
			// this.oRouter.navTo("secondHome");
			
			this.setFCLayout("TwoColumnsMidExpanded");
				this.getRouter().navTo("secondHome");

		},

		onGoFilter: function (oEvent) {

			let oView = this.getView(),
				oTable = oView.byId("idProductsTable"),
				mParams = oEvent.getParameters(),
				oBinding = oTable.getBinding("items"),
				aFilters = [];

			mParams.selectionSet.forEach(function (oItem) {
				var sPath = oItem.getSelectedKey(),
					sValue = oItem.getSelectedItem().getText(),
					sOperator = "EQ",
					sValue2 = "X",
					oFilter = new Filter(sPath, sOperator, sValue, sValue2, {
					and : false	
					});

				aFilters.push(oFilter);
			});

			oBinding.filter(aFilters);
		},
		
		onReset: function(oEvent){
			let oView = this.getView(),
				oTable = oView.byId("idProductsTable"),
				oBinding = oTable.getBinding("items");

			//Remove filters for the Table
			oBinding.filter(null);
		}

	});

});