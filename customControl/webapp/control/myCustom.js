sap.ui.define([], function(){
	
return sap.ui.core.Control.extend("customControl.customControl.control.myCustom",{
	metadata: {
		properties:{
			"text":"",
			"color":"",
			"border":""
		},
		events:{}
	},
	init: function(){},
	renderer: function(oRm, oControl){
		oRm.write("<h1 style='color:" + oControl.getColor() + ";border:" + oControl.getBorder() + "'>" + oControl.getText() +"</h1>");
	}
	
});
	
});