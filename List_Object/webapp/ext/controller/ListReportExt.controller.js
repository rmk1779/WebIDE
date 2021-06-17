sap.ui.controller("LO.list_object.ext.controller.ListReportExt", {
	onInit: function(){
	var oViewId = this.getView().getId();	
	var oTable = this.getView().byId(`${oViewId}--listReport-Expensive`);
	
	oTable.setRequestAtLeastFields("CustomerID, Quantity, City");
	},
	onClickActionInvoices1: function (oEvent) {},
	
	onListNavigationExtension: function(oEvent){
		
		alert("hi I am navigating to object page");
	}
});