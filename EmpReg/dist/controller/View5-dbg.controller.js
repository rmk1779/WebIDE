
sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function (Controller) {
	"use strict";

	return Controller.extend("emp.EmpReg.controller.View5", {

		onInit: function () {

			this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			this.oRouter.getRoute("View5").attachPatternMatched(this._onObjectMatched, this);
			
			// this.getOwnerComponent().getModel();
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
			oView.bindElement("/Employees/" + this.oArg.arguments.empPath);
		},

		oDialog3: null,
		onEdit: function (oEvent) {

			var oView = this.getView();
			// var oDialog = oView.byId("helloDialog");
			// create dialog lazily
			if (!this.oDialog3) {
				// create dialog via fragment factory
				this.oDialog3 = sap.ui.xmlfragment(oView.getId(), "emp.EmpReg.fragments.Edit", this);
				// connect dialog to view (models, lifecycle)
				oView.addDependent(this.oDialog3);

			}

			this.oDialog3.open();
		},
	

		onLogout1: function () {

			this.oRouter.navTo("View1");

		},

		onEmpNotify: function (oEvent) {
			
			var oView = this.getView();
			var oPopover2 = oView.byId("oPop2");

			// oPopover.toggle(oEvent.getSource());

			// create dialog lazily
			if (!oPopover2) {
				// create dialog via fragment factory
				oPopover2 = sap.ui.xmlfragment(oView.getId(), "emp.EmpReg.fragments.EmpNotific", this);
				// connect dialog to view (models, lifecycle)
				this.getView().addDependent(oPopover2);

				// oPopover2.bindElement("/reject");
				
				// oPopover2.bindElement("/Employees/"+this.oArg.arguments.empPath);
				var oList = oPopover2.getAggregation("content")[0].getAggregation("content")[0];
				oList.bindItems("/Employees/"+this.oArg.arguments.empPath);
			}

			oPopover2.openBy(oEvent.getSource());
		},
		onDisapprove: function () {

			this.byId("oPop").close();
		},

		onRequest: function () {
			var oView3 = this.getView();
			var oMdl3 = this.getView().getModel();
			var edId = oView3.byId("eId1").getValue();
			var mbl = oView3.byId("eMbl").getValue();
			var cAdr = oView3.byId("eAdr").getValue();
			
		var i = 1;
			for(  i = 1; i < 2; i++){
				
			if(mbl === "" || cAdr === "" ){
				if(mbl === "" ){
				this.byId("eMbl").setValueState(sap.ui.core.ValueState.Error);	
				}
				else{
					this.byId("eMbl").setValueState(sap.ui.core.ValueState.None);
				}
				
				if(cAdr === "" ){
				this.byId("eAdr").setValueState(sap.ui.core.ValueState.Error);
				}
				else{
					this.byId("eAdr").setValueState(sap.ui.core.ValueState.None);
				}
				sap.m.MessageToast.show(" Enter the Input Value");
			break;	
			
			}
			this.byId("eAdr").setValueState(sap.ui.core.ValueState.None);
			this.byId("eMbl").setValueState(sap.ui.core.ValueState.None);
		
			var mobFormat = /^[0-9]{10}$/;
			if(!mbl.match(mobFormat)){
			this.byId("eMbl").setValueState(sap.ui.core.ValueState.Error);
			sap.m.MessageToast.show(" Enter 10 digit Mobile Number");	
			break;	
			}
			
			this.byId("eMbl").setValueState(sap.ui.core.ValueState.None);

			var edited = {
				edId: edId,
				mbl: mbl,
				adr: cAdr
			};
			var myEditObject = this.getView().getModel().getProperty("/edits");
			myEditObject.push(edited);
			
		

			oView3.byId("eMbl").setValue("");
			oView3.byId("eAdr").setValue("");

			var notifLength = myEditObject.length;

			var length = oMdl3.getProperty("/length");
			var request = oMdl3.getProperty("/request");

			length[0].editsLength = notifLength;
			request[0].requestNoti = "Reject";
			
			oMdl3.setProperty("/length", length);
			oMdl3.setProperty("/request", request);
			oMdl3.setProperty("/edits", myEditObject);

			sap.m.MessageToast.show("Your Request has been sent");

			this.byId("helloDialog2").close();
			}
		},
		
			onCloseDialog: function () {
				
			this.byId("eMbl").setValueState(sap.ui.core.ValueState.None);
			this.byId("eAdr").setValueState(sap.ui.core.ValueState.None);
			
			this.byId("eMbl").setValue("");
			this.byId("eAdr").setValue("");
			
			this.byId("helloDialog2").close();

		},

		onItemClose: function (oEvent) {
			// var oItem = oEvent.getSource(),
			// 	oList = oItem.getParent();

			// oList.removeItem(oItem);

			sap.m.MessageToast.show(oEvent.getSource().getTitle() + "Item Closed ");
		},
		
		
		pDialog:null,
		onChangePwd:function(){
		
		var oView = this.getView();
			// var oDialog = oView.byId("helloDialog");
			// create dialog lazily
			if (!this.pDialog) {
				// create dialog via fragment factory
				this.pDialog = sap.ui.xmlfragment(oView.getId(), "emp.EmpReg.fragments.PasswordChange", this);
				// connect dialog to view (models, lifecycle)
				oView.addDependent(this.pDialog);

			}

			this.pDialog.open();	
			
		},
		
		
		
		
		
		onUpdatePwd:function(){
			var pView = this.getView();
			var pModel = this.getView().getModel();
			var pId = this.byId("linkID").getText();
			var newPassword = this.byId("newPwd").getValue();
			var pwdMatch = /^(?=.*\d)[a-zA-Z0-9]{5,10}$/;
			var pData = pModel.getProperty("/Employees");
			
			for(var i = 0; i < pData.length; i++){
				
				if(newPassword === ""){
					
					this.byId("newPwd").setValueState(sap.ui.core.ValueState.Error);
					sap.m.MessageToast.show("Please Enter the Password");
					break;
				}
				else{
						this.byId("newPwd").setValueState(sap.ui.core.ValueState.None);	
				}
				
				if(!newPassword.match(pwdMatch)){
					
					this.byId("newPwd").setValueState(sap.ui.core.ValueState.Error);
					sap.m.MessageToast.show("Password should be Alpha-Numeric 5-10 characters");
					break;
				}
				else{
						this.byId("newPwd").setValueState(sap.ui.core.ValueState.None);	
				}
				
				if(pId === pData[i].empId){
				pData[i].password = newPassword;
				
				sap.m.MessageToast.show("Your Password has been Updated");
				this.byId("newPwd").setValueState(sap.ui.core.ValueState.None);
				this.byId("newPwd").setValue("");
				this.byId("pwDialog").close();
				break;
				}
			
			}
			
		},
		
			onClosePDialog: function(){
		this.byId("newPwd").setValue("");	
		this.byId("pwDialog").close();
		
		},
		
		onPrsNoti:function(){
			
		var notiView = this.getView();
		
		 this.byId("idPN").getTitle();
		
		this.byId("idPN").setTitle("");
		
		
		this.byId("oPop2").close();
		
		}
		
	

	});

});