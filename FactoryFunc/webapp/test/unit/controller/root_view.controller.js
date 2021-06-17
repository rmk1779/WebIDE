/*global QUnit*/

sap.ui.define([
	"factr/FactoryFunc/controller/root_view.controller"
], function (Controller) {
	"use strict";

	QUnit.module("root_view Controller");

	QUnit.test("I should test the root_view controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});