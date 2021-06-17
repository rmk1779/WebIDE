sap.ui.controller("listReport.ext.controller.ObjectPageExt", {

	onClickActionEmployeesHeader1: function (oEvent) {},

	onAfterRendering: function () {
		let oApi = this.extensionAPI,
			oView = this.getView(),
			oViewId = oView.getId(),
			oSection = oView.byId(`${oViewId}--idEmpInfo1::SubSection`),
			oSectionLength = oSection.getTitle().length;

		//Section title changed and length added
		oSection.setTitle(`RMK_Sec-(${oSectionLength})`);
		//Message Toast after page Load
		sap.m.MessageToast.show("OPL loaded");

	}
});