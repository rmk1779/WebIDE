sap.ui.define([
		"i2d/ps/projectbillingrequests1/ext/controller/ObjectPageExt.controller",
		"sap/ui/model/resource/ResourceModel",
		"sap/ui/core/format/NumberFormat",
		"sap/ui/thirdparty/sinon",
		"sap/ui/thirdparty/sinon-qunit"
	],
	function (ObjectPageExtController, ResourceModel) {
		"use strict";

		QUnit.module("Formatting functions", {
			beforeEach: function () {
				this.ObjectPageExt = new sap.ui.controller("i2d.ps.projectbillingrequests1.ext.controller.ObjectPageExt");

				this._oResourceModel = new ResourceModel({
					bundleUrl: jQuery.sap.getModulePath("i2d.ps.projectbillingrequests1", "/i18n/i18n.properties")
				});
				this._oNewResourceModel = new ResourceModel({
					bundleUrl: jQuery.sap.getModulePath("i2d.ps.projectbillingrequests1",
						"/i18n/ListReport/C_ProjectBillingRequestTP/i18n.properties")
				});

			},
			afterEach: function () {
				this._oResourceModel.destroy();
				this._oNewResourceModel.destroy();
				assert.notEqual(this.ObjectPageExt, undefined, "App Controller Loads successfully");
			}
		});

		QUnit.test("Testing fnGetFormattedRates function", function (assert) {
			var done = assert.async();
			var oFormatterStub = sinon.stub();
			// System under test
			var fnGetFormattedRates = this.ObjectPageExt.fnGetFormattedRates.bind(oFormatterStub);

			// Assert
			setTimeout(function () {

				assert.strictEqual(fnGetFormattedRates("1000", "EUR", 10), "1,000.00 EUR",
					"Tested the positive function case to determine the sales and cost rate");
				assert.strictEqual(fnGetFormattedRates("1000.02", "EUR", 10), "1,000.02 EUR",
					"Tested the positive function case to determine the sales and cost rate");
				assert.strictEqual(fnGetFormattedRates("1000", "EUR", 0), " ",
					"Tested the negative function case to determine the sales and cost rate");
				assert.strictEqual(fnGetFormattedRates(" ", "EUR", 10), " ",
					"Tested the negative function case to determine the sales and cost rate");
				done();
			});
		});

		/*QUnit.test("Testing fnGetFormattedSalesDocument function", function (assert) {
			var done = assert.async();
			var oFormatterStub = sinon.stub();
			// System under test
			var fnGetFormattedSalesDocument = this.ObjectPageExt.fnGetFormattedSalesDocument.bind(oFormatterStub);

			// Assert
			setTimeout(function () {

				assert.strictEqual(fnGetFormattedSalesDocument("SalesDocument", "Item"), "SalesDocument/Item",
					"Tested fnGetFormattedSalesDocument return object");

				done();
			});
		});

		QUnit.test("Testing fnGetFormattedJournalEntry function", function (assert) {
			var done = assert.async();
			var oFormatterStub = sinon.stub();
			// System under test
			var fnGetFormattedJournalEntry = this.ObjectPageExt.fnGetFormattedJournalEntry.bind(oFormatterStub);

			// Assert
			setTimeout(function () {

				assert.strictEqual(fnGetFormattedJournalEntry("AccountingDoc", "Item", "FiscalYear"), "AccountingDoc/Item/FiscalYear",
					"Tested fnGetFormattedJournalEntry return object");

				done();
			});
		});

		QUnit.test("Testing fnGetPrepaymentType function", function (assert) {
			var done = assert.async();
			var oFormatterStub = sinon.stub();
			// System under test
			var fnGetPrepaymentType = this.ObjectPageExt.fnGetPrepaymentType.bind(oFormatterStub);

			// Assert
			setTimeout(function () {

				assert.strictEqual(fnGetPrepaymentType("A002"), "On Account",
					"Tested the positive function case to determine the prepayment type");
				assert.strictEqual(fnGetPrepaymentType("Some Random Material"), "",
					"Tested the negative function case to determine the prepayment type");

				done();
			});
		});*/

		QUnit.test("FXUBLR05-2532-AC1: Testing fnGetToBeSettledAmount function", function (assert) {
			var done = assert.async();
			var oFormatterStub = sinon.stub();
			// System under test
			var fnGetToBeSettledAmount = this.ObjectPageExt.fnGetToBeSettledAmount.bind(oFormatterStub);

			// Assert
			setTimeout(function () {

				assert.strictEqual(fnGetToBeSettledAmount("1000.00", "EUR"), "1000.00 EUR",
					"Tested the positive function case");
				assert.strictEqual(fnGetToBeSettledAmount(null, "EUR"), " ",
					"Tested the negative function case");

				done();
			});
		});

		QUnit.test("FXUBLR05-2532-AC1: Testing fnGetReceivedPaymentAmount function", function (assert) {
			var done = assert.async();
			var oFormatterStub = sinon.stub();
			// System under test
			var fnGetReceivedPaymentAmount = this.ObjectPageExt.fnGetReceivedPaymentAmount.bind(oFormatterStub);

			// Assert
			setTimeout(function () {

				assert.strictEqual(fnGetReceivedPaymentAmount("1000.00", "EUR"), "1000.00 EUR",
					"Tested the positive function case");
				assert.strictEqual(fnGetReceivedPaymentAmount(null, "EUR"), " ",
					"Tested the negative function case");

				done();
			});
		});

		////////////////////////////////////////////////////////////////////////////////////////
		///////////////////// TEST COMMMENTED WHEN TE EDIT FUNCTION ARE COMMENTED //////////////
		////////////////////////////////////////////////////////////////////////////////////////	
		/*QUnit.test("Testing fnCheckRowCostValidation function", function (assert) {
			var done = assert.async();
			var oFormatterStub = sinon.stub();
			// System under test
			var getfnCheckRowCostValidation = this.ObjectPageExt.fnCheckRowCostValidation.bind(oFormatterStub);
			var oRowObject = 10;
			// Assert
			setTimeout(function () {

				assert.strictEqual(getfnCheckRowCostValidation(oRowObject), true, "Equality Check for Cost Complete.");
				done();
			});
		});
				
		QUnit.test("Testing fnCheckRowCostValidation function", function (assert) {
			var done = assert.async();
			var oFormatterStub = sinon.stub();
			// System under test
			var getfnCheckRowCostValidation = this.ObjectPageExt.fnCheckRowCostValidation.bind(oFormatterStub);
			var oRowObject = -10;
			// Assert
			setTimeout(function () {

				assert.strictEqual(getfnCheckRowCostValidation(oRowObject), false, "Inequality check for Cost complete.");
				done();
			});
		});

		QUnit.test("Testing fnCheckRowQtyValidation function", function (assert) {
			var done = assert.async();
			var oFormatterStub = sinon.stub();
			// System under test
			var getfnCheckRowQtyValidation = this.ObjectPageExt.fnCheckRowQtyValidation.bind(oFormatterStub);
			var oRowObject = 10;
			// Assert
			setTimeout(function () {

				assert.strictEqual(getfnCheckRowQtyValidation(oRowObject), true, "Equality check for Quantity Complete.");
				done();
			});
		});

		QUnit.test("Testing fnCheckRowQtyValidation function", function (assert) {
			var done = assert.async();
			var oFormatterStub = sinon.stub();
			// System under test
			var getfnCheckRowQtyValidation = this.ObjectPageExt.fnCheckRowQtyValidation.bind(oFormatterStub);
			var oRowObject = -10;
			// Assert
			setTimeout(function () {

				assert.strictEqual(getfnCheckRowQtyValidation(oRowObject), false, "Inequality Check for Quantity complete.");
				done();
			});
		});*/

		////////////////////////////////////////////////////////////////////////////////////////
		///////////////////// UNCOMMMENT THIS ABOVE SECTION WHEN TE TABLE HAS UI EDIT FUNCTIONS ON  //////////////
		////////////////////////////////////////////////////////////////////////////////////////	

	});