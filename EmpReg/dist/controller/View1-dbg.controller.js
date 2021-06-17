sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageToast",
	"sap/ui/core/Core"
], function (Controller, MessageToast, core) {
	"use strict";

	return Controller.extend("emp.EmpReg.controller.View1", {

		onInit: function () {
			this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);

		},
		
			oDialog1: null,
		onLogin: function (oEvent) {
			debugger;
			var oView = this.getView();
			var mdl = this.getView().getModel();
			var data = mdl.getProperty("/Employees");
			
			var userId = oView.byId("userId").getValue();
			var userPwd = oView.byId("pwId").getValue();
			
			var userHR = "Admin";
			var pwHR = "password";
			
			
				

		
			// var oDialog = oView.byId("helloDialog");
			// create dialog lazily
		
			
			for(var i=0; i<data.length; i++){
				
				if(userId === "" || userPwd === "" ){
					
					if(userId === ""){
					this.byId("userId").setValueState(sap.ui.core.ValueState.Error);
					/*sap.m.MessageToast.show("Please enter the Valid user ID");*/	
					}
					else{
					this.byId("userId").setValueState(sap.ui.core.ValueState.None);	
					}
					
					if(userPwd === ""){
					this.byId("pwId").setValueState(sap.ui.core.ValueState.Error);
					// sap.m.MessageToast.show("Please enter the valid Password");	
					}
					else{
						this.byId("pwId").setValueState(sap.ui.core.ValueState.None);	
					}
					
				
					sap.m.MessageToast.show("Please enter the Input");
					break;
				}
				
				
				this.byId("userId").setValueState(sap.ui.core.ValueState.None);
				this.byId("pwId").setValueState(sap.ui.core.ValueState.None);
				
				if(userHR === userId && pwHR === userPwd){
					
				this.oRouter.navTo("View2");
				
				oView.byId("userId").setValue("");
				oView.byId("pwId").setValue("");
				break;
			}
				
				if(userId === data[i].empId &&  userPwd === data[i].password){
					
					if(!data[i].aadhar){
						
					if (!this.oDialog1) {
				// create dialog via fragment factory
				this.oDialog1 = sap.ui.xmlfragment(oView.getId(), "emp.EmpReg.fragments.EmpDetail", this);
				// connect dialog to view (models, lifecycle)
				oView.addDependent(this.oDialog1);
				
			}
			this.getView().byId("fId1").setValue(data[i].empId);
			this.getView().byId("fEmail1").setValue(data[i].email);
			this.getView().byId("fName1").setValue(data[i].empName);
			this.getView().byId("fPw1").setValue(data[i].password);
			
			// var mxDate = new Date("1998-12-30");
			// var mnDate = new Date("1950-12-30");
			
			// this.byId("DP3").setProperty("minDate", mnDate);
			// this.byId("DP3").setProperty("maxDate", mxDate);
			
			
			
			this.byId("DP3").setMinDate(new Date(1950, 0, 1));
			this.byId("DP3").setMaxDate(new Date(1998, 11, 31));
			
			
			
			this.getView().byId("fAdhar1").setValue("");
			this.getView().byId("idCAddrs").setValue("");
			this.getView().byId("idPAddrs").setValue("");

			this.oDialog1.open();
			
			break;
					}
				oView.byId("userId").setValue("");
				oView.byId("pwId").setValue("");
				
			// // Create instance of JSON model

   //          var oModel = new sap.ui.model.json.JSONModel();

   //        // Load JSON in model

   //           oModel.loadData("emp.EmpReg.model.Employee.json");
				
				
			this.oRouter.navTo("View5",{
				empPath: i
			});
			break;
				}
			if(userId !== data[i].empId ||  userPwd !== data[i].password){
				
				sap.m.MessageToast.show("Incorrect userName or Password");
				
			}
			
			}
		
		},





		onCloseDialog: function () {
			this.getView().byId("fAdhar1").setValue("");
			this.getView().byId("idCAddrs").setValue("");
			this.getView().byId("idPAddrs").setValue("");
			
			this.byId("helloDialog1").close();

		},
		
		
		onSave1: function(){
			
			var oView1 = this.getView();
			var mdl1 = oView1.getModel();
			var data1 = mdl1.getProperty("/Employees");
			
		var valId =	this.getView().byId("fId1").getValue();
		var valPwd =	this.getView().byId("fPw1").getValue();
		var valAdhar =	this.getView().byId("fAdhar1").getValue();
		var valBirth =	this.getView().byId("DP3").getValue();
		var valGender =	this.getView().byId("rdGrp1").getSelectedButton().getText();
		var valMar = this.getView().byId("rdGrp2").getSelectedButton().getText();
		var valCAddress = this.getView().byId("idCAddrs").getValue();
		var valPAddress = this.getView().byId("idPAddrs").getValue();
		
		for( var i = 0; i < data1.length; i++){
			
			if(valPwd === "" || valAdhar === "" || valBirth === "" || valGender === "" || valMar === "" || valCAddress === "" || valPAddress === "" ){
				if(valPwd === ""){
				this.byId("fPw1").setValueState(sap.ui.core.ValueState.Error);	
				}
				else{
					this.byId("fPw1").setValueState(sap.ui.core.ValueState.None);	
				}
				
				if(valAdhar === ""){
				this.byId("fAdhar1").setValueState(sap.ui.core.ValueState.Error);	
				}
				else{
					this.byId("fAdhar1").setValueState(sap.ui.core.ValueState.None);	
				}
				
				if(valBirth === ""){
				this.byId("DP3").setValueState(sap.ui.core.ValueState.Error);	
				}
				else{
					this.byId("DP3").setValueState(sap.ui.core.ValueState.None);	
				}
				
				if(valCAddress === ""){
				this.byId("idCAddrs").setValueState(sap.ui.core.ValueState.Error);	
				}
				else{
					this.byId("idCAddrs").setValueState(sap.ui.core.ValueState.None);	
				}
				
				if(valPAddress === ""){
				this.byId("idPAddrs").setValueState(sap.ui.core.ValueState.Error);	
				}
				else{
					this.byId("idPAddrs").setValueState(sap.ui.core.ValueState.None);	
				}
				
				
			
				sap.m.MessageToast.show("Please Enter the Value");
				break;
			}
				this.byId("fPw1").setValueState(sap.ui.core.ValueState.None);
				this.byId("fAdhar1").setValueState(sap.ui.core.ValueState.None);
				this.byId("DP3").setValueState(sap.ui.core.ValueState.None);
				this.byId("idCAddrs").setValueState(sap.ui.core.ValueState.None);
				this.byId("idPAddrs").setValueState(sap.ui.core.ValueState.None);
				
				
			var aadharFormat = /^[0-9]{12}$/;
			var pwdformat1 = /^(?=.*\d)[a-zA-Z0-9]{5,10}$/;
			if(!valPwd.match(pwdformat1)){
				this.byId("fPw1").setValueState(sap.ui.core.ValueState.Error);
				sap.m.MessageToast.show("Password should be Alpha-Numeric 5-10 characters");
				break;
			}
			else{
					this.byId("fPw1").setValueState(sap.ui.core.ValueState.None);
			}
			if(!valAdhar.match(aadharFormat)){
				this.byId("fAdhar1").setValueState(sap.ui.core.ValueState.Error);
				sap.m.MessageToast.show("Enter 12 digit Aadhar number format");
				break;
			}
			else{
					this.byId("fAdhar1").setValueState(sap.ui.core.ValueState.None);
			}
			
			if(valId === data1[i].empId){
				
				data1[i].password = valPwd;
				data1[i].aadhar = valAdhar;
				data1[i].birthDate = valBirth;
				data1[i].gender = valGender;
				data1[i].marital = valMar;
				data1[i].currentAddress = valCAddress;
				data1[i].permanentAddress = valPAddress;
				
				sap.m.MessageToast.show("Entries Updated Succesfully");
				
				this.byId("helloDialog1").close();
				
				this.oRouter.navTo("View5",{
				empPath: i
			});
				this.getView().byId("userId").setValue("");
				this.getView().byId("pwId").setValue("");
				break;
			}
			
			
		}
			
		}

	// onLogin: function (){
	
	// 	this.oRouter.navTo("View2");
	// }

	});

});