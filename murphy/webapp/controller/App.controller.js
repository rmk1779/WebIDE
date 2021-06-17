sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageToast",
	"sap/ui/export/Spreadsheet"
], function (Controller, MessageToast, Spreadsheet) {
	"use strict";

	return Controller.extend("mrp.murphy.controller.App", {
		onInit: function () {

		},
		oItemPop: null,
		onModify: function (oEvent) {

			var oView = this.getView();																																																																																																																																																																																																																																																																																																											

			var oTable = oView.byId("idProductsTable");

			var selectLength = oTable.getSelectedItems().length;
			
				if(!selectLength || null || undefined){
				
					MessageToast.show("Please select Table item to Modify"); 
				return;
			}
			// var cell = oTable.getSelectedtems()
			var cellsLength = oTable.getSelectedItems()[0].getCells().length;
			
		

			if (selectLength == 1) {
				// var oView = this.getView();
				// var oPopover = oView.byId("oPop");

				// oPopover.toggle(oEvent.getSource());
				
			var	selPath = oTable.getSelectedContextPaths()[0];

				// create dialog lazily
				if (!this.oItemPop) {
					// create dialog via fragment factory
					this.oItemPop = sap.ui.xmlfragment(oView.getId(), "mrp.murphy.fragments.itemAdd", this);
					// connect dialog to view (models, lifecycle)
					this.getView().addDependent(this.oItemPop);

					this.oItemPop.bindElement(selPath);

				}
				this.oItemPop.open();
				// this.oItemPop.openBy(oEvent.getSource());
			}
			 if (selectLength > 1) {

				for (var i = 0; i < selectLength; i++) {

					for (var j = 0; j < cellsLength; j++) {

						oTable.getSelectedItems()[i].getCells()[j].setProperty("editable", true);

					}

				}

			}
		// 	else{
		// MessageToast.show("Please select Table item to Modify"); 
		// 	}

		},

		onCloseitemDialog: function (oEvent) {

			this.oItemPop.close();
		},
		
		onSelectCN: function(oEvent){
			
			var oView = this.getView();
							// create dialog lazily
				if (!this.oItemPop) {
					// create dialog via fragment factory
					this.oItemPop = sap.ui.xmlfragment(oView.getId(), "mrp.murphy.fragments.itemAdd", this);
					// connect dialog to view (models, lifecycle)
					this.getView().addDependent(this.oItemPop);

					// this.oPopover.bindElement("/edits");

				}
				this.oItemPop.open();
				// this.oItemPop.openBy(oEvent.getSource());
		},
		
		onSave: function(oEvent){
			
			var oMdl = this.getView().getModel();
			
			var aColumns = [];
			
			aColumns.push(
				{
					label : "srNo",
					property : "srNo"
				});
				aColumns.push({
					label : "versionId",
					property : "versionId"
				});
				aColumns.push({
					label : "region",
					property : "region"
				});
				aColumns.push({
					label : "businessUnit",
					property : "businessUnit"
				});
				aColumns.push({
					label : "scenarioType",
					property : "scenarioType"
				});
				aColumns.push({
					label : "year",
					property : "year"
				});
				
				var mSettings = {
					
					workbook: {
						columns: aColumns,
						hierarchyLevel: 'level'
					},
					dataSource: oMdl.getData().Datas,
					fileName: "murphyTable.xlsx"
				};
				
				var oSpreadsheet = new Spreadsheet(mSettings);
				oSpreadsheet.build();
				
				// MessageToast.show("Excel File Generated");
		},
		
		onItemPress: function(oEvent){
		var oView =  this.getView();
			var x = 10;
			 var y;
		},
		
		onUpdateFields: function(oEvent){
			var oView = this.getView();
			
			var dts = this.getView().getModel().getProperty("/Datas");
			
			var srNoVal = oView.byId("idSrNo").getValue();
			var verIdVal = oView.byId("idVerID").getValue();
			var regionVal = oView.byId("idSrNo").getValue();
			var businessUniVal = oView.byId("idVerID").getValue();
			var scenarioTypeVal = oView.byId("idSrNo").getValue();
			var yearVal = oView.byId("idVerID").getValue();
			
		var pathIndex =	oView.byId("itemDialog").getBindingContext().sPath.substr(7);
		for(var i = 0 ; i < dts.length ; i++){
			if(dts[i].srNo ==    srNoVal){
				
				dts[i].region = regionVal ;
				dts[i].businessUnit = businessUniVal ;
				dts[i].scenarioType = scenarioTypeVal;
				dts[i].year = yearVal;
				
				this.getView().getModel().setProperty("/Datas", dts);
				
				break;
			}
	
		}
		
		}
	});
});