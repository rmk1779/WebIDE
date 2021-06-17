sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/core/Fragment",
	"sap/m/MessageToast",
	"sap/m/MessageBox",
	"sap/ui/model/json/JSONModel"
], function (Controller, Filter, FilterOperator, Fragment, MessageToast, MessageBox, JSONModel) {
	"use strict";

	return Controller.extend("eod.empOdata.controller.View3", {

		onInit: function () {
			this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);

			var empData1 = new JSONModel();
			this.getOwnerComponent().setModel(empData1, "empData1");

			var searchData = new JSONModel();
			this.getOwnerComponent().setModel(searchData, "searchData");

			// var rdurl = "/ZRMK_EMPTABLESet";

			// 	var oModel = this.getOwnerComponent().getModel();

			var oModel = this.getOwnerComponent().getModel();

		},

		onSearch: function (oEvent) {
			// var recipt = /^\d+$/;
			// var aFilters = [];
			debugger;
			var searchStr = this.getView().byId("idSearch").getValue();

			// if(searchStr && searchStr.length > 0){

			// 	if (!recipt.test(searchStr)) {
			// 			var filter = new Filter("Empname", FilterOperator.EQ, '%' + searchStr + '%');
			// 			aFilters.push(filter);
			// 		} 
			// 		aFilters.push(filter);
			// }

			var that = this;

			var sView = this.getView();

			var oModel = that.getOwnerComponent().getModel();

			var rdurl = "/ZRMK_EMPTABLESet";

			oModel.read(rdurl, {
				// filters: [new sap.ui.model.Filter("Empname",sap.ui.model.FilterOperator.Contains,searchStr)],
				success: function (oData, oResponse) {
					var searchData = new JSONModel(oData);
					that.getOwnerComponent().setModel(searchData, "searchData");

					var oFilterName = new sap.ui.model.Filter(
						"Empname",
						sap.ui.model.FilterOperator.Contains,
						searchStr
					);

					var oFilter = new sap.ui.model.Filter({
						filters: [oFilterName],
						and: false
					});
					var sData = searchData.getData().results;

					sView.byId("empList").setProperty("items", "{searchData>/results}");
					sView.byId("idObjectListItem").setProperty("title", "{searchData>Empname}");
					sView.byId("idObjectListItem").setProperty("intro", "{searchData>Id}");
					sView.byId("idObjectListItem").setProperty("number", "{searchData>Empsalary}");
					// sView.byId("idObjectListItem").setProperty("numberState", "{searchData>Empsalary}");
					sView.byId("idObjectListItem").setProperty("numberUnit", "{searchData>Empcurrency}");

				},
				error: function (err, oResponse) {

					MessageBox.alert("error while searching record");
				}

			});

			// if (searchStr) {
			// 	aFilter.push(new Filter("Empname", FilterOperator.EQ, '%' + searchStr + '%'));
			// }
			// filter binding
			// var oList = this.byId("empList");
			// var oBinding = oList.getBinding("items");
			// oBinding.filter(aFilters);

			// if (!searchStr) {
			// 	searchStr = oEvent.getParameters("newValue");
			// }

			// var oFilterName = new sap.ui.model.Filter(
			// 	"Empname",
			// 	sap.ui.model.FilterOperator.Contains,
			// 	searchStr
			// );

			// var oFilterTyp = new sap.ui.model.Filter(
			// 	"Empid",
			// 	sap.ui.model.FilterOperator.Contains,
			// 	searchStr
			// );

			// var oFilter = new sap.ui.model.Filter({
			// 	filters: [oFilterTyp, oFilterName],
			// 	and: false
			// });

			// var aFilter = [oFilter];
			// var oList = this.getView().byId("empList");

			// var oBinding = oList.getBinding("items");
			// oBinding.filter(aFilter);
		},

		onSelect: function (oEvent) {

			var oItem = oEvent.getParameters().listItem;

			// var mdl = this.getView().getModel();
			// mdl.setProperty("/miniName", oItem);

			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("View24", {
				miniPath: oItem.getBindingContextPath().substr(19, 6)
			});
		},

		oDialog: null,
		onAddEmp: function (oEvent) {
			var today = new Date();

			var date = today.getDate() + '-' + (today.getMonth() + 1) + '-' + today.getFullYear();

			var oView = this.getView();

			// var oDialog = oView.byId("helloDialog");
			// create dialog lazily
			if (!this.oDialog) {
				// create dialog via fragment factory
				this.oDialog = sap.ui.xmlfragment(oView.getId("helloDialog"), "eod.empOdata.fragments.AddEmp", this);
				// connect dialog to view (models, lifecycle)
				oView.addDependent(this.oDialog);

			}

			this.oDialog.open();

			var mDate = oView.byId("DP1").setProperty("minDate", today);
			var cDate = oView.byId("DP1").setValue(today);
		},

		onCloseDialog: function () {

			this.byId("fName").setValueState(sap.ui.core.ValueState.None);
			this.byId("fEmail").setValueState(sap.ui.core.ValueState.None);
			this.byId("fMobile").setValueState(sap.ui.core.ValueState.None);
			this.byId("fPwd").setValueState(sap.ui.core.ValueState.None);
			this.byId("fSalary").setValueState(sap.ui.core.ValueState.None);
			this.byId("DP1").setValueState(sap.ui.core.ValueState.None);

			this.byId("fName").setValue("");

			// this.byId("fId").setValue("");

			this.byId("fEmail").setValue("");

			this.byId("fMobile").setValue("");

			this.byId("fPwd").setValue("");

			this.byId("DP1").setValue("");

			// this.byId("posCombo").setValue("");

			this.byId("fSalary").setValue("");

			this.byId("helloDialog").close();

		},

		onSave: function (oEvent) {

			var myVal = true;

			var oView1 = this.getView();

			var that = this;

			var oModel = that.getOwnerComponent().getModel();

			var rdurl = "/ZRMK_EMPTABLESet";

			oModel.read(rdurl, {
				success: function (oData, oResponse) {
					var empData1 = new JSONModel(oData);
					that.getOwnerComponent().setModel(empData1, "empData1");

					var jData = empData1.getData().results;

					var Name = oView1.byId("fName").getValue();

					// var ID = this.byId("fId").getValue();

					var Email = oView1.byId("fEmail").getValue();

					var Mobile = oView1.byId("fMobile").getValue();

					var Password = oView1.byId("fPwd").getValue();

					var Salary = oView1.byId("fSalary").getValue();

					var x = JSON.stringify(oView1.byId("DP1").getDateValue());
					var Joined = x.substr(1, 19);

					var Postn = oView1.byId("posCombo").getSelectedItem().getText();

					var d = JSON.stringify(new Date());
					var dt = d.substr(1, 19);

					// var ln = Object.keys(oModel.oData).length;

					var y = 101;
					var z = jData.length + y;
					var ID = "EMP" + z;
					// var empty = null;

					var obj1 = {
						"Id": ID,
						"Password": Password,
						"Empname": Name,
						"Empmail": Email,
						"Empmobile": Mobile,
						"Empposition": Postn,
						"Empjoindate": Joined,
						"Empsalary": Salary,
						"Empcurrency": "INR",
						// "Empadhar": empty,
						"Empdob": dt,
						// "Empgender": empty,
						// "Empmarital": empty,
						// "Empcaddrs": empty,
						// "Emppaddrs": empty,
						// "Empnotify": empty

					};

					for (var i = 0; i < jData.length; i++) {

						if (Name === "" || Email === "" || Mobile === "" || Password === "" || Joined === "" || Postn === "" || Salary === "") {

							if (Name === "") {
								oView1.byId("fName").setValueState(sap.ui.core.ValueState.Error);
								// sap.m.MessageToast.show("Enter Name");
							} else {
								oView1.byId("fName").setValueState(sap.ui.core.ValueState.None);
							}

							if (Email === "") {
								oView1.byId("fEmail").setValueState(sap.ui.core.ValueState.Error);
								sap.m.MessageToast.show("Enter Email");
							} else {
								oView1.byId("fEmail").setValueState(sap.ui.core.ValueState.None);
							}

							if (Mobile === "") {
								oView1.byId("fMobile").setValueState(sap.ui.core.ValueState.Error);
								// sap.m.MessageToast.show("Enter Mobile");
							} else {
								oView1.byId("fMobile").setValueState(sap.ui.core.ValueState.None);
							}

							if (Password === "") {
								oView1.byId("fPwd").setValueState(sap.ui.core.ValueState.Error);
								// sap.m.MessageToast.show("Enter Password");
							} else {
								oView1.byId("fPwd").setValueState(sap.ui.core.ValueState.None);
							}

							if (Salary === "") {
								oView1.byId("fSalary").setValueState(sap.ui.core.ValueState.Error);
								// sap.m.MessageToast.show("Enter Salary");
							} else {
								oView1.byId("fSalary").setValueState(sap.ui.core.ValueState.None);
							}

							if (Joined === "") {
								oView1.byId("DP1").setValueState(sap.ui.core.ValueState.Error);
								// sap.m.MessageToast.show("Enter joining date");
							} else {
								oView1.byId("DP1").setValueState(sap.ui.core.ValueState.None);
							}

							// this.byId("fEmail").setValueState(sap.ui.core.ValueState.Error);
							// this.byId("fMobile").setValueState(sap.ui.core.ValueState.Error);
							// this.byId("fPwd").setValueState(sap.ui.core.ValueState.Error);
							// this.byId("fSalary").setValueState(sap.ui.core.ValueState.Error);
							// this.byId("DP1").setValueState(sap.ui.core.ValueState.Error);
							sap.m.MessageToast.show("Enter input");
							myVal = false;
							break;
						}

						oView1.byId("fName").setValueState(sap.ui.core.ValueState.None);
						oView1.byId("fEmail").setValueState(sap.ui.core.ValueState.None);
						oView1.byId("fMobile").setValueState(sap.ui.core.ValueState.None);
						oView1.byId("fPwd").setValueState(sap.ui.core.ValueState.None);
						oView1.byId("fSalary").setValueState(sap.ui.core.ValueState.None);
						oView1.byId("DP1").setValueState(sap.ui.core.ValueState.None);

						var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
						var mobileformat = /^[0-9]{10}$/;
						var pwdformat = /^(?=.*\d)[a-zA-Z0-9]{5,10}$/;
						// var dateFormat = /^\d{2}-[a-zA-Z]{3}-\d{4}$/;
						// var idformat = /^[0-9]{1,}$/;
						// if (!ID.match(idformat) && Email !== "") {
						// 	sap.m.MessageToast.show("ID format should be NUMBER");
						// 	var myVal = false;
						// 	break;
						// }

						if (!Email.match(mailformat) && Email !== "") {
							oView1.byId("fEmail").setValueState(sap.ui.core.ValueState.Error);
							sap.m.MessageToast.show("Enter correct email format abc@xyz.com");
							myVal = false;
							break;
						} else {
							oView1.byId("fEmail").setValueState(sap.ui.core.ValueState.None);
						}

						if (!Mobile.match(mobileformat) && Mobile !== "" && Email.match(mailformat)) {
							oView1.byId("fMobile").setValueState(sap.ui.core.ValueState.Error);
							sap.m.MessageToast.show("Enter 10 digit Mobile Number");
							myVal = false;
							break;
						} else {
							oView1.byId("fMobile").setValueState(sap.ui.core.ValueState.None);
						}

						if (!Password.match(pwdformat) && Password !== "" && Email.match(mailformat) && Mobile.match(mobileformat)) {
							oView1.byId("fPwd").setValueState(sap.ui.core.ValueState.Error);
							sap.m.MessageToast.show("Password should be Alpha-Numeric 5-10 character");
							myVal = false;
							break;
						} else {
							oView1.byId("fPwd").setValueState(sap.ui.core.ValueState.None);
						}

						// if (!Joined.match(dateFormat) && Joined !== "" && Email.match(mailformat) && Mobile.match(mobileformat) && Password.match(
						// 		pwdformat)) {
						// 	oView1.byId("DP1").setValueState(sap.ui.core.ValueState.Error);
						// 	sap.m.MessageToast.show("Enter correct DATE format");
						// 	myVal = false;
						// 	break;
						// } else {
						// 	oView1.byId("DP1").setValueState(sap.ui.core.ValueState.None);
						// }

						if (ID === jData[i].Id) {
							sap.m.MessageToast.show("ID already taken");
							myVal = false;
							break;

						}
						if (Email === jData[i].Empmail) {
							sap.m.MessageToast.show("Email already taken");
							myVal = false;
							break;
						}
						if (Password === jData[i].Password) {
							sap.m.MessageToast.show("Password already taken");
							myVal = false;
							break;
						}
						if (Mobile === jData[i].Empmobile) {
							sap.m.MessageToast.show("Mobile Num already taken");
							myVal = false;
							break;
						}

						if (jData[i].Empmobile === obj1.Empmobile || jData[i].email === obj1.Empmail) {
							var sMsg = "Employee Mobile or Email already used";
							MessageToast.show(sMsg);
							myVal = false;
							break;
						}

					}
					if (myVal) {
						oModel.create("/ZRMK_EMPTABLESet", obj1, {
							success: function (oData, oResponse) {
								oModel.refresh();
								// this.onCloseDialog();

								oView1.byId("fName").setValueState(sap.ui.core.ValueState.None);
								oView1.byId("fEmail").setValueState(sap.ui.core.ValueState.None);
								oView1.byId("fMobile").setValueState(sap.ui.core.ValueState.None);
								oView1.byId("fPwd").setValueState(sap.ui.core.ValueState.None);
								oView1.byId("fSalary").setValueState(sap.ui.core.ValueState.None);
								oView1.byId("DP1").setValueState(sap.ui.core.ValueState.None);

								oView1.byId("fName").setValue("");

								// this.byId("fId").setValue("");

								oView1.byId("fEmail").setValue("");

								oView1.byId("fMobile").setValue("");

								oView1.byId("fPwd").setValue("");

								oView1.byId("DP1").setValue("");

								// this.byId("posCombo").setValue("");

								oView1.byId("fSalary").setValue("");

								oView1.byId("helloDialog").close();

								MessageBox.alert("record created");

							},
							error: function (err, oResponse) {

								// MessageBox.alert("error while creating record");
							}

						});
					}

					//		MessageBox.alert("Record created");

				},
				error: function (err, oResponse) {

				}

			});

			// 	var md = that.getOwnerComponent().getModel("empData1");
			// // var mx =	md.setData(oModel.oData);
			// // var jmdl = md.loadData(oModel.oData);
			// 			// 	success: function (oData, oResponse) {
			// 	var check = md.getData().results;

			//onSave function ends here	
		}

	});

});