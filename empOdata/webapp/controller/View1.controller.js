sap.ui.define([
	"jquery.sap.global",
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
	"sap/ui/model/json/JSONModel"
], function (jQuery, Controller, MessageBox, JSONModel) {
	"use strict";
	var _timeout;
	return Controller.extend("eod.empOdata.controller.View1", {

		onInit: function () {
			this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);

			var hrData = new JSONModel();
			this.getOwnerComponent().setModel(hrData, "hrData");

			var userailstered = new JSONModel();
			this.getOwnerComponent().setModel(userailstered, "userailstered");

			var empData = new JSONModel();
			this.getOwnerComponent().setModel(empData, "empData");

			// this.getHrData();
			var oView = this.getView();
			// create dialog via fragment factory
			this.oDialog1 = sap.ui.xmlfragment(oView.getId("helloDialog1"), "eod.empOdata.fragments.EmpDetail", this);
			// connect dialog to view (models, lifecycle)
			oView.addDependent(this.oDialog1);

		},

		oDialog1: null,

		getHrData: function () {

			var that = this;
			var oModel = that.getOwnerComponent().getModel();
			var readurl = "/zrmk_ohrtblSet";
			oModel.read(readurl, {
				success: function (oData, oResponse) {
					var hrData = new JSONModel(oData);
					that.getOwnerComponent().setModel(hrData, "hrData");

					var userloginData = that.getOwnerComponent().getModel("userailstered");

					for (var i = 0; i < hrData.getData().results.length; i++) {
						var hrId = hrData.getData().results[i].Hrid;
						var hrPassword = hrData.getData().results[i].Hrpassword;
						if (userloginData.getData().Id === hrId && userloginData.getData().Password === hrPassword) {
							MessageBox.alert("Succesfully logged in to HR page");
							that.oRouter.navTo("View2");
							break;
						}
					}

				},
				error: function (err, oResponse) {
					MessageBox.alert("error while displaying record-".concat(err.response.statusText));
				}
			});

		},
		getEmpData: function () {
			var that = this;
			var oView = this.getView();
			var oDialog1 = oView.byId("helloDialog1");
			var oModel = that.getOwnerComponent().getModel();
			var readurl = "/ZRMK_EMPTABLESet";
			oModel.read(readurl, {
				success: function (oData, oResponse) {
					// debugger;
					var empData = new JSONModel(oData);
					that.getOwnerComponent().setModel(empData, "empData");

					var userloginData = that.getOwnerComponent().getModel("userailstered");

					for (var i = 0; i < empData.getData().results.length; i++) {
						var empId = empData.getData().results[i].Id;
						var empPassword = empData.getData().results[i].Password;

						var ipId = oView.byId("userId").getValue();
						var ipPwd = oView.byId("pwId").getValue();

						if (ipId === "" || ipPwd === "") {

							if (ipId === "") {
								oView.byId("userId").setValueState(sap.ui.core.ValueState.Error);
								/*sap.m.MessageToast.show("Please enter the Valid user ID");*/
							} else {
								oView.byId("userId").setValueState(sap.ui.core.ValueState.None);
							}

							if (ipPwd === "") {
								oView.byId("pwId").setValueState(sap.ui.core.ValueState.Error);
								// sap.m.MessageToast.show("Please enter the valid Password");	
							} else {
								oView.byId("pwId").setValueState(sap.ui.core.ValueState.None);
							}

							sap.m.MessageToast.show("Please enter the Input");
							break;
						}

						oView.byId("userId").setValueState(sap.ui.core.ValueState.None);
						oView.byId("pwId").setValueState(sap.ui.core.ValueState.None);

						if (userloginData.getData().Id === empId && userloginData.getData().Password === empPassword) {
							if (!empData.getData().results[i].Empcaddrs) {

								if (!that.oDialog1) {
									// create dialog via fragment factory
									that.oDialog1 = sap.ui.xmlfragment(oView.getId("helloDialog1"), "eod.empOdata.fragments.EmpDetail", this);
									// connect dialog to view (models, lifecycle)
									oView.addDependent(that.oDialog1);

								}
								oView.byId("fId1").setValue(empData.getData().results[i].Id);
								oView.byId("fEmail1").setValue(empData.getData().results[i].Empmail);
								oView.byId("fName1").setValue(empData.getData().results[i].Empname);
								oView.byId("fPw1").setValue(empData.getData().results[i].Password);

								oView.byId("DP3").setMinDate(new Date(1950, 0, 1));
								oView.byId("DP3").setMaxDate(new Date(1998, 11, 31));

								oView.byId("fAdhar1").setValue("");
								oView.byId("idCAddrs").setValue("");
								oView.byId("idPAddrs").setValue("");

								that.oDialog1.open();

								break;

							}
							oView.byId("userId").setValue("");
							oView.byId("pwId").setValue("");

							var bdlg = oView.byId("idBusy");

							if (!bdlg) {
								// create dialog via fragment factory
								bdlg = sap.ui.xmlfragment(oView.getId(), "eod.empOdata.fragments.BusyDlg", this);
								// connect dialog to view (models, lifecycle)
								oView.addDependent(bdlg);

							}

							bdlg.open();
							// simulate end of operation
							_timeout = jQuery.sap.delayedCall(1000, this, function () {
								bdlg.close();
							});

							that.oRouter.navTo("View5", {
								empPath: empId
							});

							// MessageBox.alert("Succesfully logged into Employee page");                   

							break;

						}
						if (userloginData.getData().Id !== empId || userloginData.getData().Password !== empPassword) {

							// sap.m.MessageToast.show("Incorrect userName or Password");

						}
						// do Navigation

					}
					// this.oRouter.navTo("View5");

				},
				error: function (err, oResponse) {
					MessageBox.alert("error while displaying record-".concat(err.response.statusText));
				}
			});

		},

		onLogin: function (oEvent) {
			this.getEmpData();
			this.getHrData();

		},

		onCloseDialog: function () {
			this.byId("fAdhar1").setValue("");
			this.byId("idCAddrs").setValue("");
			this.byId("idPAddrs").setValue("");

			this.oDialog1.close();

		},
		onSave1: function () {

			var oView2 = this.getView();
			var that = this;
			var oModel = that.getOwnerComponent().getModel();
			var rdurl = "/ZRMK_EMPTABLESet";

			oModel.read(rdurl, {
				success: function (oData, oResponse) {

					var empData = new JSONModel(oData);
					that.getOwnerComponent().setModel(empData, "empData");

					var eData = empData.getData().results;

					var valId = oView2.byId("fId1").getValue();
					var valPwd = oView2.byId("fPw1").getValue();
					var valAdhar = oView2.byId("fAdhar1").getValue();
					var valBrt = JSON.stringify(oView2.byId("DP3").getDateValue());
					var valBirth = valBrt.substr(1, 19);
					var valGender = oView2.byId("rdGrp1").getSelectedButton().getText();
					var valMar = oView2.byId("rdGrp2").getSelectedButton().getText();
					var valCAddress = oView2.byId("idCAddrs").getValue();
					var valPAddress = oView2.byId("idPAddrs").getValue();

					for (var i = 0; i < eData.length; i++) {

						if (valPwd === "" || valAdhar === "" || valBirth === "" || valGender === "" || valMar === "" || valCAddress === "" ||
							valPAddress === "") {
							if (valPwd === "") {
								oView2.byId("fPw1").setValueState(sap.ui.core.ValueState.Error);
							} else {
								oView2.byId("fPw1").setValueState(sap.ui.core.ValueState.None);
							}

							if (valAdhar === "") {
								oView2.byId("fAdhar1").setValueState(sap.ui.core.ValueState.Error);
							} else {
								oView2.byId("fAdhar1").setValueState(sap.ui.core.ValueState.None);
							}

							if (valBirth === "") {
								oView2.byId("DP3").setValueState(sap.ui.core.ValueState.Error);
							} else {
								oView2.byId("DP3").setValueState(sap.ui.core.ValueState.None);
							}

							if (valCAddress === "") {
								oView2.byId("idCAddrs").setValueState(sap.ui.core.ValueState.Error);
							} else {
								oView2.byId("idCAddrs").setValueState(sap.ui.core.ValueState.None);
							}

							if (valPAddress === "") {
								oView2.byId("idPAddrs").setValueState(sap.ui.core.ValueState.Error);
							} else {
								oView2.byId("idPAddrs").setValueState(sap.ui.core.ValueState.None);
							}

							sap.m.MessageToast.show("Please Enter the Value");
							break;
						}
						oView2.byId("fPw1").setValueState(sap.ui.core.ValueState.None);
						oView2.byId("fAdhar1").setValueState(sap.ui.core.ValueState.None);
						oView2.byId("DP3").setValueState(sap.ui.core.ValueState.None);
						oView2.byId("idCAddrs").setValueState(sap.ui.core.ValueState.None);
						oView2.byId("idPAddrs").setValueState(sap.ui.core.ValueState.None);

						var aadharFormat = /^[0-9]{12}$/;
						var pwdformat1 = /^(?=.*\d)[a-zA-Z0-9]{5,10}$/;
						if (!valPwd.match(pwdformat1)) {
							oView2.byId("fPw1").setValueState(sap.ui.core.ValueState.Error);
							sap.m.MessageToast.show("Password should be Alpha-Numeric 5-10 characters");
							break;
						} else {
							oView2.byId("fPw1").setValueState(sap.ui.core.ValueState.None);
						}
						if (!valAdhar.match(aadharFormat)) {
							oView2.byId("fAdhar1").setValueState(sap.ui.core.ValueState.Error);
							sap.m.MessageToast.show("Enter 12 digit Aadhar number format");
							break;
						} else {
							oView2.byId("fAdhar1").setValueState(sap.ui.core.ValueState.None);
						}

						if (valId === eData[i].Id) {
							// var ch = JSON.stringify(eData[i].Empjoindate.getDateValue());
							// var cjDate = ch.substr(1, 19);

							var obj2 = {
								// "Id": eData[i].Id,
								"Password": valPwd,
								// "Empname": eData[i].Empname,
								// "Empmail":eData[i].Empmail,
								// "Empmobile": eData[i].Empmobile,
								// "Empposition":eData[i].Empposition,
								// "Empjoindate":eData[i].Empjoindate,
								// "Empsalary":eData[i].Empsalary,
								// "Empcurrency":eData[i].Empcurrency,
								"Empadhar": valAdhar,
								"Empdob": valBirth,
								"Empgender": valGender,
								"Empmarital": valMar,
								"Empcaddrs": valCAddress,
								"Emppaddrs": valPAddress
									// "Empnotify": null
							};

							var updateURL = "/ZRMK_EMPTABLESet(Id='" + valId + "')";

							oModel.update(updateURL, obj2, {
								success: function (oData, oResponse) {
									oModel.refresh();
									MessageBox.alert('Record updated successfully..');
								},
								error: function (err, oResponse) {
									MessageBox.alert('Error while updating record-'.concat(err.response.statusText));
								}
							});

							// data1[i].password = valPwd;
							// data1[i].aadhar = valAdhar;
							// data1[i].birthDate = valBirth;
							// data1[i].gender = valGender;
							// data1[i].marital = valMar;
							// data1[i].currentAddress = valCAddress;
							// data1[i].permanentAddress = valPAddress;

							sap.m.MessageToast.show("Personal details Updated Succesfully");

							oView2.byId("helloDialog1").close();

							that.oRouter.navTo("View5", {
								empPath: valId
							});
							oView2.byId("userId").setValue("");
							oView2.byId("pwId").setValue("");
							break;
						}

					}

				},
				error: function (err, oResponse) {

				}

			});

		}

	});

});