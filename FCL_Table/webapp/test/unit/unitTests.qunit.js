/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"fcl/FCL_Table/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});