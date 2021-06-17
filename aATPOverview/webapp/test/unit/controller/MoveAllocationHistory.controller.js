/*global QUnit*/

sap.ui.define([
	"com/samsung/aATPOverview/controller/MoveAllocationHistory.controller"
], function (Controller) {
	"use strict";

	QUnit.module("MoveAllocationHistory Controller");

	QUnit.test("I should test the MoveAllocationHistory controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});