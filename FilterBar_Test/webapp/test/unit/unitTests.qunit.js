/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"FB/FilterBar_Test/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});