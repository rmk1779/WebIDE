sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
	"sap/ui/model/json/JSONModel",
	"../model/formatter"
], function (Controller, MessageBox, JSONModel, formatter) {
	"use strict";

	return Controller.extend("eod.empOdata.controller.View4", {
   formatter: formatter,
		onInit: function () {
			
			// debugger;
			this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);

			this.oRouter.getRoute("View24").attachPatternMatched(this._onObjectMatched, this);

			var empData = new JSONModel();
			this.getOwnerComponent().setModel(empData, "empData");

			var empAcpt = new JSONModel();
			this.getOwnerComponent().setModel(empAcpt, "empAcpt");
			
			var empRej = new JSONModel();
			this.getOwnerComponent().setModel(empRej, "empRej");
			
			var dt = "ADMIN";
			
			this.byId("idNbtn").bindElement("/zrmk_ohrtblSet('" + dt + "')");
			this.byId("idNbtnLog").bindElement("/zrmk_ohrtblSet('" + dt + "')");
		},

		_onObjectMatched: function (oEvent) {
			var oArg = oEvent.getParameters("arguments");

			// var path= "/" + oEvent.getParameter("arguments").miniPath;
			// this.getView().bindElement({
			// 	path: "/" + oEvent.getParameter("arguments").miniPath,
			// 	model: "miniData/despicable/"

			// });
			var oView = this.getView();
			oView.setModel(this.getOwnerComponent().getModel());
			
			oView.bindElement("/ZRMK_EMPTABLESet('" + oArg.arguments.miniPath + "')");
			
		},

		onLogout: function () {

			this.oRouter.navTo("View1");

		},

		oPopover: null,
		oLeaveover: null,
		onHRNotify: function (oEvent) {

			var oView = this.getView();
			// var oPopover = oView.byId("oPop");

			// oPopover.toggle(oEvent.getSource());

			// create dialog lazily
			if (!this.oPopover) {
				// create dialog via fragment factory
				this.oPopover = sap.ui.xmlfragment(oView.getId(), "eod.empOdata.fragments.HRnotific", this);
				// connect dialog to view (models, lifecycle)
				this.getView().addDependent(this.oPopover);

				// this.oPopover.bindElement("/edits");

			}
			// this.oPopover.open();
			this.oPopover.openBy(oEvent.getSource());
		},
		
		onLeave: function(oEvent){
			var oView = this.getView();
			// var oPopover = oView.byId("oPop");

			// oPopover.toggle(oEvent.getSource());

			// create dialog lazily
			if (!this.oLeaveover) {
				// create dialog via fragment factory
				this.oLeaveover = sap.ui.xmlfragment(oView.getId(), "eod.empOdata.fragments.Leaves", this);
				// connect dialog to view (models, lifecycle)
				this.getView().addDependent(this.oLeaveover);

				// this.oPopover.bindElement("/edits");

			}
			// this.oPopover.open();
			this.oLeaveover.openBy(oEvent.getSource());
		},

		onDisapprove: function () {

			this.oPopover.close();
		},

		onAcceptPress: function (oEvent) {

			// var pData = omdl.getProperty("/Employees");
			// var ln = omdl.getProperty("/length");
			// var ed = omdl.getProperty("/edits");

			// var eData = omdl.getProperty("/edits");

			var upId = oEvent.getSource().getParent().getParent().getTitle();
			var upMobile = oEvent.getSource().getParent().getParent().getAuthorName();
			var upAddress = oEvent.getSource().getParent().getParent().getDescription();

			var that = this;
			var oView = this.getView();

			var oModel = that.getOwnerComponent().getModel();
			var readurl = "/ZRMK_EMPTABLESet";

			oModel.read(readurl, {
				success: function (oData, oResponse) {
					// debugger;
					var empAcpt = new JSONModel(oData);
					that.getOwnerComponent().setModel(empAcpt, "empAcpt");

					var acptData = empAcpt.getData().results;

					for (var i = 0; i < acptData.length; i++) {

						if (upId == acptData[i].Id) {

							var acptObj = {
								"Empmobile": upMobile,
								"Empcaddrs": upAddress
							};

							var accptURL = "/ZRMK_EMPTABLESet(Id='"+upId+"')";

							oModel.update(accptURL, acptObj, {
								success: function (oData, oResponse) {
									oModel.refresh();
									MessageBox.alert('Record updated successfully..');
								},
								error: function (err, oResponse) {
									MessageBox.alert('Error while updating record-');
								}
							});

						}
					}
				},
				error: function (err, oResponse) {

				}
			});
		},
		
			onRejectPress: function (oEvent) {

			// var pData = omdl.getProperty("/Employees");
			// var ln = omdl.getProperty("/length");
			// var ed = omdl.getProperty("/edits");

			// var eData = omdl.getProperty("/edits");

			var upId = oEvent.getSource().getParent().getParent().getTitle();
			var upMobile = oEvent.getSource().getParent().getParent().getAuthorName();
			var upAddress = oEvent.getSource().getParent().getParent().getDescription();

			var that = this;
			var oView = this.getView();

			var oModel = that.getOwnerComponent().getModel();
			var readurl = "/ZRMK_EMPTABLESet";
			var notif = "Reject";
			var msg = "Request has been rejected";

			oModel.read(readurl, {
				success: function (oData, oResponse) {
					// debugger;
					var empRej = new JSONModel(oData);
					that.getOwnerComponent().setModel(empRej, "empRej");

					var rejData = empRej.getData().results;

					for (var i = 0; i < rejData.length; i++) {

						if (upId == rejData[i].Id) {
							
							var rjObj = {
								"Empnotify": notif,
								"Empmsg": msg
							};

							var accptURL = "/ZRMK_EMPTABLESet(Id='"+upId+"')";

							oModel.update(accptURL, rjObj, {
								success: function (oData, oResponse) {
									oModel.refresh();
									MessageBox.alert('Record update rejected successfully..');
								},
								error: function (err, oResponse) {
									MessageBox.alert('Error while updating record-');
								}
							});

						}
					}
				},
				error: function (err, oResponse) {

				}
			});
		}
		// onItemClose: function(oEvent){
			
		// 		var that = this;
		// 	var oView = this.getView();

		// 	var oModel = that.getOwnerComponent().getModel();
		// 	var readurl = "/ZRMK_EMPNOTISet";
			
			
			
			
		// }

	});

});