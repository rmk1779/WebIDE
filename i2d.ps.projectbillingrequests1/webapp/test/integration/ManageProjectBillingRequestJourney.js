sap.ui.define([
	"sap/ui/test/opaQunit",
	"sap/ui/test/actions/Press",
	"sap/suite/ui/generic/template/integration/testLibrary/ListReport/pages/ListReport",
	"sap/suite/ui/generic/template/integration/testLibrary/ObjectPage/pages/ObjectPage"
], function (opaTest) {
	"use strict";

	QUnit.module("moduleName");
	opaTest("Data should display in the table on click of Go button", function (Given, When, Then) {

		Given.iStartMyAppInAFrame("../flpSandboxMockServer.html");

		//Action
		When.onMyPageUnderTest.iClickOnButtonWithText("Go");
		//Assertion
		Then.onMyPageUnderTest.iShouldSeeDataInColumnList();
	});

	opaTest("Object Page navigation from line 1 and Testing OP Facets", function (Given, When, Then) {
		
		//var aSections = ["Time and Expense Items", "Fixed Price Items"];
		//Action
		When.onTheGenericListReport.iNavigateFromListItemByLineNo(0);
		//Assertion
		When.onMyPageUnderTest.iLookAtTheLoadedApp();
		//Then.onTheGenericObjectPage.iShouldSeeTheSections(aSections);
	});

	opaTest("Testing To Be Billed button", function (Given, When, Then) {

		//Action
		When.onTheGenericObjectPage.iClickTheButtonHavingLabel("To Be Billed (4)");
		//Assertion
		Then.onMyPageUnderTest.iShouldSeeDataInTheTable();
	});

	opaTest("Should see postpone dialog with correct header", function (Given, When, Then) {

		//Action
		When.onMyPageUnderTest.iSelectItemsByLineNo().iClickOnButtonWithText("Postpone");
		//Assertion
		Then.onMyPageUnderTest.iShouldSeeTheDialogWithHeader("Postpone Date");
	});

	opaTest("Check buttons on dialog of postpone :Postpone ", function (Given, When, Then) {

		//Action
		When.onTheGenericObjectPage.iClickTheButtonHavingLabel("Postpone");
		//Assertion
		Then.onMyPageUnderTest.iShouldSeeTheDialogWithHeader("Error").iCloseDialog("Close");
	});

	opaTest("Check buttons on dialog of postpone :Cancel", function (Given, When, Then) {

		//Action
		When.onMyPageUnderTest.iSelectItemsByLineNo().iClickOnButtonWithText("Postpone");
		//Assertion
		Then.onMyPageUnderTest.iShouldSeeTheDialogWithHeader("Postpone Date").iCloseDialog("Cancel");
	});

	opaTest("Should see write off dialog with correct header", function (Given, When, Then) {

		//Action
		When.onMyPageUnderTest.iSelectItemsByLineNo().iClickOnButtonWithText("Write Off");
		//Assertion
		Then.onMyPageUnderTest.iShouldSeeTheDialogWithHeader("Write Off");
	});

	opaTest("Check buttons on dialog of write off :write off ", function (Given, When, Then) {

		//Action
		When.onTheGenericObjectPage.iClickTheButtonHavingLabel("Write Off");
		//Assertion
		Then.onMyPageUnderTest.iShouldSeeTheDialogWithHeader("Error").iCloseDialog("Close");
	});

	opaTest("Check buttons on dialog of write off :Cancel", function (Given, When, Then) {

		//Action
		When.onMyPageUnderTest.iSelectItemsByLineNo().iClickOnButtonWithText("Write Off");
		//Assertion
		Then.onMyPageUnderTest.iShouldSeeTheDialogWithHeader("Write Off").iCloseDialog("Cancel");
	});

	opaTest("Testing To Be postponed button", function (Given, When, Then) {

		//Action
		When.onTheGenericObjectPage.iClickTheButtonHavingLabel("To Be Postponed (1)");
		//Assertion
		Then.onMyPageUnderTest.iShouldSeeDataInTheTable();
	});
	opaTest("Should see Reinclude dialog with correct header", function (Given, When, Then) {

		//Action
		When.onMyPageUnderTest.iSelectItemsByLineNo().iClickOnButtonWithText("Reinclude");
		//Assertion
		Then.onMyPageUnderTest.iShouldSeeTheDialogWithHeader("Reinclude");
	});

	opaTest("Check buttons on dialog of Reinclude :Reinclude ", function (Given, When, Then) {

		//Action
		When.onTheGenericObjectPage.iClickTheButtonHavingLabel("Reinclude");
		//Assertion
		Then.onMyPageUnderTest.iShouldSeeTheDialogWithHeader("Error").iCloseDialog("Close");
	});

	opaTest("Check buttons on dialog of Reinclude :Cancel", function (Given, When, Then) {

		//Action
		When.onMyPageUnderTest.iSelectItemsByLineNo().iClickOnButtonWithText("Reinclude");
		//Assertion
		Then.onMyPageUnderTest.iShouldSeeTheDialogWithHeader("Reinclude").iCloseDialog("Cancel");
	});

	opaTest("Testing To Be written Off button", function (Given, When, Then) {

		//Action
		When.onTheGenericObjectPage.iClickTheButtonHavingLabel("To Be Written Off (1)");
		//Assertion
		Then.onMyPageUnderTest.iShouldSeeDataInTheTable();
	});

	opaTest("Testing To Be Billed button", function (Given, When, Then) {

		//Action
		When.onTheGenericObjectPage.iClickTheButtonHavingLabel("To Be Billed (4)");
		//Assertion
		Then.onMyPageUnderTest.iShouldSeeDataInTheTable();
	});
	
	opaTest("Testing Until Last Day of the Previous Month in Restrict Date Dialog", function (Given, When, Then) {

		//Action
		When.onMyPageUnderTest.iClickOnButtonWithText("Restrict Date").iClickRadioButtonWithId("radioButton2ID");
		//Assertion
		Then.onMyPageUnderTest.iCloseDialog("Cancel");
	});

	opaTest("Testing Until Specific date (date is null) in Restrict Date Dialog", function (Given, When, Then) {

		//Action
		When.onMyPageUnderTest.iClickOnButtonWithText("Restrict Date").iClickRadioButtonWithId("radioButton3ID").iClickOnButtonWithText(
			"Restrict");
		//Assertion
		Then.onMyPageUnderTest.iCloseDialog("Cancel");
	});

	opaTest("Testing Until Last Day of the Previous Month in Restrict Date Dialog with Restrict Button", function (Given, When, Then) {

		//Action
		When.onMyPageUnderTest.iClickOnButtonWithText("Restrict Date").iClickRadioButtonWithId("radioButton2ID").iClickOnButtonWithText(
			"Restrict");
		//Assertion
		Then.onMyPageUnderTest.iShouldSeeTheDialogWithHeader("Error").iCloseDialog("Restrict");
	});
	
	opaTest("Testing Delete action - Cancel", function (Given, When, Then) {

		//Action
		When.onTheGenericObjectPage.iClickTheButtonHavingLabel("Delete");
		//Assertion
		Then.onMyPageUnderTest.iShouldSeeTheDialogWithHeader("Delete Project Billing Request").iCloseDialog("Cancel");
	});
	
	opaTest("Testing Delete button", function (Given, When, Then) {

		//Action
		When.onTheGenericObjectPage.iClickTheButtonHavingLabel("Delete");
		//Assertion
		Then.onMyPageUnderTest.iShouldSeeTheDialogWithHeader("Delete Project Billing Request");
	});
	
	opaTest("Testing Delete action - Delete", function (Given, When, Then) {

		//Action
		When.onTheGenericObjectPage.iClickTheButtonHavingLabel("Delete");
		//Assertion
		Then.onMyPageUnderTest.iShouldSeeTheDialogWithHeader("Error").iCloseDialog("Close");
	});
	
	opaTest("Testing Submit button in the footer", function (Given, When, Then) {

		//Action
		When.onTheGenericObjectPage.iClickTheButtonHavingLabel("Submit");
		//Assertion
		Then.onMyPageUnderTest.iShouldSeeTheDialogWithHeader("Error").iCloseDialog("Close");
	});
	
	opaTest("Navigate back (to check error message popover)", function (Given, When, Then) {

		//Action
		When.onTheGenericObjectPage.iNavigateBack();
		//Assertion
		When.onTheGenericListReport.iNavigateFromListItemByLineNo(1);
	});
	
	opaTest("Testing Error message popover in the footer", function (Given, When, Then) {

		//Action
		When.onTheGenericObjectPage.iClickTheButtonHavingLabel("3");
		//Assertion
		Then.onMyPageUnderTest.iShouldSeeTheMessagePopover();
	});
	
	opaTest("Navigate back (to check only Fix price case)", function (Given, When, Then) {

		//Action
		When.onTheGenericObjectPage.iNavigateBack();
		//Assertion
		When.onTheGenericListReport.iNavigateFromListItemByLineNo(2).and.iTeardownMyAppFrame();
	});
	
});