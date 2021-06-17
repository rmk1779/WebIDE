sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/type/String",
	"sap/m/ColumnListItem",
	"sap/m/Label",
	"sap/m/SearchField",
	"sap/m/Token",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/comp/library"
], function (Controller, typeString, ColumnListItem, Label, SearchField, Token, Filter, FilterOperator, compLibrary) {
	"use strict";

	return Controller.extend("vhd.ValueHelpDialog.controller.App", {
		onInit: function () {
			this._oMultiInput = this.getView().byId("multiInput");

			this.oColModel = this.getOwnerComponent().getModel("colModel");
			this.oProductsModel = this.getOwnerComponent().getModel();

		},

		onValueHelpRequested: function () {
			var aCols = this.oColModel.getData().cols;
			
			this._oBasicSearchField = new SearchField({
				showSearchButton: false
			});

			this._oValueHelpDialog = sap.ui.xmlfragment("vhd.ValueHelpDialog.view.fragments.ValueHelpDialog", this);
			this.getView().addDependent(this._oValueHelpDialog);
			
			this._oValueHelpDialog.setRangeKeyFields([{
				label: "Product",
				key: "ProductId",
				type: "string",
				typeInstance: new typeString({}, {
					maxLength: 7
				})
			}]);
			
			this._oValueHelpDialog.getFilterBar().setBasicSearch(this._oBasicSearchField);

			this._oValueHelpDialog.getTableAsync().then(function (oTable) {
				oTable.setModel(this.oProductsModel);
				oTable.setModel(this.oColModel, "columns");

				if (oTable.bindRows) {
					oTable.bindAggregation("rows", "/productList");
				}

				if (oTable.bindItems) {
					oTable.bindAggregation("items", "/productList", function () {
						return new ColumnListItem({
							cells: aCols.map(function (column) {
								return new Label({
									text: "{" + column.template + "}"
								});
							})
						});
					});
				}

				this._oValueHelpDialog.update();
			}.bind(this));
			
			this._oValueHelpDialog.setTokens(this._oMultiInput.getTokens());
			this._oValueHelpDialog.open();
		},

		onValueHelpOkPress: function (oEvent) {
			var aTokens = oEvent.getParameter("tokens");
			this._oMultiInput.setTokens(aTokens);
			
			let oTable = this.getView().byId("idProductsTable"),
				oBinding = oTable.getBinding("items");
			
			this._oValueHelpDialog.close();
		},

		onValueHelpCancelPress: function () {
			this._oValueHelpDialog.close();
		},

		onValueHelpAfterClose: function () {
			this._oValueHelpDialog.destroy();
		}
	});
});