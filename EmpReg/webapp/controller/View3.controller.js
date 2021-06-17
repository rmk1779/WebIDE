sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/core/Fragment",
	"sap/m/MessageToast"
], function (Controller, Filter, FilterOperator, Fragment, MessageToast) {
	"use strict";

	return Controller.extend("emp.EmpReg.controller.View3", {

		onInit: function () {
			this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			
			
		},

		onSearch: function (oEvent) {

			var searchStr = oEvent.getParameter("query");

			if (!searchStr) {
				searchStr = oEvent.getParameter("newValue");
			}

			var oFilterName = new sap.ui.model.Filter(
				"empName",
				sap.ui.model.FilterOperator.Contains,
				searchStr
			);

			var oFilterTyp = new sap.ui.model.Filter(
				"empId",
				sap.ui.model.FilterOperator.Contains,
				searchStr
			);

			var oFilter = new sap.ui.model.Filter({
				filters: [oFilterTyp, oFilterName],
				and: false
			});

			var aFilter = [oFilter];
			var oList = this.getView().byId("empList");

			var oBinding = oList.getBinding("items");
			oBinding.filter(aFilter);
		},

		oDialog: null,
		onAddEmp: function (oEvent) {
		var today = new Date();
		var date = today.getDate() +'-'+(today.getMonth()+1)+'-'+today.getFullYear();
	
		
			var oView = this.getView();
		
			// var oDialog = oView.byId("helloDialog");
			// create dialog lazily
			if (!this.oDialog) {
				// create dialog via fragment factory
				this.oDialog = sap.ui.xmlfragment(oView.getId("helloDialog"), "emp.EmpReg.fragments.AddEmp", this);
				// connect dialog to view (models, lifecycle)
				oView.addDependent(this.oDialog);

			}

			this.oDialog.open();
			
				var mDate = this.byId("DP1").setProperty("minDate", today);
		},

	

		onSave: function (oEvent) {
				var myVal = true;
			// this.byId("helloDialog").close();
			var mdl = this.getView().getModel();
			var data = mdl.getProperty("/Employees");
		
		
			// var ofrag = this.oDialog;

			// var Name = ofrag.getAggregation("content")[0]._aElements[1].getProperty("value");

			// var ID = ofrag.getAggregation("content")[0]._aElements[3].getProperty("value");

			// var Email = ofrag.getAggregation("content")[0]._aElements[5].getProperty("value");

			// var Mobile = ofrag.getAggregation("content")[0]._aElements[7].getProperty("value");

			// var Salary = ofrag.getAggregation("content")[0]._aElements[9].getProperty("value");
				var Name = this.byId("fName").getValue();

				// var ID = this.byId("fId").getValue();

				var Email = this.byId("fEmail").getValue();

				var Mobile = this.byId("fMobile").getValue();

				var Password = this.byId("fPwd").getValue();

				var Salary = this.byId("fSalary").getValue();
				
				var Joined = this.byId("DP1").getValue();
				
				var Postn = this.byId("posCombo").getSelectedItem().getText();
				
				var x = data.length;
				var y = 101;
				var z = x + y;
				var ID =  "EMP" + z;

			var dataObj = {
				"empId": ID,
				"empName": Name,
				"email": Email,
				"mobile": Mobile,
				"password": Password,
				"joinDate": Joined,
				"position": Postn,
				"salary": Salary,
				"currency": "INR"

			};
			for (var i = 0; i < data.length; i++) {
				
				if (Name === "" || Email === "" || Mobile === "" || Password === "" || Joined === "" || Postn === "" || Salary === "") {
					
					if(Name === ""){
					this.byId("fName").setValueState(sap.ui.core.ValueState.Error);
						// sap.m.MessageToast.show("Enter Name");
					}
					else{
					this.byId("fName").setValueState(sap.ui.core.ValueState.None);
					}
					
					if(Email === ""){
					this.byId("fEmail").setValueState(sap.ui.core.ValueState.Error);
						sap.m.MessageToast.show("Enter Email");
					}
						else{
					this.byId("fEmail").setValueState(sap.ui.core.ValueState.None);
					}
					
					if(Mobile === ""){
					this.byId("fMobile").setValueState(sap.ui.core.ValueState.Error);
						// sap.m.MessageToast.show("Enter Mobile");
					}
						else{
					this.byId("fMobile").setValueState(sap.ui.core.ValueState.None);
					}
					
					if(Password === ""){
					this.byId("fPwd").setValueState(sap.ui.core.ValueState.Error);
						// sap.m.MessageToast.show("Enter Password");
					}
						else{
					this.byId("fPwd").setValueState(sap.ui.core.ValueState.None);
					}
					
					if(Salary === ""){
					this.byId("fSalary").setValueState(sap.ui.core.ValueState.Error);
						// sap.m.MessageToast.show("Enter Salary");
					}
						else{
					this.byId("fSalary").setValueState(sap.ui.core.ValueState.None);
					}
					
					if(Joined === ""){
					this.byId("DP1").setValueState(sap.ui.core.ValueState.Error);
						// sap.m.MessageToast.show("Enter joining date");
					}
						else{
					this.byId("DP1").setValueState(sap.ui.core.ValueState.None);
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
				
					this.byId("fEmail").setValueState(sap.ui.core.ValueState.None);
					this.byId("fMobile").setValueState(sap.ui.core.ValueState.None);
					this.byId("fPwd").setValueState(sap.ui.core.ValueState.None);
					this.byId("fSalary").setValueState(sap.ui.core.ValueState.None);
					this.byId("DP1").setValueState(sap.ui.core.ValueState.None);
				

				var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
				var mobileformat = /^[0-9]{10}$/;
				var pwdformat = /^(?=.*\d)[a-zA-Z0-9]{5,10}$/;
				var dateFormat = /^\d{2}-[a-zA-Z]{3}-\d{4}$/;
				// var idformat = /^[0-9]{1,}$/;
				// if (!ID.match(idformat) && Email !== "") {
				// 	sap.m.MessageToast.show("ID format should be NUMBER");
				// 	var myVal = false;
				// 	break;
				// }

				if (!Email.match(mailformat) && Email !== "") {
					this.byId("fEmail").setValueState(sap.ui.core.ValueState.Error);
					sap.m.MessageToast.show("Enter correct email format abc@xyz.com");
					 myVal = false;
					break;
				}
					else{
					this.byId("fEmail").setValueState(sap.ui.core.ValueState.None);
					}

				if (!Mobile.match(mobileformat) && Mobile !== "" && Email.match(mailformat)) {
					this.byId("fMobile").setValueState(sap.ui.core.ValueState.Error);
					sap.m.MessageToast.show("Enter 10 digit Mobile Number");
					myVal = false;
					break;
				}
					else{
					this.byId("fMobile").setValueState(sap.ui.core.ValueState.None);
					}

				if (!Password.match(pwdformat) && Password !== "" && Email.match(mailformat) && Mobile.match(mobileformat)) {
					this.byId("fPwd").setValueState(sap.ui.core.ValueState.Error);
					sap.m.MessageToast.show("Password should be Alpha-Numeric 5-10 character");
					myVal = false;
					break;
				}
					else{
					this.byId("fPwd").setValueState(sap.ui.core.ValueState.None);
					}
				
				if (!Joined.match(dateFormat) && Joined !== "" && Email.match(mailformat) && Mobile.match(mobileformat) && Password.match(pwdformat)){
					this.byId("DP1").setValueState(sap.ui.core.ValueState.Error);
					sap.m.MessageToast.show("Enter correct DATE format");
					myVal = false;
					break;
				}
					else{
					this.byId("DP1").setValueState(sap.ui.core.ValueState.None);
					}
				
					if (ID === data[i].empId) {
						sap.m.MessageToast.show("ID already taken");
						myVal = false;
						break;

					} if (Email === data[i].email) {
						sap.m.MessageToast.show("Email already taken");
						myVal = false;
						break;
					} if (Password === data[i].password) {
						sap.m.MessageToast.show("Password already taken");
						myVal = false;
						break;
					} if (Mobile === data[i].mobile) {
						sap.m.MessageToast.show("Mobile Num already taken");
						myVal = false;
						break;
					} 
				
				 if(data[i].mobile === dataObj.mobile || data[i].email === dataObj.email){
					var sMsg = "Employee Mobile or Email already used";
					MessageToast.show(sMsg);
					myVal = false;
					break;
				}
			}
			if(myVal){
			data.push(dataObj);
			mdl.setProperty("/Employees", data);
			mdl.setData(data, true);
			sap.ui.getCore().setModel(mdl);
			
				this.byId("fName").setValue("");

				// this.byId("fId").setValue("");

				this.byId("fEmail").setValue("");

				this.byId("fMobile").setValue("");

				this.byId("fPwd").setValue("");
				
				this.byId("DP1").setValue("");
				
				// this.byId("posCombo").setValue("");

				this.byId("fSalary").setValue("");
				
					this.byId("fEmail").setValueState(sap.ui.core.ValueState.None);
					this.byId("fMobile").setValueState(sap.ui.core.ValueState.None);
					this.byId("fPwd").setValueState(sap.ui.core.ValueState.None);
					this.byId("fSalary").setValueState(sap.ui.core.ValueState.None);
					this.byId("DP1").setValueState(sap.ui.core.ValueState.None);
					
				MessageToast.show( "New Employee Added");
					this.byId("helloDialog").close();

			}
			
			
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
		
		onSelect: function(oEvent){
			
			var oItem = oEvent.getParameters().listItem;
			
			// var mdl = this.getView().getModel();
			// mdl.setProperty("/miniName", oItem);
			
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("View24", {
				miniPath: oItem.getBindingContextPath().substr(11)
			});
		},
		
		onDelete:function(oEvent){
		
			var oList = oEvent.getSource();
			var oItemToBeDeleted = oEvent.getParameter("listItem");
			oList.removeItem(oItemToBeDeleted);
			
			MessageToast.show(oEvent.getSource().getTitle() + "Employee Removed");	
			
		}

	});

});