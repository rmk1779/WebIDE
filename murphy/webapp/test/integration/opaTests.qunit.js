/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"mrp/murphy/test/integration/AllJourneys"
	], function () {
		QUnit.start();
	});
});