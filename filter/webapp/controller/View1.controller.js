sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
], function (Controller, Filter, FilterOperator) {
	"use strict";

	return Controller.extend("filter.filter.controller.View1", {
		onInit: function () {
			var newArray = this.getOwnerComponent().getModel("data").setProperty("/newFilterValues", []);

		},
		onAfterRendering: function () {

			var HelpDetailsLength = this.getOwnerComponent().getModel("data").getData().HelpDetails.length;

			var myNewArray = this.getOwnerComponent().getModel("data").getProperty("/newFilterValues");
			for (var i = 0; i < HelpDetailsLength; i++) {
				var textAndLink = this.getOwnerComponent().getModel("data").getData().HelpDetails[i].textAndLink.length;
				for (var j = 0; j < textAndLink; j++) {
					var Text = this.getOwnerComponent().getModel("data").getData().HelpDetails[i].textAndLink[j].text;
					myNewArray.push(Text);
				}

			}

		},
		onSearchStart: function (event) {
			debugger;
			var olist = this.getView().byId("idVbox"),
				nestArr = [],
				binding,
				nestedFilters;
			nestedFilters = new Filter({
				filters: [ new Filter("text", FilterOperator.Contains, event.getSource().getValue()) ],
				and: false
			});

			nestArr.push(nestedFilters);
			
			olist.getAggregation("items").forEach(item => {

				item.getContent()[0].getBinding("items").filter(nestArr);
				
				// console.log(item.getContent()[0].getBinding("items").iLength);
				// console.log(item.getContent()[0].getBinding("items").aFilters.length);
				
				if(item.getContent()[0].getBinding("items").iLength == 0 && event.getSource().getValue() != "" ){
					item.setVisible(false);
				
				}else{
					item.setVisible(true);
					item.setExpanded(true);
				}
				
				if(event.getSource().getValue() == ""){
					
						item.setExpanded(false);
				}
			
			});
			
		}
	});
});