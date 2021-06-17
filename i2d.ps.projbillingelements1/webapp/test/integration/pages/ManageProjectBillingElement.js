sap.ui.define([
	"sap/ui/test/Opa5",
	"sap/ui/test/matchers/Properties",
	"sap/ui/test/actions/Press",
	"sap/ui/test/actions/EnterText",
	"sap/suite/ui/generic/template/integration/testLibrary/ListReport/pages/ListReport",
	"sap/suite/ui/generic/template/integration/testLibrary/ObjectPage/pages/ObjectPage"
], function (Opa5, Common, Press, EnterText) {
	"use strict";
	Opa5.extendConfig({
		autoWait: true,
		testLibs: {
			fioriElementsTestLibrary: {
				Common: {
					appId: 'i2d.ps.projbillingelements1',
					entitySet: 'C_ProjectBillingElementTP'
				}
			}
		}
	});
	Opa5.createPageObjects({

		onMyPageUnderTest: {
			actions: {

				iClickOnFilterBarExpand: function () {
					return this.waitFor({
						controlType: "sap.m.Button",
						matchers: new sap.ui.test.matchers.Properties({
							id: "i2d.ps.projbillingelements1::sap.suite.ui.generic.template.ListReport.view.ListReport::C_ProjectBillingElementTP--template:::ListReportPage:::DynamicPageTitle-expandBtn"
						}),
						timeout: 30,
						//autoWait: true,
						success: function (aObjectStat) {
							aObjectStat[0].firePress();
						},
						errorMessage: "Did not find the Object Status!"
					});
				},

				iLookAtTheLoadedApp: function () {
					return this;
				},

				iClickOnGoButton: function () {
					return this.waitFor({
						controlType: "sap.m.Button",
						visible: false,
						matchers: new sap.ui.test.matchers.Properties({
							text: "Go"
						}),
						//timeout: 100,
						autoWait: true,
						success: function (aButton) {
							aButton[0].firePress();
						},
						errorMessage: "Did not find Go Button!"

					});
				},

				iClickOnCheckbox: function () {
					return this.waitFor({
						controlType: "sap.m.Table",
						success: function (oTable) {
							oTable[0].setSelectedItem(oTable[0].getItems()[0], true, true);
						},

						errorMessage: "CheckBox was not found!"
					});
				},

				iClickOnDeleteAction: function () {
					return this.waitFor({
						controlType: "sap.ui.core.Icon",
						matchers: new sap.ui.test.matchers.Properties({
							src: "sap-icon://sys-cancel"
						}),
						success: function (aIcon) {
							aIcon[0].firePress();
						},
						errorMessage: "Delete Icon was not available"

					});
				},

				iClickOnCheckboxForPrepayment: function () {
					return this.waitFor({
						controlType: "sap.m.Table",
						success: function (oTable) {
							oTable[0].setSelectedItem(oTable[0].getItems()[1], true, true);
						},

						errorMessage: "CheckBox was not found!"
					});
				},

				iClickOnPrepareBilling: function () {
					return this.waitFor({
						controlType: "sap.m.Button",
						matchers: new sap.ui.test.matchers.Properties({
							text: "Prepare Billing"
						}),
						success: function (aButton) {
							aButton[0].firePress();
						},
						errorMessage: "Prepare billing button not found"

					});
				},

				iClickOnThePrepaymentIcon: function () {
					return this.waitFor({
						controlType: "sap.ui.core.Icon",
						matchers: new sap.ui.test.matchers.Properties({
							src: "sap-icon://up"
						}),
						success: function (aIcon) {
							aIcon[0].firePress();
						},
						errorMessage: "Prepayment Icon was not available"

					});
				},

				// iClickOnFilterExpandButton: function () {
				// 	return this.waitFor({
				// 		controlType: "sap.m.Button",
				// 		matchers: new sap.ui.test.matchers.Properties({
				// 			id: new RegExp("expandBtn" + "$")
				// 		}),
				// 		//timeout: 100,
				// 		autoWait: true,
				// 		success: function (aButton) {
				// 			aButton[0].firePress();
				// 		}

				// 	});
				// },

				// iFilterBasedPlanningCategoryWithValue: function (sFilterValue) {
				// 	return this.waitFor({
				// 		controlType: "sap.m.ComboBox",
				// 		visible: false,
				// 		matchers: new sap.ui.test.matchers.Properties({
				// 			id: new RegExp("PlanningCategory_Parameter" + "$")
				// 		}),
				// 		//timeout: 100,
				// 		autoWait: true,
				// 		actions: new EnterText({
				// 			text: sFilterValue
				// 		}),
				// 		errorMessage: "Did not find any Filters!"
				// 	});
				// },

				// iFilterBasedBudgetTimeSpanWithValue: function (sFilterValue) {
				// 	return this.waitFor({
				// 		controlType: "sap.m.ComboBox",
				// 		matchers: new sap.ui.test.matchers.Properties({
				// 			id: new RegExp("BudgetTimeSpan.Filter" + "$")
				// 		}),
				// 		//timeout: 100,
				// 		autoWait: true,
				// 		actions: new EnterText({
				// 			text: sFilterValue
				// 		}),
				// 		errorMessage: "Did not find any Filters!"
				// 	});
				// },

				// iFilterFiscalYearWithValue: function (sFilterValue) {
				// 	return this.waitFor({
				// 		controlType: "sap.m.Input",
				// 		visible: false,
				// 		matchers: new sap.ui.test.matchers.Properties({
				// 			id: new RegExp("FiscalYear" + "$")
				// 		}),
				// 		autoWait: true,
				// 		actions: new EnterText({
				// 			text: sFilterValue
				// 		}),
				// 		errorMessage: "Did not find any Filters!"
				// 	});
				// },

				// iClickOnSuggestion: function () {
				// 	return this.waitFor({
				// 		controlType: "sap.m.ComboBox",
				// 		visible: false,
				// 		matchers: new sap.ui.test.matchers.Properties({
				// 			id: new RegExp("PlanningCategory_Parameter" + "$")
				// 		}),
				// 		autoWait: true,
				// 		success: function (aButton) {
				// 			aButton[0].setSelectedKey('PLN');
				// 		}
				// 	});
				// },

				// iSelectAnyRow: function () {
				// 	return this.waitFor({
				// 		controlType: "sap.m.Table",
				// 		timeout: 100,
				// 		autoWait: true,
				// 		success: function (aTable) {
				// 			// console.log(aTable);
				// 			// debugger;
				// 			aTable[0].selectAll();
				// 			aTable[0].fireSelectionChange();

				// 		},
				// 		errorMessage: "Did not find the Tree Table on the app page"
				// 	});
				// },

				// iEnterTextInProject: function () {
				// 	return this.waitFor({
				// 		controlType: "sap.m.Input",
				// 		visible: false,
				// 		matchers: new sap.ui.test.matchers.Properties({
				// 			id: new RegExp("Project" + "$")
				// 		}),
				// 		timeout: 200,
				// 		autoWait: true,
				// 		actions: new EnterText({
				// 			text: "PROJ1"
				// 		})
				// 	});
				// },

				// iClickOnChart: function (oItem) {
				// 	return this.waitFor({
				// 		controlType: "sap.m.Table",
				// 		id: "i2d.ps.projectfinancials.monitors1::sap.suite.ui.generic.template.ListReport.view.ListReport::C_ProjectFinancialSummaryResults--responsiveTable",
				// 		errorMessage: "There is no responsive table",
				// 		success: function (oTable) {
				// 			var oLink = oTable.getItems()[0].getCells()[4].getItems()[0];
				// 			oLink.firePress();
				// 		}
				// 	});
				// },

				iClickonLinkWithValue: function (sValue) {
					return this.waitFor({
						controlType: "sap.m.Link",
						matchers: new sap.ui.test.matchers.Properties({
							text: sValue
						}),
						//timeout: 100,
						autoWait: true,
						actions: new Press(),

						errorMessage: "Did not find the Chart!"
					});
				},

				iClickonObjectStatusWithValue: function (sValue) {
					return this.waitFor({
						controlType: "sap.m.ObjectStatus",
						matchers: new sap.ui.test.matchers.Properties({
							text: sValue
						}),
						//timeout: 100,
						autoWait: true,
						success: function (aObjectStat) {
							aObjectStat[0].firePress();
						},
						errorMessage: "Did not find the Object Status!"
					});
				},

				iClickOnButtonWithTextForOnAccount: function (sText) {
					return this.waitFor({
						controlType: "sap.m.Button",
						matchers: new sap.ui.test.matchers.Properties({
							text: sText
						}),
						//timeout: 100,
						autoWait: true,
						success: function (aObjectStat) {
							aObjectStat[1].firePress();
						},
						errorMessage: "Did not find the Object Status!"
					});
				},

				iClickOnButtonWithText: function (sText) {
					return this.waitFor({
						controlType: "sap.m.Button",
						matchers: new sap.ui.test.matchers.Properties({
							text: sText
						}),
						//timeout: 100,
						autoWait: true,
						success: function (aObjectStat) {
							aObjectStat[0].firePress();
						},
						errorMessage: "Did not find the Object Status!"
					});
				}

				// iClickOnPredictCostsButton: function () {
				// 	return this.waitFor({
				// 		controlType: "sap.m.Button",
				// 		matchers: new sap.ui.test.matchers.Properties({
				// 			id: new RegExp("ActionForPredictionRun" + "$")
				// 		}),
				// 		//timeout: 100,
				// 		autoWait: true,
				// 		actions: new Press(),

				// 		errorMessage: "Did not find the Predict Costs Button!"
				// 	});
				// },

				// iClickTablePersoButton: function () {
				// 	return this.waitFor({
				// 		controlType: "sap.m.OverflowToolbarButton",
				// 		matchers: new sap.ui.test.matchers.Properties({
				// 			id: new RegExp("btnPersonalisation" + "$")
				// 		}),
				// 		//timeout: 100,
				// 		autoWait: true,
				// 		actions: new Press(),

				// 		errorMessage: "Did not find the Perso Button!"
				// 	});
				// },

				// iSelectAllColumns: function () {
				// 	return this.waitFor({
				// 		controlType: "sap.m.Table",
				// 		timeout: 100,
				// 		autoWait: true,
				// 		success: function (aTable) {
				// 			// console.log(aTable);
				// 			// debugger;
				// 			aTable[0].selectAll();
				// 			aTable[0].fireSelect();
				// 		},
				// 		errorMessage: "Did not find the select all in perso page"
				// 	});
				// },

				// iClickOnOkButton: function () {
				// 	return this.waitFor({
				// 		controlType: "sap.m.Button",
				// 		matchers: new sap.ui.test.matchers.Properties({
				// 			text: "OK"
				// 		}),
				// 		//timeout: 100,
				// 		autoWait: true,
				// 		actions: new Press(),

				// 		errorMessage: "Did not find the Perso OK Button!"
				// 	});
				// },

				// iClickOnViewBudgetButton: function () {
				// 	return this.waitFor({
				// 		controlType: "sap.m.Button",
				// 		matchers: new sap.ui.test.matchers.Properties({
				// 			id: new RegExp("ProjectFinancialSummaryResults3button" + "$")
				// 		}),
				// 		//timeout: 100,
				// 		autoWait: true,
				// 		actions: new Press(),

				// 		errorMessage: "Did not find the View Costs Button!"
				// 	});
				// },

				// iClickOnViewCostsButton: function () {
				// 	return this.waitFor({
				// 		controlType: "sap.m.Button",
				// 		matchers: new sap.ui.test.matchers.Properties({
				// 			id: new RegExp("ProjectFinancialSummaryResults1button" + "$")
				// 		}),
				// 		//timeout: 100,
				// 		autoWait: true,
				// 		actions: new Press(),

				// 		errorMessage: "Did not find the View Costs Button!"
				// 	});
				// },

				// iCheckButtonWithTextOnDialog: function (sText) {
				// 	return this.waitFor({
				// 		controlType: "sap.m.Button",
				// 		matchers: new sap.ui.test.matchers.Properties({
				// 			text: sText
				// 		}),
				// 		autoWait: true,
				// 		actions: new Press(),

				// 		errorMessage: "Did not find dialog!"
				// 	});
				// }

			},
			assertions: {

				iShouldSeeListReportTable: function () {
					return this.waitFor({
						controlType: "sap.m.Table",
						timeout: 30,

						success: function (aTable) {
							Opa5.assert.ok(true, "List Report is loaded correctly");

						},
						errorMessage: "SmartFilterBar not found"

					});
				},

				iShouldSeeDataInTheTable: function () {
					return this.waitFor({
						controlType: "sap.m.ColumnListItem",
						visible: false,
						//timeout: 100,
						autoWait: true,
						success: function (aTable) {
							Opa5.assert.ok(true, "Data loaded into the Table");
						},
						errorMessage: "Data did not load into the Table"
					});
				},

				iShouldSeePrepareBilling: function () {
					return this.waitFor({
						controlType: "sap.m.Button",
						matchers: new sap.ui.test.matchers.Properties({
							text: "Prepare Billing"
						}),
						autoWait: true,
						success: function () {
							Opa5.assert.ok(true, "Prepare billing button found");
						},
						errorMessage: "Prepare billing button not found"

					});
				},

				iShouldSeeDeleteDialog: function () {
					return this.waitFor({
						controlType: "sap.m.Title",
						properties: {
							text: "Delete Project Billing Request"
						},
						searchOpenDialogs: true,
						success: function () {
							Opa5.assert.ok(true, "Delete Dialog is seen");
						},
						errorMessage: "Delete Dialog is not found"
					});
				},

				iShouldSeeDeleteErrorDialog: function () {
					return this.waitFor({
						controlType: "sap.m.Title",
						properties: {
							text: "Error"
						},
						searchOpenDialogs: true,
						success: function () {
							Opa5.assert.ok(true, "Delete Error is seen");
						},
						errorMessage: "Delete Error Message is not seen"
					});
				},

				iShouldSeePrepayment: function () {
					return this.waitFor({
						controlType: "sap.m.Button",
						matchers: new sap.ui.test.matchers.Properties({
							text: "Prepayment"
						}),
						autoWait: true,
						success: function () {
							Opa5.assert.ok(true, "Prepayment button found");
						},
						errorMessage: "Prepayment button not found"

					});
				},

				// iShouldSeeADialog: function () {
				// 	return this.waitFor({
				// 		controlType: "sap.m.Button",
				// 		matchers: new sap.ui.test.matchers.Properties({
				// 			text: "Prepare Billing"
				// 		}),
				// 		autoWait: true,
				// 		success: function () {
				// 			Opa5.assert.ok(true, "Prepare billing button found");
				// 		},
				// 		errorMessage: "Prepare billing button not found"

				// 	});
				// },

				// iShouldSeePresoDialog: function () {
				// 	return this.waitFor({
				// 		controlType: "sap.m.P13nDialog",
				// 		//id: "bookmarkDialog",
				// 		//timeout: 100,
				// 		autoWait: true,
				// 		success: function (aDialog) {
				// 			Opa5.assert.ok(true, "Perso Dialog showed up");
				// 		},
				// 		errorMessage: "Perso Dialog didn't show"
				// 	});
				// },

				iShouldSeeAPopover: function () {
					return this.waitFor({
						controlType: "sap.m.Popover",
						timeout: 1000,
						autoWait: true,
						success: function (aDialog) {
							aDialog[0].close();
							Opa5.assert.ok(true, "Popover with correct header showed up");

						},
						errorMessage: "Bookmark Dialog didn't show"
					});
				},

				// iShouldSeeTableHeaderWithText: function (sText) {
				// 	return this.waitFor({
				// 		controlType: "sap.m.Title",
				// 		//text: sText,
				// 		autoWait: true,
				// 		success: function () {
				// 			Opa5.assert.ok(true, "Bookmark Dialog showed up");
				// 		},
				// 		errorMessage: "Table Header Text :" + sText + " not seen Dialog didn't show"
				// 	});
				// },

				// aDialogBoxShouldAppear: function () {
				// 	return this.waitFor({
				// 		controlType: "sap.m.Dialog",
				// 		//timeout: 100,
				// 		autoWait: true,
				// 		success: function (aDialog) {
				// 			aDialog[0].close();
				// 			Opa5.assert.ok(true, "Dialog displayed");
				// 		},
				// 		errorMessage: "Dialog did not show"
				// 	});

				// },

				// iShouldSeeTheSearchField: function () {
				// 	return this.waitFor({
				// 		controlType: "sap.m.SearchField",
				// 		autoWait: true,
				// 		success: function (aSearchField) {
				// 			if (aSearchField[0]) {
				// 				Opa5.assert.ok(true, "Search filter present");
				// 			} else {
				// 				Opa5.assert.ok(true, "Search filter not present");
				// 			}
				// 		}
				// 	});
				// },
				iFindAMessageBoxWithClose: function () {
					return this.waitFor({
						controlType: "sap.m.Button",
						autoWait: true,
						success: function (aMessageBox) {

							Opa5.assert.ok(true, "Message Box is shownn");
						},
						errorMessage: "Prepare Billing Failed"
					});
				},

				iShouldSeeADialogWithHeader: function (sTitle) {
					return this.waitFor({
						controlType: "sap.m.Dialog",
						matchers: new sap.ui.test.matchers.Properties({
							title: sTitle
						}),
						autoWait: true,
						success: function (aButton) {
							//	sText.firePress();
							//	aButton[0].firePress();
							Opa5.assert.ok(true, "Dialog showed with correct header");
						},
						errorMessage: "Dialog with correct header not found"
					});
				},

				iClickOnButtonWithText: function (sText) {
					return this.waitFor({
						controlType: "sap.m.Button",
						matchers: new sap.ui.test.matchers.Properties({
							text: sText
						}),
						//timeout: 100,
						autoWait: true,
						success: function (aObjectStat) {
							aObjectStat[0].firePress();
						},
						errorMessage: "Did not find the Object Status!"
					});
				}
			}
		}
	});
});