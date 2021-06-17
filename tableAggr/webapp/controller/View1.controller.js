sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/export/Spreadsheet"
], function (Controller,Spreadsheet) {
	"use strict";

	return Controller.extend("ta.tableAggr.controller.View1", {
		onInit: function () {

		},

		createContent: function (sId, oContext) {

			return new sap.m.ColumnListItem(sId, {
				type: "Active",
				cells: [
					new sap.m.Text({
						text: "{orderId}"
					}),
					new sap.m.Text({
						text: "{productId}"
					}),
					new sap.m.Text({
						text: "{productName}"
					}),
					new sap.m.ObjectListItem({
						number: "{unitPrice}",
						numberState: "Success"
					}),
					new sap.m.Text({
						text: "{quantity}"
					})
				]
			});

		},

		onAfterRendering: function () {

			var oTable = this.getView().byId("idProductsTable2");
			var crCells = new sap.m.ColumnListItem({
				type: "Active",
				cells: [
					new sap.m.Text({
						text: "{orderId}"
					}),
					new sap.m.Text({
						text: "{productId}"
					}),
					new sap.m.Text({
						text: "{productName}"
					}),
					new sap.m.ObjectListItem({
						number: "{unitPrice}",
						numberState: "Success"
					}),
					new sap.m.Text({
						text: "{quantity}"
					})
				]
			});

			oTable.bindItems("/orderDetails", crCells);
			//oTable.bindAggregation("items","/orderDetails",crCells);

			var oGridTable = this.getView().byId("idGridTable");

			var col1 = new sap.ui.table.Column({
				label: new sap.m.Label({
					text: "OrderId"
				}),
				template: new sap.m.Text({
					text: "{orderId}"
				})
			});

			var col2 = new sap.ui.table.Column({
				label: new sap.m.Label({
					text: "productId"
				}),
				template: new sap.m.Text({
					text: "{productId}"
				})
			});

			var col3 = new sap.ui.table.Column({
				label: new sap.m.Label({
					text: "productName"
				}),
				template: new sap.m.Text({
					text: "{productName}"
				})
			});

			var col4 = new sap.ui.table.Column({
				label: new sap.m.Label({
					text: "unitPrice"
				}),
				template: new sap.m.Text({
					text: "{unitPrice}"
				})
			});

			var col5 = new sap.ui.table.Column({
				label: new sap.m.Label({
					text: "quantity"
				}),
				template: new sap.m.Text({
					text: "{quantity}"
				})
			});

			oGridTable.addColumn(col1);
			oGridTable.addColumn(col2);
			oGridTable.addColumn(col3);
			oGridTable.addColumn(col4);
			oGridTable.addColumn(col5);

			oGridTable.bindRows("/orderDetails");

		},

		downPDF: function (oEvent) {
	debugger;
			var oMdl = this.getView().getModel();
			var aColumns = [];

			aColumns.push({
				label: "orderId",
				property: "orderId"
			});
			aColumns.push({
				label: "productId",
				property: "productId"
			});
			aColumns.push({
				label: "productName",
				property: "productName"
			});
			aColumns.push({
				label: "unitPrice",
				property: "unitPrice"
			});
			aColumns.push({
				label: "quantity",
				property: "quantity"
			});

			var mSettings = {

				workbook: {
					columns: aColumns,
					hierarchyLevel: 'level'
				},
				dataSource: oMdl.getData().orderDetails,
				fileName: "Tablespread.xlsx"
			};

			var oSpreadsheet = new Spreadsheet(mSettings);
			oSpreadsheet.build();

			// debugger;
			// var oData = this.getView().getModel().getProperty("/orderDetails");

			//             var columns = ["orderId","productId","productName","unitPrice", "quantity"];  
			//             var data = [];  
			//                 for(var i=0;i<oData.length;i++)   
			//                 {  
			//                     data[i]=[oData[i].orderId,oData[i].productId,oData[i].productName,oData[i].unitPrice, oData[i].quantity];  
			//                 }  

			//             var doc = new jsPDF('p', 'pt');  
			//             doc.autoTable(columns, data);  
			//             doc.save("DemoData.pdf");  

		}
	});
});