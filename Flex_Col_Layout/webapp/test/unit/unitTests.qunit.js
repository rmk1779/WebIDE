/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"FCL/Flex_Col_Layout/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});