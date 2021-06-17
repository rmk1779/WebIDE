sap.ui.define([
		"i2d/ps/projectbillingrequests1/ext/model/formatter",
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
					bundleUrl: jQuery.sap.getModulePath("i2d.ps.projectbillingrequests1",
						"/i18n/i18n.properties")
				});
					this._oNewResourceModel = new ResourceModel({
					bundleUrl: jQuery.sap.getModulePath("i2d.ps.projectbillingrequests1",
						"/i18n/ListReport/C_ProjectBillingRequestTP/i18n.properties")
				});
				
			},
			afterEach: function () {
				this._oResourceModel.destroy();
				this._oNewResourceModel.destroy();
			}
		});

		QUnit.test("Testing Header Fields Text", function (assert) {
			var done = assert.async();
			var oModel = this.stub();
			oModel.withArgs("i18n").returns(this._oResourceModel);
			var oViewStub = {
				getModel: oModel
			};
			var oControllerStub = {
				getView: this.stub().returns(oViewStub)
			};
			var getfnGetHeaderFieldsText = ListReportExtController.fnGetHeaderFieldsText.bind(oControllerStub);
			setTimeout(function () {
				assert.strictEqual(getfnGetHeaderFieldsText("ProfitCenterName"), "ProfitCenterName", "Test passed for Single-select ProfitCenter");
				assert.strictEqual(getfnGetHeaderFieldsText("WBSElementExternalID"), "WBSElementExternalID", "Test passed for Single-select Billing Element");
				assert.strictEqual(getfnGetHeaderFieldsText("10"), "Multiple", "Test passed for Multi-select ProfitCenter, Billing Element");

				done();

			});
		});
		
		QUnit.test("Testing Billing Method", function (assert) {
			var done = assert.async();
			var oModel = this.stub();
			oModel.withArgs("i18n").returns(this._oResourceModel);
			var oViewStub = {
				getModel: oModel
			};
			var oControllerStub = {
				getView: this.stub().returns(oViewStub)
			};
			var getfnGetBillingMethod = ListReportExtController.fnGetBillingMethod.bind(oControllerStub);
			setTimeout(function () {
				assert.strictEqual(getfnGetBillingMethod("BillingPlanUsageCategoryName 1"), "BillingPlanUsageCategoryName 1", "Test passed for Single-select");
				assert.strictEqual(getfnGetBillingMethod("5"), "Time and Expenses, Fixed Price", "Test passed for combination of TE and FP");
				assert.strictEqual(getfnGetBillingMethod("4"), "Fixed Price", "Test passed for Multiple Fixed Price Items");
				assert.strictEqual(getfnGetBillingMethod("3"), "Time and Expenses", "Test passed for Multiple Time and Expense Items");

				done();

			});
		});
		
		QUnit.test("Testing State formatting functions for Billable Revenue", function (assert) {
			var done = assert.async();
			var oFormatterStub = sinon.stub();
			// System under test
			var getfnGetBillableRevenueStatus = ListReportExtController.fnGetBillableRevenueStatus.bind(oFormatterStub);
			// Assert
			setTimeout(function () {

				assert.strictEqual(getfnGetBillableRevenueStatus("11001", "1000","0", "10000"), "None", "Checked status when Billed value is greater than capital.");
				assert.strictEqual(getfnGetBillableRevenueStatus("5001"," 7001"," 0", "10000"), "Warning", "Checked status when Sum(Billed+Billable) is greater than capital.");
				assert.strictEqual(getfnGetBillableRevenueStatus("4001","5001","0"," 10000"), "None", "Checked status when Sum(Billed+Billable) is not greater than capital.");
				assert.strictEqual(getfnGetBillableRevenueStatus("11000"," 1000"," 10000"," 0"), "None", "Checked status when Billed value is greater than Planned revenue.");
				assert.strictEqual(getfnGetBillableRevenueStatus("11000"," 10000", "20000","0"), "Warning", "Checked status when Sum(Billed+Billable) is greater than Planned revenue.");
				assert.strictEqual(getfnGetBillableRevenueStatus("4001", "5001","10000","0"), "None", "Checked status when Sum(Billed+Billable  is not greater than Planned revenue..");
				assert.strictEqual(getfnGetBillableRevenueStatus("4001"," 5001", "0", "0"), "None", "Checked status when both Planned revenue and capital are not given");
				done();
			});
		});
		
		QUnit.test("Testing for formatted cost", function (assert) {
			var done = assert.async();
			var oModel = this.stub();
			oModel.withArgs("i18n").returns(this._oResourceModel);
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

				done();

			});
		});
		
		QUnit.test("Testing for formatted grouped cost", function (assert) {
			var done = assert.async();
			var oModel = this.stub();
			oModel.withArgs("i18n").returns(this._oResourceModel);
			var oViewStub = {
				getModel: oModel
			};
			var oControllerStub = {
				getView: this.stub().returns(oViewStub)
			};
			var getfnGetFormattedCost = ListReportExtController.fnEnableGrouping.bind(oControllerStub);
			setTimeout(function () {
				assert.strictEqual(getfnGetFormattedCost("11001", "EUR"), "11,001.00", "Test passed for formatted cost ");
				done();

			});
		});
		
	});