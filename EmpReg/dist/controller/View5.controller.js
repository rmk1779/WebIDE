sap.ui.define(["sap/ui/core/mvc/Controller"],function(e){"use strict";return e.extend("emp.EmpReg.controller.View5",{onInit:function(){this.oRouter=sap.ui.core.UIComponent.getRouterFor(this);this.oRouter.getRoute("View5").attachPatternMatched(this._onObjectMatched,this)},_onObjectMatched:function(e){this.oArg=e.getParameters("arguments");var t=this.getView();t.setModel(this.getOwnerComponent().getModel());t.bindElement("/Employees/"+this.oArg.arguments.empPath)},oDialog3:null,onEdit:function(e){var t=this.getView();if(!this.oDialog3){this.oDialog3=sap.ui.xmlfragment(t.getId(),"emp.EmpReg.fragments.Edit",this);t.addDependent(this.oDialog3)}this.oDialog3.open()},onLogout1:function(){this.oRouter.navTo("View1")},onEmpNotify:function(e){var t=this.getView();var a=t.byId("oPop2");if(!a){a=sap.ui.xmlfragment(t.getId(),"emp.EmpReg.fragments.EmpNotific",this);this.getView().addDependent(a);var s=a.getAggregation("content")[0].getAggregation("content")[0];s.bindItems("/Employees/"+this.oArg.arguments.empPath)}a.openBy(e.getSource())},onDisapprove:function(){this.byId("oPop").close()},onRequest:function(){var e=this.getView();var t=this.getView().getModel();var a=e.byId("eId1").getValue();var s=e.byId("eMbl").getValue();var o=e.byId("eAdr").getValue();var i=1;for(i=1;i<2;i++){if(s===""||o===""){if(s===""){this.byId("eMbl").setValueState(sap.ui.core.ValueState.Error)}else{this.byId("eMbl").setValueState(sap.ui.core.ValueState.None)}if(o===""){this.byId("eAdr").setValueState(sap.ui.core.ValueState.Error)}else{this.byId("eAdr").setValueState(sap.ui.core.ValueState.None)}sap.m.MessageToast.show(" Enter the Input Value");break}this.byId("eAdr").setValueState(sap.ui.core.ValueState.None);this.byId("eMbl").setValueState(sap.ui.core.ValueState.None);var r=/^[0-9]{10}$/;if(!s.match(r)){this.byId("eMbl").setValueState(sap.ui.core.ValueState.Error);sap.m.MessageToast.show(" Enter 10 digit Mobile Number");break}this.byId("eMbl").setValueState(sap.ui.core.ValueState.None);var l={edId:a,mbl:s,adr:o};var n=this.getView().getModel().getProperty("/edits");n.push(l);e.byId("eMbl").setValue("");e.byId("eAdr").setValue("");var u=n.length;var d=t.getProperty("/length");var h=t.getProperty("/request");d[0].editsLength=u;h[0].requestNoti="Reject";t.setProperty("/length",d);t.setProperty("/request",h);t.setProperty("/edits",n);sap.m.MessageToast.show("Your Request has been sent");this.byId("helloDialog2").close()}},onCloseDialog:function(){this.byId("eMbl").setValueState(sap.ui.core.ValueState.None);this.byId("eAdr").setValueState(sap.ui.core.ValueState.None);this.byId("eMbl").setValue("");this.byId("eAdr").setValue("");this.byId("helloDialog2").close()},onItemClose:function(e){sap.m.MessageToast.show(e.getSource().getTitle()+"Item Closed ")},pDialog:null,onChangePwd:function(){var e=this.getView();if(!this.pDialog){this.pDialog=sap.ui.xmlfragment(e.getId(),"emp.EmpReg.fragments.PasswordChange",this);e.addDependent(this.pDialog)}this.pDialog.open()},onUpdatePwd:function(){var e=this.getView();var t=this.getView().getModel();var a=this.byId("linkID").getText();var s=this.byId("newPwd").getValue();var o=/^(?=.*\d)[a-zA-Z0-9]{5,10}$/;var i=t.getProperty("/Employees");for(var r=0;r<i.length;r++){if(s===""){this.byId("newPwd").setValueState(sap.ui.core.ValueState.Error);sap.m.MessageToast.show("Please Enter the Password");break}else{this.byId("newPwd").setValueState(sap.ui.core.ValueState.None)}if(!s.match(o)){this.byId("newPwd").setValueState(sap.ui.core.ValueState.Error);sap.m.MessageToast.show("Password should be Alpha-Numeric 5-10 characters");break}else{this.byId("newPwd").setValueState(sap.ui.core.ValueState.None)}if(a===i[r].empId){i[r].password=s;sap.m.MessageToast.show("Your Password has been Updated");this.byId("newPwd").setValueState(sap.ui.core.ValueState.None);this.byId("newPwd").setValue("");this.byId("pwDialog").close();break}}},onClosePDialog:function(){this.byId("newPwd").setValue("");this.byId("pwDialog").close()},onPrsNoti:function(){var e=this.getView();this.byId("idPN").getTitle();this.byId("idPN").setTitle("");this.byId("oPop2").close()}})});