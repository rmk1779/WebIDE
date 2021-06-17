sap.ui.define([
		"i2d/ps/projbillingelements1/ext/model/formatter",
		"sap/ui/model/resource/ResourceModel",
		"sap/ui/core/format/NumberFormat",
		"sap/ui/thirdparty/sinon",
		"sap/ui/thirdparty/sinon-qunit"
	],
	function (ListReportExtController, ResourceModel) {
		"use strict";

		QUnit.module("Formatting functions", {
			beforeEach: function () {
				this._oResourceModel = new ResourceModel({
					bundleUrl: jQuery.sap.getModulePath("i2d.ps.projbillingelements1",
						"/i18n/i18n.properties")
				});
				this._oNewResourceModel = new ResourceModel({
					bundleUrl: jQuery.sap.getModulePath("i2d.ps.projbillingelements1",
						"/i18n/ListReport/C_ProjectBillingElementTP/i18n.properties")
				});

			},
			afterEach: function () {
				this._oResourceModel.destroy();
				this._oNewResourceModel.destroy();
			}
		});

		QUnit.test("FXUBLRAGILEPILOT-71-AC1 : Testing Due Billing date", function (assert) {
			var done = assert.async();
			var oFormatterStub = sinon.stub();
			// System under test
			var getfnGetDueBillingDateStatus = ListReportExtController.fnGetDueBillingDateStatus.bind(oFormatterStub);
			var ndate = new Date("2021/09/21");
			var pdate = new Date("2012/09/21");
			var udate = new Date("0000/00/00");
			// Assert
			setTimeout(function () {

				assert.strictEqual(getfnGetDueBillingDateStatus(ndate), "Information", "Test passed for later Due Billing date");
				assert.strictEqual(getfnGetDueBillingDateStatus(pdate), "Error", "Test passed for previous Due Billing date");
				assert.strictEqual(getfnGetDueBillingDateStatus(udate), "Error", "Test passed for undefined Due Billing date");
				done();
			});
		});

		QUnit.test("FXUBLRAGILEPILOT-71-AC1 : Testing Billing Plan Billing date column of Due Billing Date dialog", function (assert) {
			var done = assert.async();
			var oFormatterStub = sinon.stub();
			// System under test
			var getfnGetBillingPlanBillingDateStatus = ListReportExtController.fnGetBillingPlanBillingDateStatus.bind(oFormatterStub);
			var ndate = new Date("2021/09/21");
			var pdate = new Date("2012/09/21");
			var udate = new Date("0000/00/00");
			// Assert
			setTimeout(function () {

				assert.strictEqual(getfnGetBillingPlanBillingDateStatus(ndate), "None", "Test passed for later Due Billing date");
				assert.strictEqual(getfnGetBillingPlanBillingDateStatus(pdate), "Error", "Test passed for previous Due Billing date");
				assert.strictEqual(getfnGetBillingPlanBillingDateStatus(udate), "Error", "Test passed for undefined Due Billing date");
				done();
			});
		});

		QUnit.test("Testing Draft Bill Visibility", function (assert) {
			var done = assert.async();
			var oFormatterStub = sinon.stub();
			// System under test
			var getfnGetDraftBillVisibility = ListReportExtController.fnGetDraftBillVisibility.bind(oFormatterStub);
			// Assert
			setTimeout(function () {

				assert.strictEqual(getfnGetDraftBillVisibility("1", "1000000359"), false,
					"Checked visibility when BillingPlanUsageCategory is 1 (FP) and ProjectBillingRequest doesn't start with 'S'");
				assert.strictEqual(getfnGetDraftBillVisibility("2", "1000000359"), false,
					"Checked visibility when BillingPlanUsageCategory is 2 (TE) and ProjectBillingRequest doesn't start with 'S'");
				assert.strictEqual(getfnGetDraftBillVisibility("1", "S000000054"), true,
					"Checked visibility when BillingPlanUsageCategory is 1 (FP) and ProjectBillingRequest starts with 'S'");
				assert.strictEqual(getfnGetDraftBillVisibility("2", "S000000054"), true,
					"Checked visibility when BillingPlanUsageCategory is 2 (TE) and ProjectBillingRequest starts with 'S'");
				assert.strictEqual(getfnGetDraftBillVisibility("2", null), true,
					"Checked visibility when BillingPlanUsageCategory is 2 (TE) and ProjectBillingRequest is null");
				assert.strictEqual(getfnGetDraftBillVisibility("1", null), true,
					"Checked visibility when BillingPlanUsageCategory is 1 (FP) and ProjectBillingRequest is null");
				assert.strictEqual(getfnGetDraftBillVisibility("2", undefined), true,
					"Checked visibility when BillingPlanUsageCategory is 2 (TE) and ProjectBillingRequest is undefined");
				assert.strictEqual(getfnGetDraftBillVisibility("1", undefined), true,
					"Checked visibility when BillingPlanUsageCategory is 1 (FP) and ProjectBillingRequest is undefined");
				done();
			});
		});

		QUnit.test("FXUBLRAGILEPILOT-70-AC1 : Testing State formatting functions for Billed revenue", function (assert) {
			var done = assert.async();
			var oFormatterStub = sinon.stub();
			// System under test
			var getfnGetNetBilledRevStatus = ListReportExtController.fnGetNetBilledRevStatus.bind(oFormatterStub);
			// Assert
			setTimeout(function () {

				assert.strictEqual(getfnGetNetBilledRevStatus("11001", "0", "10000"), "Error",
					"Checked status when Billed revenue is greater than capital.");
				assert.strictEqual(getfnGetNetBilledRevStatus("5001", " 0", "10000"), "Information",
					"Checked status when Billed revenue is less than capital.");
				assert.strictEqual(getfnGetNetBilledRevStatus("10000", " 0", "10000"), "Information",
					"Checked status when Billed revenue is equal to capital.");
				assert.strictEqual(getfnGetNetBilledRevStatus("11001", "9000", "0"), "Error",
					"Checked status when Billed revenue is greater than planned revenue.");
				assert.strictEqual(getfnGetNetBilledRevStatus("5001", "9000", "0"), "Information",
					"Checked status when Billed revenue is less than planned revenue.");
				assert.strictEqual(getfnGetNetBilledRevStatus("10000", "10000", "0"), "Information",
					"Checked status when Billed revenue is equal to planned revenue.");
				assert.strictEqual(getfnGetNetBilledRevStatus("9000", "0", "0"), "Information",
					"Checked status when planned revenue and capital are not given.");
				assert.strictEqual(getfnGetNetBilledRevStatus("9000", "10000", "11000"), "Information",
					"Checked status when both planned revenue and capital are given and Billed is less than capital.");
				assert.strictEqual(getfnGetNetBilledRevStatus("9000", "10000", "8000"), "Error",
					"Checked status when both planned revenue and capital are given and Billed is greater than capital.");
				assert.strictEqual(getfnGetNetBilledRevStatus("9000", "10000", "9000"), "Information",
					"Checked status when both planned revenue and capital are given and Billed is equal to capital.");
				assert.strictEqual(getfnGetNetBilledRevStatus("9000", undefined, undefined), "Information",
					"Checked status when planned revenue and capital are undefined.");
				assert.strictEqual(getfnGetNetBilledRevStatus("9000", "0", undefined), "Information",
					"Checked status when capital is undefined.");
				done();
			});
		});

		QUnit.test("FXUBLR05-2230-AC1 : Testing State formatting functions for Estimated Actuals", function (assert) {
			var done = assert.async();
			var oFormatterStub = sinon.stub();
			// System under test
			var getfnGetEstActualStatus = ListReportExtController.fnGetEstActualStatus.bind(oFormatterStub);
			// Assert
			setTimeout(function () {

				assert.strictEqual(getfnGetEstActualStatus("11001", "0", "10000"), "Warning",
					"Checked status when Estmated Actuals is greater than capital.");
				assert.strictEqual(getfnGetEstActualStatus("5001", " 0", "10000"), "None",
					"Checked status when Estmated Actuals is less than capital.");
				assert.strictEqual(getfnGetEstActualStatus("10000", " 0", "10000"), "None",
					"Checked status when Estmated Actuals is equal to capital.");
				assert.strictEqual(getfnGetEstActualStatus("10000", " 10000", "0"), "None",
					"Checked status when Estmated Actuals is equal to planned revenue.");
				assert.strictEqual(getfnGetEstActualStatus("11001", "9000", "0"), "Warning",
					"Checked status when Estmated Actuals is greater than planned revenue.");
				assert.strictEqual(getfnGetEstActualStatus("5001", "9000", "0"), "None",
					"Checked status when Estmated Actuals is less than planned revenue.");
				assert.strictEqual(getfnGetEstActualStatus("9000", "0", "0"), "None",
					"Checked status when planned revenue and capital are not given.");
				assert.strictEqual(getfnGetEstActualStatus("9000", "10000", "10000"), "None",
					"Checked status when planned revenue and capital are given and estimated actuals is less than capital.");
				assert.strictEqual(getfnGetEstActualStatus("9000", "10000", "8000"), "Warning",
					"Checked status when planned revenue and capital are given and estimated actuals is greater than capital.");
				assert.strictEqual(getfnGetEstActualStatus("9000", "10000", "9000"), "None",
					"Checked status when planned revenue and capital are given and estimated actuals is equal to capital.");
				assert.strictEqual(getfnGetEstActualStatus("9000", "0", undefined), "None",
					"Checked status when capital is undefined.");
				assert.strictEqual(getfnGetEstActualStatus("9000", undefined, undefined), "None",
					"Checked status when planned revenue and capital are undefined.");
				done();
			});
		});

		QUnit.test("Testing Active formatting functions for Estimated Actuals", function (assert) {
			var done = assert.async();
			var oFormatterStub = sinon.stub();
			// System under test
			var getfnGetEstActualActive = ListReportExtController.fnGetEstActualActive.bind(oFormatterStub);
			// Assert
			setTimeout(function () {

				assert.strictEqual(getfnGetEstActualActive("11001", "1000", "0"), true,
					"Testesd for active function when Estmated Actuals is greater than planned revenue.");
				assert.strictEqual(getfnGetEstActualActive("5001", " 7001", " 0"), false,
					"Testesd for active function when Estmated Actuals is not greater than planned revenue.");
				assert.strictEqual(getfnGetEstActualActive("6000", "0", "6000"), false,
					"Testesd for active function when Estimated Actuals is equal to capital.");
				assert.strictEqual(getfnGetEstActualActive("6000", "6000", "0"), false,
					"Testesd for active function when Estimated Actuals is equal to planned revenue.");
				assert.strictEqual(getfnGetEstActualActive("6001", "0", "4000"), true,
					"Testesd for active function when Estimated Actuals is greater than capital.");
				assert.strictEqual(getfnGetEstActualActive("8000", "0", " 10000"), false,
					"Testesd for active function when Estimated Actuals is not greater than capital.");
				assert.strictEqual(getfnGetEstActualActive("4001", " 0", "0"), false,
					"Testesd for active function when both capital and planned revenue not given.");
				assert.strictEqual(getfnGetEstActualActive("8000", "5000", " 10000"), false,
					"Testesd for active function when both planned revenue and capital are given and Estimated Actuals is less than capital.");
				assert.strictEqual(getfnGetEstActualActive("8000", "5000", " 6000"), true,
					"Testesd for active function when both planned revenue and capital are given and Estimated Actuals is greater than capital.");
				assert.strictEqual(getfnGetEstActualActive("8000", "5000", " 8000"), false,
					"Testesd for active function when both planned revenue and capital are given and Estimated Actuals is equal to capital.");
				assert.strictEqual(getfnGetEstActualActive("4001", "0", undefined), false,
					"Testesd for active function when capital is undefined.");
				assert.strictEqual(getfnGetEstActualActive("4001", undefined, undefined), false,
					"Testesd for active function when both capital and planned revenue are undefined.");
				done();
			});
		});

		QUnit.test("FXUBLR05-2230-AC2 : Testing for text on Estimated Actuals", function (assert) {
			var done = assert.async();
			var oModel = this.stub();
			oModel.withArgs("i18n").returns(this._oResourceModel);
			var oViewStub = {
				getModel: oModel
			};
			var oControllerStub = {
				getView: this.stub().returns(oViewStub)
			};
			var getfnGetEstActualPopText = ListReportExtController.fnGetEstActualPopText.bind(oControllerStub);
			setTimeout(function () {
				assert.strictEqual(getfnGetEstActualPopText("11001", "12000", "0", "10000", "USD"),
					"Billed amount has exceeded the cap of 10000 USD.", "Tested for Estmated Actuals when Billed amount exceeds capital");
				assert.strictEqual(getfnGetEstActualPopText("9001", "11001", "0", "10000", "USD"),
					"Estimated actuals has exceeded the cap of 10000 USD.", "Tested for Estmated Actuals when Estimated Actuals exceeds capital");
				assert.strictEqual(getfnGetEstActualPopText("11001", "12000", "10000", "0", "USD"),
					"Billed amount has exceeded the planned revenue of 10000 USD.",
					"Tested for Estmated Actuals when Billed amount exceeds planned revenue");
				assert.strictEqual(getfnGetEstActualPopText("9001", "11001", "10000", "0", "USD"),
					"Estimated actuals has exceeded the planned revenue of 10000 USD.",
					"Tested for Estmated Actuals when Estmated Actuals exceeds planned revenue");
				assert.strictEqual(getfnGetEstActualPopText("9001", "11001", "10000", "0", undefined),
					"Estimated actuals has exceeded the planned revenue of 10000 .",
					"Tested for Estmated Actuals when Estmated Actuals exceeds planned revenue and Document Currency is undefined");
				assert.strictEqual(getfnGetEstActualPopText("11001", "12000", "12500", "10000", "USD"),
					"Billed amount has exceeded the cap of 10000 USD.",
					"Tested for Estmated Actuals when both planned revenue and capital are given and Billed amount exceeds capital");
				assert.strictEqual(getfnGetEstActualPopText("9001", "12000", "12500", "10000", "USD"),
					"Estimated actuals has exceeded the cap of 10000 USD.",
					"Tested for Estmated Actuals when both planned revenue and capital are given and Estimated Actuals exceeds capital");
				done();

			});

		});

		QUnit.test("FXUBLRAGILEPILOT-72-AC1 : Testing for formatted cost", function (assert) {
			var done = assert.async();
			var oModel = this.stub();
			oModel.withArgs("i18n").returns(this._oNewResourceModel);
			var oViewStub = {
				getModel: oModel
			};
			var oControllerStub = {
				getView: this.stub().returns(oViewStub)
			};
			var getfnGetFormattedCost = ListReportExtController.fnGetFormattedCost.bind(oControllerStub);
			setTimeout(function () {
				assert.strictEqual(getfnGetFormattedCost("11001", "EUR"), "11,001.00 EUR", "Test passed for formatted cost ");
				assert.strictEqual(getfnGetFormattedCost("5001"), "5,001.00", "Test passed for cost when currency not given");
				assert.strictEqual(getfnGetFormattedCost("5001", null), "5,001.00", "Test passed for cost when currency is null");
				assert.strictEqual(getfnGetFormattedCost("5001", undefined), "5,001.00", "Test passed for cost when currency is undefined");
				assert.strictEqual(getfnGetFormattedCost("0", "EUR"), "0.00 EUR", "Test passed for cost when amount is 0");
				done();

			});
		});

		QUnit.test("FXUBLRAGILEPILOT-2009-AC2 : Testing for On Account Button visibilty", function (assert) {
			var done = assert.async();
			var oModel = this.stub();
			oModel.withArgs("i18n").returns(this._oNewResourceModel);
			var oViewStub = {
				getModel: oModel
			};
			var oControllerStub = {
				getView: this.stub().returns(oViewStub)
			};
			var fnGetIsOnAccount = ListReportExtController.fnGetIsOnAccount.bind(oControllerStub);
			setTimeout(function () {
				assert.strictEqual(fnGetIsOnAccount("1", "10.23"), true, "Test passed On Account visibilty");
				assert.strictEqual(fnGetIsOnAccount("1", "0"), false, "Test passed On Account invisibilty");
				assert.strictEqual(fnGetIsOnAccount("5", "0"), false, "Test passed On Account invisibilty");
				assert.strictEqual(fnGetIsOnAccount("5.5", "5"), false, "Test passed On Account invisibilty");
				assert.strictEqual(fnGetIsOnAccount("1"), true, "Test passed On Account visibilty");
				assert.strictEqual(fnGetIsOnAccount("0"), false, "Test passed On Account invisibilty");
				assert.strictEqual(fnGetIsOnAccount("10"), false, "Test passed On Account invisibilty");
				done();

			});

		});

		QUnit.test("FXUBLRAGILEPILOT-2009-AC2 : Testing for Prepayment Icon visibilty", function (assert) {
			var done = assert.async();
			var oModel = this.stub();
			oModel.withArgs("i18n").returns(this._oNewResourceModel);
			var oViewStub = {
				getModel: oModel
			};
			var oControllerStub = {
				getView: this.stub().returns(oViewStub)
			};
			var fnGetIsPlannedPrepayment = ListReportExtController.fnGetIsPlannedPrepayment.bind(oControllerStub);
			setTimeout(function () {
				assert.strictEqual(fnGetIsPlannedPrepayment("10.23"), true, "Test passed Prepayment visibilty");
				assert.strictEqual(fnGetIsPlannedPrepayment("0.00"), false, "Test passed Prepayment invisibilty");
				assert.strictEqual(fnGetIsPlannedPrepayment("10"), true, "Test passed Prepayment visibilty");
				assert.strictEqual(fnGetIsPlannedPrepayment("0"), false, "Test passed Prepayment invisibilty");
				done();

			});
		});

	});