sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
	"com/samsung/aATPOverview/model/models",
	"com/sap/atp/reuselib/componentInit"
], function (UIComponent, Device, models, componentInit) {
	"use strict";

	return UIComponent.extend("com.samsung.aATPOverview.Component", {

		metadata: {
			manifest: "json"
		},

		/**
		 * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
		 * @public
		 * @override
		 */
		init: function () {
			// call the base component's init function
			UIComponent.prototype.init.apply(this, arguments);
			componentInit.init(this);

			// enable routing
			this.getRouter().initialize();

			// set the device model
			this.setModel(models.createDeviceModel(), "device");
			this.setChartWiseDataObject();
			//call function import
			//this._callFunctionOfCurrentWeek();
		},
		setChartWiseDataObject: function(){
			var oATPOVerviewModel = this.getModel("ATPOverviewModel");
			oATPOVerviewModel.setData({"moveAllocationHistory":{},"allocationAndConsumption":{}});
		}
	});
});