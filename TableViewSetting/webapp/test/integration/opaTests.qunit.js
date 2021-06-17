/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"tvs/TableViewSetting/test/integration/AllJourneys"
	], function () {
		QUnit.start();
	});
});