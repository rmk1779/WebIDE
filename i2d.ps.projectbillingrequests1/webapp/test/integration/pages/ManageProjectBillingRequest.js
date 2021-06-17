sap.ui.define([
	"sap/ui/test/Opa5",
	"sap/ui/test/matchers/Properties",
	"sap/ui/test/actions/Press",
	"sap/suite/ui/generic/template/integration/testLibrary/ListReport/pages/ListReport",
	"sap/suite/ui/generic/template/integration/testLibrary/ObjectPage/pages/ObjectPage"
], function (Opa5, Properties, Press) {
	"use strict";

	Opa5.extendConfig({
		autoWait: true,
		testLibs: {
			fioriElementsTestLibrary: {
				Common: {
					appId: 'i2d.ps.projectbillingrequests1',
					entitySet: 'C_ProjectBillingRequestTP'
				}
			}
		}
	});

	Opa5.createPageObjects({

		onMyPageUnderTest: {
			actions: {

				iLookAtTheLoadedApp: function () {
					return this;
				},

				iClickOnButtonWithText: function (sText) {
					return this.waitFor({
						controlType: "sap.m.Button",
						visible: false,
						matchers: new sap.ui.test.matchers.Properties({
							text: sText
						}),
						//timeout: 10000,
						autoWait: true,
						actions: new Press(),
						errorMessage: "Did not find Button!"
					});
				},

				iClickRadioButtonWithId: function (sId) {
					return this.waitFor({
						controlType: "sap.m.RadioButton",
						matchers: new sap.ui.test.matchers.Properties({
							id: sId
						}),
						//timeout: 100,
						autoWait: true,
						actions: new Press(),
						errorMessage: "Did not find the Radio Button With Given Id!"
					});
				},
				iSelectItemsByLineNo: function () {
					return this.waitFor({
						controlType: "sap.ui.table.Table",
						timeout: 100,
						autoWait: true,
						success: function (aTable) {
							aTable[0].getPlugins()[0].setSelectedIndex(0);
							//aTable[0].getPlugins()[0].removeSelectionInterval(0, 0);
							//aTable[0].getPlugins()[0].setSelectedIndex(0);

						},
						errorMessage: "Did not find the Tree Table on the app page"
					});
				}
			},
			assertions: {
				iShouldSeeDataInColumnList: function () {
					return this.waitFor({
						controlType: "sap.m.ColumnListItem",
						visible: false,
						timeout: 10000,
						//autoWait: true,
						success: function (aTable) {
							Opa5.assert.ok(true, "Data loaded into the Table");
						},
						errorMessage: "Data did not load into the Table"
					});
				},
				iShouldSeeTheDialogWithHeader: function (sTitle) {
					return this.waitFor({
						controlType: "sap.m.Dialog",
						matchers: new sap.ui.test.matchers.Properties({
							title: sTitle
						}),
						timeout: 1000,
						autoWait: true,
						success: function (aDialog) {
							Opa5.assert.ok(true, "Dialog with correct header showed up");
						},
						errorMessage: "Dialog didn't show up"
					});
				},
				iShouldSeeTheMessagePopover: function () {
					return this.waitFor({
						controlType: "sap.m.MessagePopover",
						timeout: 1000,
						autoWait: true,
						success: function (aPopover) {
							aPopover[0].close();
							Opa5.assert.ok(true, "Message Popover showed up");
						},
						errorMessage: "MessagePopover didn't show up"
					});
				},
				iClickOnButtonWithText: function (sText) {
					return this.waitFor({
						controlType: "sap.m.Button",
						visible: false,
						matchers: new sap.ui.test.matchers.Properties({
							text: sText
						}),
						timeout: 10000,
						autoWait: true,
						actions: new Press(),
						errorMessage: "Did not find Button!"
					});
				},
				iShouldSeeDataInTheTable: function () {
					return this.waitFor({
						controlType: "sap.ui.table.Table",
						timeout: 1000,
						autoWait: true,
						success: function (aTable) {
							Opa5.assert.ok(true, "Data loaded into the Table");
						},
						errorMessage: "Data did not load into the Table"
					});
				},
				iCloseDialog: function (aButton) {
					return this.waitFor({
						controlType: "sap.m.Dialog",
						//timeout: 100,
						autoWait: true,
						success: function (aDialog) {
							aDialog[0].close();
							Opa5.assert.ok(true, "Dialog displayed");
						},
						errorMessage: "Dialog did not show"
					});
				},
				iCanSeeObjectPageLoaded: function () {
					return this.waitFor({
						controlType: "sap.m.Link",
						//timeout: 100,
						autoWait: true,
						success: function (oLink) {
							Opa5.assert.ok(true, "Object Header is there");
						},
						errorMessage: "Something is missing"
					});
				}
			}

		}

	});

});