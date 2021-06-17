sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function (Controller) {
	"use strict";

	return Controller.extend("chr.chartsTest.controller.View1", {
		onInit: function () {
			debugger;
			// var ch = sap.viz.ui5.controls.VizFrame.getVizType('line');	
			
var newModel = new sap.ui.model.json.JSONModel();
this.getOwnerComponent().setModel(newModel, "PieData");
		},
		
		onSelectYear: function(oEvent){
			
			var selYear = this.getView().byId("idCombo").getSelectedItem().getText();
			
			var oModel = this.getView().getModel().getProperty("/years");
			
			for(var i=0; i<oModel.length; i++){
				
				if(selYear == oModel[i].year){
				
				this.getOwnerComponent().getModel("PieData").setProperty("/selYearData", oModel[i].data);
				break;
					
				}
				
			}
			
			
		},
		onRadioSelect:function(oEvent){
		var selRd =	this.getView().byId("seriesRadioGroup").getSelectedButton().getText();
		
		if(selRd == "line"){
				this.getView().byId("idVizFrame").setVizType('line');
				this.getView().byId("idFeed1").setUid('valueAxis');
				this.getView().byId("idFeed2").setUid('categoryAxis');	
		}
		else if(selRd == "pie"){
			this.getView().byId("idVizFrame").setVizType('pie');
				this.getView().byId("idFeed1").setUid('size');
				this.getView().byId("idFeed2").setUid('color');
			
		}
		else if(selRd == "bar"){
			this.getView().byId("idVizFrame").setVizType('bar');
				this.getView().byId("idFeed1").setUid('valueAxis');
				this.getView().byId("idFeed2").setUid('categoryAxis');
		}
		}
	});
});