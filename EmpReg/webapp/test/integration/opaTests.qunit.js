/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"emp/EmpReg/test/integration/AllJourneys"
	], function () {
		QUnit.start();
	});
});