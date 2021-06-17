/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"tbl/Table_task/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});