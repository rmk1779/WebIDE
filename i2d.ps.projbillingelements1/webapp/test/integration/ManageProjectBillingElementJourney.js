sap.ui.define([
	"sap/ui/test/opaQunit",
	"sap/ui/test/actions/Press",
	"sap/ui/test/actions/EnterText",
	"sap/suite/ui/generic/template/integration/testLibrary/ListReport/pages/ListReport",
	"sap/suite/ui/generic/template/integration/testLibrary/ObjectPage/pages/ObjectPage"
], function (opaTest) {
	"use strict";

	QUnit.module("moduleName");

	opaTest("Should see default compact filters when the app launches", function (Given, When, Then) {

		//Arrangements
		Given.iStartMyAppInAFrame("../flpSandboxMockServer.html#masterDetail-display");

		//Actions
		When.onMyPageUnderTest.iLookAtTheLoadedApp();

		//Assertions
		Then.onMyPageUnderTest.iShouldSeeListReportTable();
	});

	opaTest("Data should display in the table on click of Go button", function (Given, When, Then) {

		//Actions
		When.onMyPageUnderTest.iClickOnGoButton();

		//Assertions
		Then.onMyPageUnderTest.iShouldSeeDataInTheTable();
	});

	opaTest("Testing Multi-Select CheckBox", function (Given, When, Then) {

		//Actions
		When.onMyPageUnderTest.iClickOnCheckbox();

		//Assertions
		Then.onMyPageUnderTest.iShouldSeePrepareBilling();
	});

	opaTest("Testing a prepare billing Button", function (Given, When, Then) {

		//Actions
		When.onTheGenericListReport.iClickTheButtonHavingLabel("Prepare Billing");

		//Assertions
		Then.onMyPageUnderTest.iFindAMessageBoxWithClose().iClickOnButtonWithText("Close");

	});

	opaTest("Testing SmartLink of Draft Bill", function (Given, When, Then) {

		//Actions
		When.onMyPageUnderTest.iClickonLinkWithValue("SProjectBillingRequest 2");

		//Assertions
		Then.onMyPageUnderTest.iShouldSeeAPopover();
		//Then.onMyPageUnderTest.iShouldSeeADialogWithHeader("Navigation Error").iClickOnButtonWithText("Close");
	});
	opaTest("Testing Project SmartLink", function (Given, When, Then) {

		//Actions
		When.onMyPageUnderTest.iClickonLinkWithValue("CustomerProject 1");

		//Assertions
		Then.onMyPageUnderTest.iShouldSeeAPopover();
	});

	opaTest("Testing Prepayment Icon details", function (Given, When, Then) {

		//Actions
		When.onMyPageUnderTest.iClickOnThePrepaymentIcon();

		//Assertions
		Then.onMyPageUnderTest.iShouldSeeAPopover();
	});

	/*	opaTest("FXUBLRAGILEPILOT-2009-AC3: Testing On AccountDialog Submit when Billing Due Date is in the past", function (Given, When, Then) {

			//Actions
			When.onMyPageUnderTest.iClickOnButtonWithText("On Account");

			//Assertions
			Then.onMyPageUnderTest.iShouldSeeADialogWithHeader("New On Account for WBSElement 1").iClickOnButtonWithText("Submit").iClickOnButtonWithText("Close");
		});*/

	opaTest("FXUBLRAGILEPILOT-2009-AC3: Testing On AccountDialog Submit when Billing Due Date is in the future", function (Given, When, Then) {

		//Actions
		When.onMyPageUnderTest.iClickOnButtonWithTextForOnAccount("On Account");

		//Assertions
		Then.onMyPageUnderTest.iShouldSeeADialogWithHeader("New On Account for WBSElement 2").iClickOnButtonWithText("Submit").iClickOnButtonWithText(
			"Close");
	});

	opaTest("FXUBLRAGILEPILOT-2009-AC3: Testing On AccountDialog Cancel", function (Given, When, Then) {

		//Actions
		When.onMyPageUnderTest.iClickOnButtonWithText("On Account");

		//Assertions
		Then.onMyPageUnderTest.iShouldSeeADialogWithHeader("New On Account for WBSElement 1").iClickOnButtonWithText("Cancel");
	});

	/*opaTest("FXUBLRAGILEPILOT-2009-AC3: Testing On Prepayment dialog Submit when Billing Due Date is in the past", function (Given, When, Then) {

		//Actions
		When.onMyPageUnderTest.iClickTheButtonHavingLabel("Prepayment");

		//Assertions
		Then.onMyPageUnderTest.iShouldSeeADialogWithHeader("New On Account for WBSElement 1").iClickOnButtonWithText("Submit").iClickOnButtonWithText("Close");
	});*/

	opaTest("FXUBLRAGILEPILOT-2009-AC3: Testing Prepayment dialog cancel", function (Given, When, Then) {

		//Actions
		When.onTheGenericListReport.iClickTheButtonHavingLabel("Prepayment");

		//Assertions
		Then.onMyPageUnderTest.iShouldSeeADialogWithHeader("New On Account for WBSElement 1").iClickOnButtonWithText("Cancel");
	});

	opaTest("Testing Estimated Actuals Popover", function (Given, When, Then) {

		//Actions
		When.onMyPageUnderTest.iClickonObjectStatusWithValue("9,692.81 DocumentCurrency 3");

		//Assertions
		Then.onMyPageUnderTest.iShouldSeeAPopover();
	});

	opaTest("Testing Net Billable Revenue Dialog", function (Given, When, Then) {

		//Actions
		When.onMyPageUnderTest.iClickonObjectStatusWithValue("5,818.42 DocumentCurrency 1");

		//Assertions
		Then.onMyPageUnderTest.iShouldSeeADialogWithHeader("Related Invoices (WBSElement 1)").iClickOnButtonWithText("Close");
	});

	opaTest("Testing Billing Due Date dialog Edit Billing Plan button", function (Given, When, Then) {

		//Actions
		When.onMyPageUnderTest.iClickonObjectStatusWithValue("Apr 29, 2007");

		//Assertions
		Then.onMyPageUnderTest.iShouldSeeADialogWithHeader("Planned Billing Dates (WBSElement 1)").iClickOnButtonWithText("Edit Billing Plan")
			.iClickOnButtonWithText("Close");
	});

	opaTest("Testing Billing Due Date dialog Close button", function (Given, When, Then) {

		//Actions
		When.onMyPageUnderTest.iClickonObjectStatusWithValue("Apr 29, 2007");

		//Assertions
		Then.onMyPageUnderTest.iShouldSeeADialogWithHeader("Planned Billing Dates (WBSElement 1)").iClickOnButtonWithText("Close");
	});

	opaTest("FXUBLRAGILEPILOT-2009-AC3: Testing Prepayment button when Billing Due Date is in the future", function (Given, When, Then) {

		//Actions
		When.onMyPageUnderTest.iClickOnCheckboxForPrepayment();

		//Assertions
		Then.onMyPageUnderTest.iShouldSeePrepayment();
	});

	opaTest("FXUBLRAGILEPILOT-2009-AC3: Testing On Prepayment dialog Submit when Billing Due Date is in the future", function (Given, When,
		Then) {

		//Actions
		When.onTheGenericListReport.iClickTheButtonHavingLabel("Prepayment");

		//Assertions
		Then.onMyPageUnderTest.iShouldSeeADialogWithHeader("New On Account for WBSElement 2").iClickOnButtonWithText("Submit").iClickOnButtonWithText(
			"Close");
	});

	opaTest("Testing Delete PBR scenario", function (Given, When, Then) {

		//Actions
		When.onMyPageUnderTest.iClickOnDeleteAction();

		//Assertions
		Then.onMyPageUnderTest.iShouldSeeDeleteDialog().iClickOnButtonWithText("Cancel");
	});

	opaTest("Testing Delete PBR scenario and delete execute", function (Given, When, Then) {

		//Actions
		When.onMyPageUnderTest.iClickOnDeleteAction().iClickOnButtonWithText("Delete");

		//Assertions
		Then.onMyPageUnderTest.iShouldSeeDeleteErrorDialog().iClickOnButtonWithText("Close");
	});

	// opaTest("Testing Net Billable Rev Popovers", function (Given, When, Then) {

	// 	//Actions
	// 	When.onMyPageUnderTest.iClickonObjectStatusWithValue("7,002.00 EUR");

	// 	//Assertions
	// 	Then.onMyPageUnderTest.iShouldSeeAPopver();
	// });

	// opaTest("Net billed Dialogs : Excess", function (Given, When, Then) {

	// 	//Actions
	// 	When.onMyPageUnderTest.iClickonObjectStatusWithValue("11,001.00 EUR");

	// 	//Assertions
	// 	Then.onMyPageUnderTest.iShouldSeeADialogWithHeader("Related Invoices (WBSElement 1)");
	// });

	// opaTest("check Close button on dialog", function (Given, When, Then) {

	// 	//Actions
	// 	When.onMyPageUnderTest.iCheckButtonWithTextOnDialog("Close");

	// 	//Assertions
	// 	Then.onMyPageUnderTest.icloseDialog();
	// });

	// opaTest("Net billed Dialogs : Less", function (Given, When, Then) {

	// 	//Actions
	// 	When.onMyPageUnderTest.iClickonObjectStatusWithValue("5,001.00 EUR");

	// 	//Assertions
	// 	Then.onMyPageUnderTest.iShouldSeeADialogWithHeader("Related Invoices (WBSElement 2)");
	// });

	// opaTest("check Close button on dialog", function (Given, When, Then) {

	// 	//Actions
	// 	When.onMyPageUnderTest.iCheckButtonWithTextOnDialog("Close");

	// 	//Assertions
	// 	Then.onMyPageUnderTest.icloseDialog();
	// });

	// opaTest("Testing Net Unbilled Popovers", function (Given, When, Then) {

	// 	//Actions
	// 	When.onMyPageUnderTest.iClickonObjectStatusWithValue("6,001.00 EUR");

	// 	//Assertions
	// 	Then.onMyPageUnderTest.iShouldSeeAPopver();
	// });

	// opaTest("Testing Net Unbilled Popovers", function (Given, When, Then) {

	// 	//Actions
	// 	When.onMyPageUnderTest.iClickonObjectStatusWithValue("6,002.00 EUR");

	// 	//Assertions
	// 	Then.onMyPageUnderTest.iShouldSeeAPopver();
	// });

	// opaTest("Testing Due Billing date Dialogs: Future", function (Given, When, Then) {

	// 	//Actions
	// 	When.onMyPageUnderTest.iClickonObjectStatusWithValue("20/08/2028");

	// 	//Assertions
	// 	Then.onMyPageUnderTest.iShouldSeeADialogWithHeader("Planned Billing Dates (WBSElement 2)");
	// });

	// opaTest("check Close button on dialog", function (Given, When, Then) {

	// 	//Actions
	// 	When.onMyPageUnderTest.iCheckButtonWithTextOnDialog("Close");

	// 	//Assertions
	// 	Then.onMyPageUnderTest.icloseDialog().and.iTeardownMyAppFrame();
	// });

});