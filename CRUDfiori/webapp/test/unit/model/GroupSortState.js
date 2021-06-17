sap.ui.define([
	"cf/CRUDfiori/model/GroupSortState",
	"sap/ui/model/json/JSONModel",
	"sap/ui/thirdparty/sinon",
	"sap/ui/thirdparty/sinon-qunit"
], function (GroupSortState, JSONModel) {
	"use strict";

	QUnit.module("GroupSortState - grouping and sorting", {
		beforeEach: function () {
			this.oModel = new JSONModel({});
			// System under test
			this.oGroupSortState = new GroupSortState(this.oModel, function () {});
		}
	});

	QUnit.test("Should always return a sorter when sorting", function (assert) {
		// Act + Assert
		assert.strictEqual(this.oGroupSortState.sort("UnitPrice").length, 1, "The sorting by UnitPrice returned a sorter");
		assert.strictEqual(this.oGroupSortState.sort("ProductName").length, 1, "The sorting by ProductName returned a sorter");
	});

	QUnit.test("Should return a grouper when grouping", function (assert) {
		// Act + Assert
		assert.strictEqual(this.oGroupSortState.group("UnitPrice").length, 1, "The group by UnitPrice returned a sorter");
		assert.strictEqual(this.oGroupSortState.group("None").length, 0, "The sorting by None returned no sorter");
	});

	QUnit.test("Should set the sorting to UnitPrice if the user groupes by UnitPrice", function (assert) {
		// Act + Assert
		this.oGroupSortState.group("UnitPrice");
		assert.strictEqual(this.oModel.getProperty("/sortBy"), "UnitPrice", "The sorting is the same as the grouping");
	});

	QUnit.test("Should set the grouping to None if the user sorts by ProductName and there was a grouping before", function (assert) {
		// Arrange
		this.oModel.setProperty("/groupBy", "UnitPrice");

		this.oGroupSortState.sort("ProductName");

		// Assert
		assert.strictEqual(this.oModel.getProperty("/groupBy"), "None", "The grouping got reset");
	});
});