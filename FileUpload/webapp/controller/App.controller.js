sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function (Controller) {
	"use strict";

	return Controller.extend("FU.FileUpload.controller.App", {
		onInit: function () {

			var sBindingPath = "/FILEJSONSet(Id='PIC101')";
			this.getView().bindElement(sBindingPath);
		},

		onUploadPress: function (oEvent) {
			
			var oModel = this.getView().getModel("imagesModel");
			var oData = oModel.getData();
			
			let oFileUploader = this.getView().byId("idImage"),
				oFileValue = oFileUploader.getValue();
				
			
			
			// var f = oEvent.oSource.oFileUpload.files[0];
			// var Path = URL.createObjectURL(f);
			// var obj = {
			// 	"Name": f.name,
			// 	"Pic": Path
			// };
			// oData.Images.push(obj);
			// oModel.setData(oData);
		}

	});
});