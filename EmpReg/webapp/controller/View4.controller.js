sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessagePopover",
	"sap/m/MessageToast"
], function (Controller, MessagePopover, MessageToast) {
	"use strict";

	return Controller.extend("emp.EmpReg.controller.View4", {

		onInit: function () {
			this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			this.oRouter.getRoute("View24").attachPatternMatched(this._onObjectMatched, this);

			// this.getOwnerComponent().getModel();

		},

		_onObjectMatched: function (oEvent) {
			debugger;
			var x;
			var oArg = oEvent.getParameters("arguments");

			// var path= "/" + oEvent.getParameter("arguments").miniPath;
			// this.getView().bindElement({
			// 	path: "/" + oEvent.getParameter("arguments").miniPath,
			// 	model: "miniData/despicable/"

			// });
			var oView = this.getView();
			oView.setModel(this.getOwnerComponent().getModel());
			oView.bindElement("/Employees/" + oArg.arguments.miniPath);
		},

		// oPopover: null,
		onHRNotify: function (oEvent) {

			var oView = this.getView();
			var oPopover = oView.byId("oPop");

			// oPopover.toggle(oEvent.getSource());

			// create dialog lazily
			if (!oPopover) {
				// create dialog via fragment factory
				oPopover = sap.ui.xmlfragment(oView.getId(), "emp.EmpReg.fragments.HRnotific", this);
				// connect dialog to view (models, lifecycle)
				this.getView().addDependent(oPopover);

				oPopover.bindElement("/edits");

			}
			oPopover.openBy(oEvent.getSource());
		},
				

		onDisapprove: function () {
			this.byId("oPop").close();
		},

		// onApprove: function(){

		// 	var oVw = this.getView();
		// 	var eMdl = this.getView().getModel();
		// 	var eData = eMdl.getProperty("/Employees");

		// 	var editedId = oVw.byId("edId").getValue();
		// 	var newNum = oVw.byId("newMbl").getValue();
		// 	var newAdr = oVw.byId("newAdr").getValue();

		// 	for(var i = 0; i < eData.length; i++){

		// 		if(editedId === eData[i].empId){
		// 			eData[i].mobile = newNum;
		// 			eData[i].address = newAdr;
		// 			break;
		// 		}
		// 	}

		// 	this.byId("helloDialog3").close();

		// },
		// preventBack: function(){window.history.forward();}
  //  setTimeout("this.preventBack()", 0);
  //  window.onunload=function(){null};

		onLogout: function () {

		this.getOwnerComponent().getRouter().navTo("View1", null, true);
			
			

		},

		onAcceptPress: function (oEvent) {
			var oViw = this.getView();
			var omdl = oViw.getModel();
			var pData = omdl.getProperty("/Employees");
			var ln = omdl.getProperty("/length");
			var ed = omdl.getProperty("/edits");

			// var eData = omdl.getProperty("/edits");

			var upId = oEvent.getSource().getParent().getParent().getTitle();
			var upMobile = oEvent.getSource().getParent().getParent().getAuthorName();
			var upAddress = oEvent.getSource().getParent().getParent().getDescription();

			for (var i = 0; i < pData.length; i++) {

				if (upId === pData[i].empId) {

					pData[i].mobile = upMobile;
					pData[i].currentAddress = upAddress;

					// this.getView().getModel().setProperty("/Employees"+[i]+"/currentAddress", upAddress);
					// this.getView().getModel().setProperty("/Employees"+[i]+"/mobile", upMobile);
					omdl.setProperty("/Employees", pData);

					break;

				}

			}

			for (var i = 0; i < ed.length; i++) {

				if (upId === ed[i].edId) {
					ed.splice(i, 1);
					omdl.setProperty("/edits", ed);
					omdl.setProperty("/length/0/editsLength", ed.length);

					if (ed.length == 0) {
						omdl.setProperty("/length/0/editsLength", "");
						omdl.setProperty("/request/0/requestNoti", "Transparent");
					}
					if (ed.length > 0) {
						omdl.setProperty("/length/0/editsLength", ed.length);
						omdl.setProperty("/request/0/requestNoti", "Reject");
					}

					sap.m.MessageToast.show("Request Approved");
					break;
				}
			}

			// 	var oMdl = this.getView().getModel();
			// var emp = oMdl.getProperty("/Employees");

			// var ln =  oMdl.getProperty("/length");
			// var ed =  oMdl.getProperty("/edits");

			// var oItem = oEvent.getSource().getTitle();

			// for(var i=0;i<ed.length; i++){
			// 	if(oItem == ed[i].edId){
			// 		ed.splice(i,1);
			// 		oMdl.setProperty("/edits", ed);
			// 		oMdl.setProperty("/length/0/editsLength", ed.length);
			// 		break;
			// 	}

			// }

			// sap.ui.getCore().setModel(omdl);
			// 	var oItem = oEvent.getSource().getParent().getParent();
			// var oList =	 oItem.getParent();

			// oList.removeItem(oItem);
		},

		onItemClose: function (oEvent) {
			// var oItem = oEvent.getSource(),
			// 	oList = oItem.getParent();

			// oList.removeItem(oItem);
			var oMdl = this.getView().getModel();
			var emp = oMdl.getProperty("/Employees");

			var ln = oMdl.getProperty("/length");
			var ed = oMdl.getProperty("/edits");

			var oItem = oEvent.getSource().getTitle();

			for (var i = 0; i < ed.length; i++) {
				if (oItem == ed[i].edId) {
					ed.splice(i, 1);
					oMdl.setProperty("/edits", ed);
					oMdl.setProperty("/length/0/editsLength", ed.length);
					break;
				}

			}

			if (ed.length == 0) {
				oMdl.setProperty("/length/0/editsLength", "");
				oMdl.setProperty("/request/0/requestNoti", "Transparent");
			}
			if (ed.length > 0) {
				// oMdl.setProperty("/length/0/editsLength", "");
				oMdl.setProperty("/length/0/editsLength", ed.length);
				oMdl.setProperty("/request/0/requestNoti", "Reject");
			}

			MessageToast.show(oEvent.getSource().getTitle() + "Notification Closed ");
		},

		onRejectPress: function (oEvent) {
			var oMdl4 = this.getView().getModel();

			var upId = oEvent.getSource().getParent().getParent().getTitle();

			var mdl4 = oMdl4.getProperty("/Employees");

			var rejMsg = "Your address and Mobile number update Request has been Rejected ";
			var rejNoti = "Reject";

			// var reject = oMdl4.getProperty("/reject");
			// reject[0].rejectNoti = rejNoti;
			// reject[0].rejectMsg = rejMsg;

			var ed = oMdl4.getProperty("/edits");

			for (var i = 0; i < mdl4.length; i++) {
				if (upId === mdl4[i].empId) {

					oMdl4.setProperty("/Employees/" + i + "/rejectMsg", rejMsg);
					oMdl4.setProperty("/Employees/" + i + "/rejectNoti", rejNoti);

					// mdl4[i].rejectNoti = rejNoti;
					// sap.m.MessageToast.show("Request Rejected");
					break;
				}
			}

			for (var i = 0; i < ed.length; i++) {

				if (upId == ed[i].edId) {

					ed.splice(i, 1);
					oMdl4.setProperty("/edits", ed);
					oMdl4.setProperty("/length/0/editsLength", ed.length);
					oMdl4.setProperty("/reject/0/rejectMsg", rejMsg);

					if (ed.length === 0) {
						oMdl4.setProperty("/length/0/editsLength", "");
						oMdl4.setProperty("/request/0/requestNoti", "Transparent");
					}
					if (ed.length > 0) {
						// oMdl.setProperty("/length/0/editsLength", "");
						oMdl4.setProperty("/length/0/editsLength", ed.length);
						oMdl4.setProperty("/request/0/requestNoti", "Reject");
					}

					sap.m.MessageToast.show("Request Rejected");
					break;

				}
			}

			// 	var oMdl = this.getView().getModel();
			// var emp = oMdl.getProperty("/Employees");

			// var ln =  oMdl.getProperty("/length");
			// var ed =  oMdl.getProperty("/edits");

			// var oItem = oEvent.getSource().getTitle();

			// for(var i=0;i<ed.length; i++){
			// 	if(oItem == ed[i].edId){
			// 		ed.splice(i,1);
			// 		oMdl.setProperty("/edits", ed);
			// 		oMdl.setProperty("/length/0/editsLength", ed.length);
			// 		break;
			// 	}

			// }

		}

	});

});