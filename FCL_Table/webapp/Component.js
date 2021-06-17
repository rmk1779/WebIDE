sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
	"fcl/FCL_Table/model/models",
	"sap.f.FlexibleColumnLayoutSemanticHelper"
], function (UIComponent, Device, models, FlexibleColumnLayoutSemanticHelper) {
	"use strict";

	return UIComponent.extend("fcl.FCL_Table.Component", {

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

			// enable routing
			this.getRouter().initialize();

			// set the device model
			this.setModel(models.createDeviceModel(), "device");
		},
		getHelper: function () {
			var oFCL = this.getRootControl().byId("flexibleColumnLayout"),
				oSettings = {
					defaultTwoColumnLayoutType: sap.f.LayoutType.TwoColumnsMidExpanded,
					defaultThreeColumnLayoutType: sap.f.LayoutType.ThreeColumnsMidExpanded,
					initialColumnsCount: 2
				};

			return FlexibleColumnLayoutSemanticHelper.getInstanceFor(oFCL, oSettings);
		}

	});
});