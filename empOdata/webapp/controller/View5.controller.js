sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageToast",
	"sap/m/MessageBox",
	"sap/ui/model/json/JSONModel"
], function (Controller, MessageToast, MessageBox, JSONModel) {
	"use strict";

	return Controller.extend("eod.empOdata.controller.View5", {

		onInit: function () {

			this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			this.oRouter.getRoute("View5").attachPatternMatched(this._onObjectMatched, this);

			var pjData = new JSONModel();
			this.getOwnerComponent().setModel(pjData, "pjData");

			var cntData = new JSONModel();
			this.getOwnerComponent().setModel(cntData, "cntData");

			var oModel = this.getOwnerComponent().getModel();

		},

		_onObjectMatched: function (oEvent) {
			this.oArg = oEvent.getParameters("arguments");

			// var path= "/" + oEvent.getParameter("arguments").miniPath;
			// this.getView().bindElement({
			// 	path: "/" + oEvent.getParameter("arguments").miniPath,
			// 	model: "miniData/despicable/"

			// });
			var oView = this.getView();
			oView.setModel(this.getOwnerComponent().getModel());
			oView.bindElement("/ZRMK_EMPTABLESet('" + this.oArg.arguments.empPath + "')");
		},

		onLogout1: function () {

			this.oRouter.navTo("View1");

		},
		pDialog: null,
		onChangePwd: function () {

			var oView = this.getView();
			// var oDialog = oView.byId("helloDialog");
			// create dialog lazily
			if (!this.pDialog) {
				// create dialog via fragment factory
				this.pDialog = sap.ui.xmlfragment(oView.getId(), "eod.empOdata.fragments.PasswordChange", this);
				// connect dialog to view (models, lifecycle)
				oView.addDependent(this.pDialog);

			}

			this.pDialog.open();

		},

		onUpdatePwd: function () {

			var pView = this.getView();

			var pId = this.byId("linkID").getText();
			var newPassword = this.byId("newPwd").getValue();
			var pwdMatch = /^(?=.*\d)[a-zA-Z0-9]{5,10}$/;

			var that = this;

			var oModel = that.getOwnerComponent().getModel();

			var rdurl = "/ZRMK_EMPTABLESet";

			oModel.read(rdurl, {
				success: function (oData, oResponse) {

					var pjData = new JSONModel(oData);
					that.getOwnerComponent().setModel(pjData, "pjData");

					var jData = pjData.getData().results;

					for (var i = 0; i < jData.length; i++) {

						if (newPassword === "") {

							pView.byId("newPwd").setValueState(sap.ui.core.ValueState.Error);
							sap.m.MessageToast.show("Please Enter the Password");
							break;
						} else {
							pView.byId("newPwd").setValueState(sap.ui.core.ValueState.None);
						}

						if (!newPassword.match(pwdMatch)) {

							pView.byId("newPwd").setValueState(sap.ui.core.ValueState.Error);
							sap.m.MessageToast.show("Password should be Alpha-Numeric 5-10 characters");
							break;
						} else {
							pView.byId("newPwd").setValueState(sap.ui.core.ValueState.None);
						}

						if (pId === jData[i].Id) {

							// jData[i].password = newPassword;

							var pObj = {
								"Id": jData[i].Id,
								"Password": newPassword,
								"Empname": jData[i].Empname,
								"Empmail": jData[i].Empmail,
								"Empmobile": jData[i].Empmobile,
								"Empposition": jData[i].Empposition,
								"Empjoindate": jData[i].Empjoindate,
								"Empsalary": jData[i].Empsalary,
								"Empcurrency": jData[i].Empcurrency,
								"Empadhar": jData[i].Empadhar,
								"Empdob": jData[i].Empdob,
								"Empgender": jData[i].Empgender,
								"Empmarital": jData[i].Empmarital,
								"Empcaddrs": jData[i].Empcaddrs,
								"Emppaddrs": jData[i].Emppaddrs,
								"Empmsg": null,
								"Empnotify": null
							};

							var pwdURL = "/ZRMK_EMPTABLESet(Id='" + pId + "')";

							oModel.update(pwdURL, pObj, {
								success: function (oData, oResponse) {
									oModel.refresh();
									MessageBox.alert('Password updated successfully..');
								},
								error: function (err, oResponse) {
									MessageBox.alert('Error while updating record-'.concat(err.response.statusText));
								}
							});

							oModel.refresh();
							sap.m.MessageToast.show("Your Password has been Updated");
							pView.byId("newPwd").setValueState(sap.ui.core.ValueState.None);
							pView.byId("newPwd").setValue("");
							pView.byId("pwDialog").close();
							break;
						}

						//for loop ends here
					}

				},
				error: function (err, oResponse) {

					// MessageBox.alert("error while creating record");
				}

			});

			//function ends here	
		},

		onClosePDialog: function () {
			this.byId("newPwd").setValue("");
			this.byId("pwDialog").close();

		},

		oDialog3: null,
		onEdit: function (oEvent) {

			var oView = this.getView();
			// var oDialog = oView.byId("helloDialog");
			// create dialog lazily
			if (!this.oDialog3) {
				// create dialog via fragment factory
				this.oDialog3 = sap.ui.xmlfragment(oView.getId(), "eod.empOdata.fragments.Edit", this);
				// connect dialog to view (models, lifecycle)
				oView.addDependent(this.oDialog3);

			}

			this.oDialog3.open();
		},

		onRequest: function () {

			var oView3 = this.getView();
			// var oMdl3 = this.getView().getModel();
			var edId = oView3.byId("eId1").getValue();
			var mbl = oView3.byId("eMbl").getValue();
			var cAdr = oView3.byId("eAdr").getValue();

			var that = this;
			var oModel = that.getOwnerComponent().getModel();

			var rdurlNoti = "/ZRMK_EMPNOTISet";
			// var rdurlEmp = "/ZRMK_EMPNOTISet";

			for (var i = 1; i < 2; i++) {

				if (mbl === "" || cAdr === "") {
					if (mbl === "") {
						this.byId("eMbl").setValueState(sap.ui.core.ValueState.Error);
					} else {
						this.byId("eMbl").setValueState(sap.ui.core.ValueState.None);
					}

					if (cAdr === "") {
						this.byId("eAdr").setValueState(sap.ui.core.ValueState.Error);
					} else {
						this.byId("eAdr").setValueState(sap.ui.core.ValueState.None);
					}
					sap.m.MessageToast.show(" Enter the Input Value");
					break;

				}
				this.byId("eAdr").setValueState(sap.ui.core.ValueState.None);
				this.byId("eMbl").setValueState(sap.ui.core.ValueState.None);

				var mobFormat = /^[0-9]{10}$/;
				if (!mbl.match(mobFormat)) {
					this.byId("eMbl").setValueState(sap.ui.core.ValueState.Error);
					sap.m.MessageToast.show(" Enter 10 digit Mobile Number");
					break;
				}

				this.byId("eMbl").setValueState(sap.ui.core.ValueState.None);

				oView3.byId("eMbl").setValue("");
				oView3.byId("eAdr").setValue("");

				var reqOj = {
					"Id": edId,
					"Empnewmobile": mbl,
					"Empnewcaddrs": cAdr
				};
				// var myEditObject = this.getView().getModel().getProperty("/edits");
				// myEditObject.push(edited);

				oModel.create(rdurlNoti, reqOj, {
					success: function (oData, oResponse) {
						oModel.refresh();
						sap.m.MessageToast.show("Your Request has been sent");

					},

					error: function (err, oResponse) {
						MessageBox.alert('You have already sent Request please wait for the HR response');
					}
				});

				var cntUrl = "/ZRMK_EMPNOTISet";

				oModel.read(cntUrl, {
					success: function (oData, oResponse) {

						var cntData = new JSONModel(oData);
						that.getOwnerComponent().setModel(cntData, "cntData");
						var cData = cntData.getData().results;
						var cDataCnt = cData.length;
						var cDatacnt1 = JSON.stringify(cDataCnt);
						var hrnObj = {
							"Hrnoti": cDatacnt1
						};

						var hrnUrl = "/zrmk_ohrtblSet(Hrid='" + 'ADMIN' + "')";

						oModel.update(hrnUrl, hrnObj, {
							success: function (oData, oResponse) {
								oModel.refresh();
								MessageBox.alert('HR noti count incremented..');
							},
							error: function (err, oResponse) {
								MessageBox.alert('Error while Incrementing noti count-');
							}
						});

					},

					error: function (err, oResponse) {
						MessageBox.alert('Error while updating record-');
					}

				});

				this.byId("helloDialog2").close();
			}

		},
		onEmpNotify: function (oEvent) {

			var oView = this.getView();
			var oPopover2 = oView.byId("oPop2");

			// oPopover.toggle(oEvent.getSource());

			// create dialog lazily
			if (!oPopover2) {
				// create dialog via fragment factory
				oPopover2 = sap.ui.xmlfragment(oView.getId(), "eod.empOdata.fragments.EmpNotific", this);
				// connect dialog to view (models, lifecycle)
				this.getView().addDependent(oPopover2);

				// oPopover2.bindElement("/reject");

				// oPopover2.bindElement("/Employees/"+this.oArg.arguments.empPath);
				// var oList = oPopover2.getAggregation("content")[0].getAggregation("content")[0];
				// oList.bindItems("/Employees/"+this.oArg.arguments.empPath);
			}

			oPopover2.openBy(oEvent.getSource());
		},
		onCloseDialog: function () {

			this.byId("eMbl").setValueState(sap.ui.core.ValueState.None);
			this.byId("eAdr").setValueState(sap.ui.core.ValueState.None);

			this.byId("eMbl").setValue("");
			this.byId("eAdr").setValue("");

			this.byId("helloDialog2").close();

		},

		onLeaveRequest: function () {

			var oEview = this.getView();

			var that = this;
			var oModel = that.getOwnerComponent().getModel();
			var rdurl = "/ZRMK_EMPTABLESet";

			oModel.read(rdurl, {
				success: function (oData, oResponse) {
					var lId = oEview.byId("linkID").getText();
					var lvF = JSON.stringify(oEview.byId("idLeaveFrom").getDateValue());
					var lvFrom = lvF.substr(1, 19);
					var lvT = JSON.stringify(oEview.byId("idLeaveTo").getDateValue());
					var lvTo = lvT.substr(1, 19);
					var lvType = oEview.byId("idLeaveType").getSelectedItem().getText();
					var lvReason = oEview.byId("idLeaveReason").getValue();

					var leaveObj = {
						"Lfrom": lvFrom,
						"Lto": lvTo,
						"Ltype": lvType,
						"Lreason": lvReason,
					};

					var updateURL = "/ZRMK_EMPTABLESet(Id='" + lId + "')";

					oModel.update(updateURL, leaveObj, {
						success: function (oData, oResponse) {
							oModel.refresh();
							MessageBox.alert('Leave request sent..');
						},
						error: function (err, oResponse) {
							MessageBox.alert('Error while leave updating record-'.concat(err.response.statusText));
						}
					});

				},
				error: function (err, oResponse) {
					MessageBox.alert('Error while updating record-'.concat(err.response.statusText));
				}
			});

		}

	});

});