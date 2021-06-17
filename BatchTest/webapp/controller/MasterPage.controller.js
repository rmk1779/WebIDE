sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"BT/BatchTest/controller/BaseController",
	"sap/m/MessageToast",
	"sap/ui/core/Fragment",
	"sap/m/MessageBox"
], function (Controller, BaseController, MessageToast, Fragment, MessageBox) {
	"use strict";

	return BaseController.extend("BT.BatchTest.controller.MasterPage", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf BT.BatchTest.view.MasterPage
		 */
		onInit: function () {
			
			this.getView().byId("idExitFullScreen").setVisible(false);
		},

		//Event handler to set Full screen page
		setFullScreen: function () {
			this.getView().byId("idExitFullScreen").setVisible(true);
			this.getView().byId("idEnterFullScreen").setVisible(false);
			this.setFCLayout("OneColumn");

		},

		//Event handler to Exit Full screen page
		setExitFullScreen: function () {
			this.getView().byId("idExitFullScreen").setVisible(false);
			this.getView().byId("idEnterFullScreen").setVisible(true);
			this.setFCLayout("TwoColumnsBeginExpanded");
		},

		//Event Handler on selecting employee to Move to Detail Page
		onSelectEmployee: function (oEvent) {

			let oItem = oEvent.getParameters().listItem;

			this.setFCLayout("TwoColumnsMidExpanded");

			this.getRouter().navTo("MasterToDetail", {
				empPath: oItem.getBindingContextPath().substr(-8, 6)
			});

		},

		//Event Handler to open Dialog fragment
		onOpenDialog: function () {

			var oView = this.getView();

			// create dialog lazily
			if (!this.byId("idModifyDialog")) {
				// load asynchronous XML fragment
				Fragment.load({
					id: oView.getId(),
					name: "BT.BatchTest.view.fragments.modifyEmp",
					controller: this
				}).then(function (oDialog) {
					// connect dialog to the root view of this component (models, lifecycle)
					oView.addDependent(oDialog);
					oDialog.open();
				});
			} else {
				this.byId("idModifyDialog").open();
			}

		},

		//Event handler to Close the Dialog Fragment
		onCloseDialog: function () {
			this.byId("idModifyDialog").close();
		},

		//Event Handler for update employee item Selectyed
		onSelectUpdateEmp: function (oEvent) {

			let oView = this.getView(),
				itemSelected = oEvent.getParameter("listItem"),
				itemBinding = itemSelected.getBindingContextPath(),
				updateFormLayout = oView.byId("idFormVisible"),
				oUpdateForm = oView.byId("idUpdateForm");

			updateFormLayout.setProperty("visible", true);

			oUpdateForm.bindElement(itemBinding);

		},

		//Event Handler for delete employee item Selected
		onSelectDeleteEmp: function (oEvent) {

			let itemDelete = oEvent.getParameter("listItem");
			this.itemDeleteBinding = itemDelete.getBindingContextPath();

		},

		//Event Handler to Modify employee Data by Create , Update and Delete
		onModify: function () {
			let oView = this.getView(),
				oModel = this.getModel();

			oModel.setUseBatch(true);

			//method to create new employee
			this.createEmployee();

			//method to Update employee
			this.updateEmployee();

			//method to Delete employee
			this.deleteEmployee();

			oModel.submitChanges({
				success: function (oData, oResponse) {
					MessageBox.alert("batch creation Done");
				},
				error: function (error, oResponse) {
					MessageBox.alert("batch call failed");
				}

			});

		},

		//method create new employee
		createEmployee: function () {
			let oView = this.getView(),
				oModel = this.getModel();

			let sName = oView.byId("nameId").getValue(),
				sId = oView.byId("idId").getValue(),
				sEmail = oView.byId("emailId").getValue(),
				sPassword = oView.byId("pwdId").getValue(),
				sAge = oView.byId("ageId").getValue(),
				sDobVal = new Date(oView.byId("dobId").getValue()),
				sDob = sDobVal.toISOString().substr(0, 19),
				sDojVal = new Date(oView.byId("dojId").getValue()),
				sDoj = sDojVal.toISOString().substr(0, 19),
				sSalary = oView.byId("salaryId").getValue(),
				sCadrs = oView.byId("cAddressId").getValue(),
				sPadrs = oView.byId("pAddressId").getValue()

			let oNewEmp = {
				Id: sId,
				Name: sName,
				Email: sEmail,
				Password: sPassword,
				Age: sAge,
				Dob: sDob,
				Doj: sDoj,
				Salary: sSalary,
				Caddress: sCadrs,
				Paddress: sPadrs
			};

			oModel.create("/ZRMK_EMPSet", oNewEmp, {
				success: function (oData, oResponse) {
					oModel.refresh();

					MessageBox.alert("record created");

				},
				error: function (err, oResponse) {

					MessageBox.alert("error while creating record");

				}

			});

		},

		//method to update Employee data
		updateEmployee: function () {

			let oView = this.getView(),
				oModel = this.getModel();

			let sNameUpdate = oView.byId("nameIdUpdate").getValue(),
				sIdUpdate = oView.byId("idIdUpdate").getValue(),
				sEmailUpdate = oView.byId("emailIdUpdate").getValue(),
				sPasswordUpdate = oView.byId("pwdIdUpdate").getValue(),
				sAgeUpdate = oView.byId("ageIdUpdate").getValue(),
				sDobValUpdate = new Date(oView.byId("dobIdUpdate").getValue()),
				sDobUpdate = sDobValUpdate.toISOString().substr(0, 19),
				sDojValUpdate = new Date(oView.byId("dojIdUpdate").getValue()),
				sDojUpdate = sDojValUpdate.toISOString().substr(0, 19),
				sSalaryUpdate = oView.byId("salaryIdUpdate").getValue(),
				sCadrsUpdate = oView.byId("cAdrsIdUpdate").getValue(),
				sPadrsUpdate = oView.byId("pAdrsIdUpdate").getValue()

			let oUpdateEmp = {
				Id: sIdUpdate,
				Name: sNameUpdate,
				Email: sEmailUpdate,
				Password: sPasswordUpdate,
				Age: sAgeUpdate,
				Dob: sDobUpdate,
				Doj: sDojUpdate,
				Salary: sSalaryUpdate,
				Caddress: sCadrsUpdate,
				Paddress: sPadrsUpdate
			};

			var updateURL = "/ZRMK_EMPSet(Id='" + sIdUpdate + "')";

			oModel.update(updateURL, oUpdateEmp, {
				success: function (oData, oResponse) {
					oModel.refresh();
					MessageBox.alert('Record updated successfully..');
				},
				error: function (err, oResponse) {
					MessageBox.alert('Error while updating record-');
				}

			});
		},

		//method to Delete Employee
		deleteEmployee: function () {
			let oView = this.getView(),
				oModel = this.getModel();

			let itemDel = this.itemDeleteBinding;

			oModel.remove(itemDel, {
				method: "DELETE",
				success: function (data) {
					MessageBox.alert("deleted succesfully");
				},
				error: function (e) {
					MessageBox.alert(" Delete error");
				}
			});
		}

	});

});