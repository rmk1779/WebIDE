sap.ui.define([
	"sap/ui/core/Control",
	"sap/m/RatingIndicator",
	"sap/m/Label",
	"sap/m/Button",
	"sap/m/MessageToast"
], function (Control, RatingIndicator, Label, Button,MessageToast) {
	"use strict";
	return Control.extend("emp.AppTask.control.Rating", {
		metadata: {
		properties:{
                    value:{type:"float", defaultValue:0}
		},
		aggregations : {
				_rating : {type:"sap.m.RatingIndicator", multiple: false, visibility: "hidden"},
				_button : {type:"sap.m.Button", multiple: false, visibility: "hidden"}

		},
		events : {
			valueSubmit : {
				parameters : {
					value : {type : "float"}
				}
			}
			
		}
		
		
		},
		init: function () {
			this.setAggregation("_rating", new RatingIndicator({
				value: this.getValue(),
				maxValue : 5,
				liveChange : this._onRate.bind(this)
			}).addStyleClass("sapUiTinyMarginEnd"));
			
			this.setAggregation("_button", new Button({
				text : "Submit",
				press : this._onSubmit.bind(this),
				enabled : false
			}));
		},
		_onSubmit : function(){
			this.fireEvent("valueSubmit",{
				value : this.getValue()
			});
			this.getAggregation("_button").setEnabled(false);
		},
		
		_onRate : function(oEvent){
			
			this.setValue(oEvent.getParameter("value"));
			this.getAggregation("_button").setEnabled(true);
			
		},
		
	
		renderer: function (oRm, oControl) {
			oRm.write("<div");
			oRm.writeControlData(oControl);
			oRm.addClass("sapUiSmallMarginBeginEnd");
			oRm.writeClasses();
			oRm.write(">");
			
			oRm.renderControl(oControl.getAggregation("_rating"));
			oRm.renderControl(oControl.getAggregation("_button"));
	
			// oRm.write("</br>");
			// oRm.write("<button type='button' onclick='prs' class='btnStyle'>Click me</button>");
			// oRm.write("<script>");
			// oRm.write("function prs(){alert('hhhhhhhhhhhh')}");
			// 	oRm.write("</script>");
			oRm.write("</div>");
			
		}
		
		
	});
});
	