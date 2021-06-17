/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"VHD/ValueHelp_Test/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});