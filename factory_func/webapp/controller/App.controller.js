sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/ObjectListItem",
	"sap/m/StandardListItem",
	"sap/m/NotificationListItem",
	"sap/m/DisplayListItem",
	"sap/m/CustomListItem",
	"sap/m/MessageToast"
], function (Controller, ObjectListItem, StandardListItem, NotificationListItem, DisplayListItem, CustomListItem, MessageToast) {
	"use strict";

	return Controller.extend("fun.factory_func.controller.App", {
		onInit: function () {

		},

		createContent: function (sId, oContext) {

			var eStatus = oContext.getProperty("empStatus");
			
			// var btn = new sap.m.Button( {
			// 	text:"Print"
			// });

			if (eStatus === "NOT Working") {

				return new StandardListItem(sId, {
					title: {
						path: "empName",
						type: new sap.ui.model.type.String()
					}
				});
			} else if (eStatus === "working") {

				return new CustomListItem(sId, {
					content:[
						
						new sap.m.Text(
							{
								text:"{empName}"
							}),
						new sap.m.Button({
						text:"Press",
						press:[this.onPress]
						}).addStyleClass("btnClass")
						
						]
				}).addStyleClass("sapMObjLItem");
			}  

		},
		
		onPress: function(oEvent){
		
		MessageToast.show("Print sucessful");	
			
		}
		
		// onAfterRendering: function(){
			// var that = this;
			// var lst = document.getElementsByClassName("addBtn");
			
			// for(var i = 0; i < lst.length; i++){
			// 	var bt = document.createElement("Button");
			// 	bt.innerHTML = "Print";
			// bt.setAttribute("class", "sapMBtnInner sapMBtnHoverable sapMBtnText sapMBtnDefault");
			// 	// bt.setAttribute("class", "sapMBtnDefault");
			// 		bt.addEventListener("click", that.myFunc);
			// 	lst[i].appendChild(bt);	
			// }
		
		// }
		// myFunc: function(oEvent){
		// 	// sap.m.MessageToast().show("Printing the Employee Profile");
		// 	// MessageToast("hi");
		// 	alert("Printing the Employee Profile");
		// }
	});
});