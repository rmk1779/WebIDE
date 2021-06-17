sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel"
], function (Controller, JSONModel) {
	"use strict";

	return Controller.extend("tt.TreeTable.controller.View1", {

		
		onInit: function () {
			var oModel = this.getView().getModel();
			this.getView().setModel(oModel);
		},

	onCollapseAll: function() {
			var oTreeTable = this.byId("TreeTableBasic");
			oTreeTable.collapseAll();
		},

		onCollapseSelection: function() {
			var oTreeTable = this.byId("TreeTableBasic");
			oTreeTable.collapse(oTreeTable.getSelectedIndices());
		},

		onExpandFirstLevel: function() {
			var oTreeTable = this.byId("TreeTableBasic");
			oTreeTable.expandToLevel(1);
		},

		onExpandSelection: function(oEvent) {
			var oView = this.getView();
		var	oMdl = this.getView().getModel();
		
		
			var oTreeTable = this.byId("TreeTableBasic");
			oTreeTable.expand(oTreeTable.getSelectedIndices());
		},
		
		rowSC: function(oEvent){
			
		var oView = this.getView();
		var	oMdl = this.getView().getModel();
		
		var oTreeTable = this.byId("TreeTableBasic");
		oTreeTable.expand(oTreeTable.getSelectedIndices());
		
		}

	});

});