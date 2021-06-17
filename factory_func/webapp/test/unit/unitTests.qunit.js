/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"fun/factory_func/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});