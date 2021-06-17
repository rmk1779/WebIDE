sap.ui.controller("listReport.ext.controller.ListReportExt", {

	onInit: function () {
			
			console.log("I am OnInit");
	},
	onExit: function () {},
	onBeforeRendering: function () {
			console.log("I am onBeforeRendering");
	},
	onAfterRendering: function () {
		let oApi = this.extensionAPI,
			oView = this.getView(),
			oViewId = oView.getId(), 
			oFilterbar = oView.byId(`${oViewId}--listReportFilter`);
			
			oFilterbar.fireSearch();
			console.log("I am onAfterRendering");
	},

	onSelButtonPress: function (oEvent) {
		var aContexts = this.extensionAPI.getSelectedContexts();
		if (aContexts && aContexts.length > 0) {
			//Perform Action
			sap.m.MessageToast.show(`done ${aContexts}`);
		} else {
			sap.m.MessageBox.error("You must first select a row!", {});
		}
	}
});