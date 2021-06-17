sap.ui.controller("i2d.ps.projectbillingrequests1.ext.controller.ObjectPageExt", {
	/*global Map*/
	onInit: function () {
		this.Core = sap.ui.getCore();
		this.oi18nModel = this.getOwnerComponent().getModel("i18n").getResourceBundle();
		this.mColoumMap = new Map();
		//due billing date check for the submit case and the error message popover case
		this.bDueBillingDateIsNotNull = true;
		// for the busy indicator we need the current section displayed
		this.sCurrentSectionId = "";
		//page data loaded function attached to the event listener
		this.extensionAPI.attachPageDataLoaded(this.fnonPageDataLoaded.bind(this));
		//instanciating the tables into a object for reference
		this.oTESmartTable = this.Core.byId(
			"i2d.ps.projectbillingrequests1::sap.suite.ui.generic.template.ObjectPage.view.Details::C_ProjectBillingRequestTP--timeAndExpenseItemsFacetID::Table"
		);
		this.oFixedPriceSmartTable = this.Core.byId(
			"i2d.ps.projectbillingrequests1::sap.suite.ui.generic.template.ObjectPage.view.Details::C_ProjectBillingRequestTP--fixedPriceItemsFacetID::Table"
		);
		this.oPrepaymentsSmartTable = this.Core.byId(
			"i2d.ps.projectbillingrequests1::sap.suite.ui.generic.template.ObjectPage.view.Details::C_ProjectBillingRequestTP--prepaymentsFacetID::Table"
		);
		//setting the export to excel feature to the above tables
		this.oTESmartTable.setUseExportToExcel(true);
		this.oFixedPriceSmartTable.setUseExportToExcel(true);
		this.oPrepaymentsSmartTable.setUseExportToExcel(true);

		//settings fields which are to be ignored from personlization in the same tables as mentioned above
		this.oTESmartTable.setIgnoreFromPersonalisation(
			"PersonFullName,Material,ProjBillgReqItmLastChgdBy,PersonNumber,BillingPlanItemUsage,BillingControlCategory,BaseUnitActualCost,NetPriceAmountInDocCrcy,TransactionCurrency,QuantityUnit,BillingPlanBillingDate,DocumentCurrency"
		);
		this.oFixedPriceSmartTable.setIgnoreFromPersonalisation(
			"Material,ProjBillgReqItmLastChgdBy,AccountingDocument,PrjBlgElmEntrLastChgdAtDteTme,BillingControlCategoryText,OpenAmountInTransCrcy,OpenAmountInProjectCurrency,PersonFullName,SalesOrderItemConcatenatedID,JournalEntrySemanticKey,BaseUnitActualCost,BillingControlCategory,ToBeBilledQuantity_fc,ToBePostponedQuantity_fc,ToBeWrittenOffQuantity_fc,ProjectBillingRequestItemUUID,WBSElement,FiscalYear,WorkItem,ServicesRenderedDate,NetPriceAmountInDocCrcy,ProjectBillingRequestUUID,ProjBillgElmntEntrItmUUID,ProjectBillingElementUUID,SalesDocumentItem,ToBePostponedQuantity,ToBePostponedAmtInTransacCrcy,ToBePostponedAmtInProjectCrcy,ToBePostponedAmtInGlobalCrcy,ToBeWrittenOffQuantity,ToBeWrittenOffAmtInTransCrcy,ToBeWrittenOffAmtInProjectCrcy,ToBeWrittenOffAmtInGlobalCrcy,ToBeBilledQuantity,ToBeBilledAmtInTransCrcy,ToBeBilledAmtInProjCurrency,ToBeBilledAmtInGlobCurrency,ProjBillgReqItmLastChgdBy,ProjBillgReqItmLastChgdDteTme,DocumentCurrency,QuantityUnit,ProjectCurrency,GlobalCurrency,TransactionCurrency,BillingPlanItemUsage,WorkItemName,OpenQuantity,WorkPackage,ProjBillgElmntEntrSourceType"
		);
		this.oPrepaymentsSmartTable.setIgnoreFromPersonalisation(
			"JournalEntrySemanticKey,BaseUnitActualCost,BillingControlCategory,ToBeBilledQuantity_fc,ToBePostponedQuantity_fc,ToBeWrittenOffQuantity_fc,ProjectBillingRequestItemUUID,WBSElement,FiscalYear,WorkItem,ServicesRenderedDate,NetPriceAmountInDocCrcy,ProjectBillingRequestUUID,ProjBillgElmntEntrItmUUID,ProjectBillingElementUUID,SalesDocumentItem,SalesDocument,ToBePostponedQuantity,ToBePostponedAmtInTransacCrcy,ToBePostponedAmtInProjectCrcy,ToBePostponedAmtInGlobalCrcy,ToBeWrittenOffQuantity,ToBeWrittenOffAmtInTransCrcy,ToBeWrittenOffAmtInProjectCrcy,ToBeWrittenOffAmtInGlobalCrcy,ToBeBilledQuantity,ToBeBilledAmtInTransCrcy,ToBeBilledAmtInProjCurrency,ToBeBilledAmtInGlobCurrency,ProjBillgReqItmLastChgdBy,ProjBillgReqItmLastChgdDteTme,DocumentCurrency,QuantityUnit,ProjectCurrency,GlobalCurrency,TransactionCurrency,BillingPlanItemUsage,WorkItemName,OpenQuantity,WorkPackage,ProjBillgElmntEntrSourceType"
		);

		//removing personlization feature from the prepayments table
		this.oPrepaymentsSmartTable.setShowTablePersonalisation(false);

		//setting fields to be requested in the batch call made
		this.oTESmartTable.setRequestAtLeastFields(
			"SalesDocument,SalesDocumentItem,BillingControlCategory,LedgerGLLineItem,AccountingDocument,FiscalYear,ToBePostponedAmtInTransacCrcy,ToBeWrittenOffAmtInTransCrcy,ToBeBilledAmtInTransCrcy,ToBeBilledQuantity,ToBeWrittenOffQuantity,ToBePostponedQuantity,OpenQuantity,BaseUnitActualCost,NetPriceAmountInDocCrcy,OpenAmountInTransCrcy,OpenAmountInProjectCurrency,AvailyCtrlTimeRangeType"
		);
		this.oPrepaymentsSmartTable.setRequestAtLeastFields("SalesOrderItemConcatenatedID");
		this.oFixedPriceSmartTable.setRequestAtLeastFields("SalesDocument,SalesDocumentItem");
		this.oPrepaymentsSmartTable.setRequestAtLeastFields("ProjectCurrency,BillingPlanItemUsage,BillingPlanUsageCategory,Material");

		//for readying the rebind events which would be used to set filters and et al.
		this.oTEGridTable = this.oTESmartTable.getTable();
		this.oTEGridTable.getPlugins()[0].attachSelectionChange(this.fnTETableRowSelectionChange.bind(this));
		this.oFixedPriceSmartTable.attachBeforeRebindTable(this.fnBeforeRebindFixPriceTable.bind(this));
		this.oPrepaymentsSmartTable.attachBeforeRebindTable(this.fnBeforeRebindPrepaymentsTable.bind(this));
		this.oTESmartTable.attachBeforeRebindTable(this.fnBeforeRebindTETable.bind(this));

	},

	fnTETableRowSelectionChange: function (oEvent) {
		var aBillableControlCategories = [];
		// idea is to check if amongst the seleted items in the T&E table if any one of the items are non-billable
		for (var i = 0; i < this.oTEGridTable.getPlugins()[0].getSelectedIndices().length; i++) {
			aBillableControlCategories.push(this.oTEGridTable.getContextByIndex(this.oTEGridTable.getPlugins()[0].getSelectedIndices()[i]).getObject()
				.BillingControlCategory
				.toLowerCase());
		}
		if (!aBillableControlCategories.includes("billable")) {
			this.Core.byId(
				"i2d.ps.projectbillingrequests1::sap.suite.ui.generic.template.ObjectPage.view.Details::C_ProjectBillingRequestTP--ActionC_ProjectBillingRequestTPSections4button"
			).setEnabled(false);
		}
	},

	handleMessagePopoverPress: function (oEventPress, aBillingElements, bIsTheMessageComingFromBackend) {
		// function used to handle the diaplay of the error messages upon entry or upon submit
		var aDisplayMessages = [];
		if (!bIsTheMessageComingFromBackend) { //here the check is for the messages coming from backend or not viz., upon submit
			/* Currently used to disable seletction of the time and expense table so that the actions are not enabled because of the framwork overridding the enablement. We want it to be disabled if the error
		       is present upon entry. this can be updated to check only for specific messages if need arises */
			this.Core.byId(
				"i2d.ps.projectbillingrequests1::sap.suite.ui.generic.template.ObjectPage.view.Details::C_ProjectBillingRequestTP--timeAndExpenseItemsFacetID::Table"
			).getTable().getPlugins()[0].setSelectionMode(sap.ui.table.SelectionMode.None);
			for (var k = 0, len = aBillingElements.length; k < len; k++) {
				var oMessageObject = {};
				oMessageObject.type = this.oi18nModel.getText("ERROR");
				oMessageObject.title = this.oi18nModel.getText("ERROR_TITLE");
				oMessageObject.subtitle = this.oi18nModel.getText("ERROR_SUBTITLE", aBillingElements[k]);
				oMessageObject.desc = this.oi18nModel.getText("ERROR_DESC", aBillingElements[k]);
				aDisplayMessages.push(oMessageObject);
			}
		} else { // if this block is reached, it was because the backend error was the one triggered
			if (aDisplayMessages.length) { // have to clear the display message before we display it. This is used when we re-enter the application
				aDisplayMessages = [];
			}
			if (aBillingElements === this.oi18nModel.getText("ERROR_CALL_FOR_SUBMIT")) {
				aDisplayMessages.push({
					type: this.oi18nModel.getText("ERROR"),
					title: this.oi18nModel.getText("ERROR_TITLE_FOR_SUBMIT"),
					subtitle: this.oi18nModel.getText("ERROR_CALL_FOR_SUBMIT"),
					desc: this.oi18nModel.getText("ERROR_CALL_FOR_SUBMIT")
				});
			} else {
				aDisplayMessages.push({
					type: this.oi18nModel.getText("ERROR"),
					title: this.oi18nModel.getText("ERROR_TITLE_FOR_SUBMIT"),
					subtitle: JSON.parse(aBillingElements.responseText).error.message.value,
					desc: JSON.parse(aBillingElements.responseText).error.message.value
				});
			}
		}
		//check if the due billing date is null. If so, push the error message into the message popover list
		if (!this.bDueBillingDateIsNotNull) {
			/*setting the submit button to be disabled if there is a due billing date error upon entry*/
			this.Core.byId(
				"i2d.ps.projectbillingrequests1::sap.suite.ui.generic.template.ObjectPage.view.Details::C_ProjectBillingRequestTP--ActionC_ProjectBillingRequestTPHeader1button"
			).setEnabled(false);
			aDisplayMessages.push({
				type: this.oi18nModel.getText("ERROR"),
				title: this.oi18nModel.getText("ERROR_TITLE_FOR_NODUE"),
				subtitle: this.oi18nModel.getText("ERROR_DESC_FOR_NODUE"),
				desc: this.oi18nModel.getText("ERROR_DESC_FOR_NODUE")
			});
		}

		var oMessageTemplate = new sap.m.MessageItem({
			type: "{type}",
			title: "{title}",
			description: "{desc}",
			subtitle: "{subtitle}"
		});

		var oErrorMessageModel = new sap.ui.model.json.JSONModel();
		oErrorMessageModel.setData(aDisplayMessages);

		var oMessagePopover = new sap.m.MessagePopover({
			items: {
				path: "/",
				template: oMessageTemplate
			}
		});

		oMessagePopover.setModel(oErrorMessageModel);
		oMessagePopover.toggle(oEventPress.getSource());
	},

	fnonPageErrorHandle: function (oSelectedObject, oBackendError) {
		// this function is for rest the object page footer in preparation of the handleMessagePopoverPress function. 
		var that = this,
			sStoreOrderRejectionComment = oSelectedObject === null ? "" : oSelectedObject.StoreOrderRejectionComment,
			aBillingElements = [],
			oErrorBtn = new sap.m.Button({
				icon: "sap-icon://message-error",
				type: "Reject"
			}),
			oSubmitBtn;
		if (oBackendError === null) { // this block is executed if this function was triggered by errors from the submit and other actions
			if (sStoreOrderRejectionComment) {
				aBillingElements = sStoreOrderRejectionComment.split(",");
			} else {
				aBillingElements = [];
			}
			oErrorBtn.setText(this.bDueBillingDateIsNotNull ? aBillingElements.length : aBillingElements.length + 1);
			oErrorBtn.attachPress(function (oEventPress) {
				that.handleMessagePopoverPress(oEventPress, aBillingElements, false);
			});
			if (aBillingElements.length || !this.bDueBillingDateIsNotNull) {
				sap.ui.getCore().byId(
					"i2d.ps.projectbillingrequests1::sap.suite.ui.generic.template.ObjectPage.view.Details::C_ProjectBillingRequestTP--template::ObjectPage::FooterToolbar"
				).destroyContent();
				oSubmitBtn = new sap.m.Button(
					"i2d.ps.projectbillingrequests1::sap.suite.ui.generic.template.ObjectPage.view.Details::C_ProjectBillingRequestTP--ActionC_ProjectBillingRequestTPHeader1button", {
						type: "Emphasized",
						text: "Submit",
						press: function (oEvt) {
							that.fnOnSubmitButtonClick(oEvt);
						}
					});
				sap.ui.getCore().byId(
					"i2d.ps.projectbillingrequests1::sap.suite.ui.generic.template.ObjectPage.view.Details::C_ProjectBillingRequestTP--template::ObjectPage::FooterToolbar"
				).addContent(oErrorBtn);
				sap.ui.getCore().byId(
					"i2d.ps.projectbillingrequests1::sap.suite.ui.generic.template.ObjectPage.view.Details::C_ProjectBillingRequestTP--template::ObjectPage::FooterToolbar"
				).addContent(new sap.m.ToolbarSpacer());
				sap.ui.getCore().byId(
					"i2d.ps.projectbillingrequests1::sap.suite.ui.generic.template.ObjectPage.view.Details::C_ProjectBillingRequestTP--template::ObjectPage::FooterToolbar"
				).addContent(oSubmitBtn);
				//Disabling actions in case of errors. we use the event delegate to make sure the disablement is after the rendering. else it wont work
				this.Core.byId(
					"i2d.ps.projectbillingrequests1::sap.suite.ui.generic.template.ObjectPage.view.Details::C_ProjectBillingRequestTP--ActionC_ProjectBillingRequestTPHeader1button"
				).addEventDelegate({
					onAfterRendering: function () {
						// using sap.ui.core instead of this.Core because of the event delegate
						sap.ui.getCore().byId(
							"i2d.ps.projectbillingrequests1::sap.suite.ui.generic.template.ObjectPage.view.Details::C_ProjectBillingRequestTP--ActionC_ProjectBillingRequestTPHeader1button"
						).setEnabled(false);
						sap.ui.getCore().byId(
							"i2d.ps.projectbillingrequests1::sap.suite.ui.generic.template.ObjectPage.view.Details::C_ProjectBillingRequestTP--ActionC_ProjectBillingRequestTPSections1button"
						).setEnabled(false);
						sap.ui.getCore().byId(
							"i2d.ps.projectbillingrequests1::sap.suite.ui.generic.template.ObjectPage.view.Details::C_ProjectBillingRequestTP--ActionC_ProjectBillingRequestTPSections2button"
						).setEnabled(false);
						sap.ui.getCore().byId(
							"i2d.ps.projectbillingrequests1::sap.suite.ui.generic.template.ObjectPage.view.Details::C_ProjectBillingRequestTP--ActionC_ProjectBillingRequestTPSections3button"
						).setEnabled(false);
						sap.ui.getCore().byId(
							"i2d.ps.projectbillingrequests1::sap.suite.ui.generic.template.ObjectPage.view.Details::C_ProjectBillingRequestTP--ActionC_ProjectBillingRequestTPSections4button"
						).setEnabled(false);
						//reinforcing the removal of frameworks delete button 
						sap.ui.getCore().byId(
							"i2d.ps.projectbillingrequests1::sap.suite.ui.generic.template.ObjectPage.view.Details::C_ProjectBillingRequestTP--delete").setVisible(
							false);
					}
				});

			}
		} else if (oSelectedObject === null) { // this block is executed if the error messages are present upon entry into the application
			aBillingElements = oBackendError;
			//Only one error message can come on submit
			oErrorBtn.setText("1");
			oErrorBtn.attachPress(function (oEventPress) {
				that.handleMessagePopoverPress(oEventPress, aBillingElements, true);
			});
			sap.ui.getCore().byId(
				"i2d.ps.projectbillingrequests1::sap.suite.ui.generic.template.ObjectPage.view.Details::C_ProjectBillingRequestTP--template::ObjectPage::FooterToolbar"
			).destroyContent();
			oSubmitBtn = new sap.m.Button(
				"i2d.ps.projectbillingrequests1::sap.suite.ui.generic.template.ObjectPage.view.Details::C_ProjectBillingRequestTP--ActionC_ProjectBillingRequestTPHeader1button", {
					type: "Emphasized",
					text: "Submit",
					press: function (oEvt) {
						that.fnOnSubmitButtonClick(oEvt);
					}
				});
			sap.ui.getCore().byId(
				"i2d.ps.projectbillingrequests1::sap.suite.ui.generic.template.ObjectPage.view.Details::C_ProjectBillingRequestTP--template::ObjectPage::FooterToolbar"
			).addContent(oErrorBtn);
			sap.ui.getCore().byId(
				"i2d.ps.projectbillingrequests1::sap.suite.ui.generic.template.ObjectPage.view.Details::C_ProjectBillingRequestTP--template::ObjectPage::FooterToolbar"
			).addContent(new sap.m.ToolbarSpacer());
			sap.ui.getCore().byId(
				"i2d.ps.projectbillingrequests1::sap.suite.ui.generic.template.ObjectPage.view.Details::C_ProjectBillingRequestTP--template::ObjectPage::FooterToolbar"
			).addContent(oSubmitBtn);
		}
	},

	fnonPageDataLoaded: function (oEvent) {
		//this function is to use the event of data load in this page to set the properties of facets, buttons and other controls.
		var oSelectedObject = this.getView().getModel().getProperty(oEvent.context.getPath());
		this.bDueBillingDateIsNotNull = (oSelectedObject.BillingRelevanceCode === null || typeof oSelectedObject.BillingRelevanceCode ===
			"undefined" || oSelectedObject.BillingRelevanceCode === "0") ? false : true;

		if ((oSelectedObject.BillingPlanUsageCategoryName === "4" || oSelectedObject.BillingPlanUsageCategoryName === this.oi18nModel.getText(
				"FIXED_PRICE")) && typeof oSelectedObject.BillingPlanUsageCategoryName !== "undefined") { // conditions to check for the hiding of T&E facet
			this.byId(
				"i2d.ps.projectbillingrequests1::sap.suite.ui.generic.template.ObjectPage.view.Details::C_ProjectBillingRequestTP--timeAndExpenseItemsFacetID::Section"
			).setVisible(false);
			this.sCurrentSectionId =
				"i2d.ps.projectbillingrequests1::sap.suite.ui.generic.template.ObjectPage.view.Details::C_ProjectBillingRequestTP--fixedPriceItemsFacetID::Section";

		} else if ((oSelectedObject.BillingPlanUsageCategoryName === "3" || oSelectedObject.BillingPlanUsageCategoryName === this.oi18nModel
				.getText(
					"TIME_AND_EXPENSE")) && typeof oSelectedObject.BillingPlanUsageCategoryName !== "undefined") { // conditions to check the hiding of fixed price facet
			this.byId(
				"i2d.ps.projectbillingrequests1::sap.suite.ui.generic.template.ObjectPage.view.Details::C_ProjectBillingRequestTP--fixedPriceItemsFacetID::Section"
			).setVisible(false);
			this.sCurrentSectionId =
				"i2d.ps.projectbillingrequests1::sap.suite.ui.generic.template.ObjectPage.view.Details::C_ProjectBillingRequestTP--timeAndExpenseItemsFacetID::Section";
		} else if (oSelectedObject.BillingPlanUsageCategoryName === "5" && typeof oSelectedObject.BillingPlanUsageCategoryName !==
			"undefined") {
			this.byId(
				"i2d.ps.projectbillingrequests1::sap.suite.ui.generic.template.ObjectPage.view.Details::C_ProjectBillingRequestTP--timeAndExpenseItemsFacetID::Section"
			).setVisible(true);
			this.byId(
				"i2d.ps.projectbillingrequests1::sap.suite.ui.generic.template.ObjectPage.view.Details::C_ProjectBillingRequestTP--fixedPriceItemsFacetID::Section"
			).setVisible(true);

			this.sCurrentSectionId =
				"i2d.ps.projectbillingrequests1::sap.suite.ui.generic.template.ObjectPage.view.Details::C_ProjectBillingRequestTP--objectPage";
		}
		//on account tab is hidden is the virtual field UtilitiesBillingReason is not "1" which means the billing request holds the on account utilised items
		if (String(oSelectedObject.UtilitiesBillingReason) !== "1") {
			this.byId(
				"i2d.ps.projectbillingrequests1::sap.suite.ui.generic.template.ObjectPage.view.Details::C_ProjectBillingRequestTP--prepaymentsFacetID::Section"
			).setVisible(false);
		}
		if (!oSelectedObject.ProjectBillingRequest.startsWith("S")) { // this check is to disable the buttons upon entry into this page (navigating back from create billing documents) if the Project Billing Request doesnot start with "S" (after submit)
			this.Core.byId(
				"i2d.ps.projectbillingrequests1::sap.suite.ui.generic.template.ObjectPage.view.Details::C_ProjectBillingRequestTP--ActionC_ProjectBillingRequestTPSections1button"
			).setEnabled(false);
			this.Core.byId(
				"i2d.ps.projectbillingrequests1::sap.suite.ui.generic.template.ObjectPage.view.Details::C_ProjectBillingRequestTP--ActionC_ProjectBillingRequestTPSections2button"
			).setEnabled(false);
			this.Core.byId(
				"i2d.ps.projectbillingrequests1::sap.suite.ui.generic.template.ObjectPage.view.Details::C_ProjectBillingRequestTP--ActionC_ProjectBillingRequestTPSections3button"
			).setEnabled(false);
			this.Core.byId(
				"i2d.ps.projectbillingrequests1::sap.suite.ui.generic.template.ObjectPage.view.Details::C_ProjectBillingRequestTP--ActionC_ProjectBillingRequestTPSections4button"
			).setEnabled(false);
			this.Core.byId(
				"i2d.ps.projectbillingrequests1::sap.suite.ui.generic.template.ObjectPage.view.Details::C_ProjectBillingRequestTP--ActionC_ProjectBillingRequestTPHeader1button"
			).setEnabled(false);
			this.Core.byId(
				"i2d.ps.projectbillingrequests1::sap.suite.ui.generic.template.ObjectPage.view.Details::C_ProjectBillingRequestTP--action::ActionC_ProjectBillingRequestTPHeader2button"
			).setVisible(false);
			//Hiding Edit and delete buttons on model refresh due to introduction of Update_mc and Delete_mc fields from framework
			this.Core.byId(
				"i2d.ps.projectbillingrequests1::sap.suite.ui.generic.template.ObjectPage.view.Details::C_ProjectBillingRequestTP--edit"
			).setVisible(false);
			this.Core.byId(
				"i2d.ps.projectbillingrequests1::sap.suite.ui.generic.template.ObjectPage.view.Details::C_ProjectBillingRequestTP--delete"
			).setVisible(false);
		} else { // else, if the reset the button visibilty based on the segmented button selected
			this.fnOnTEGridTableSegBtnChange();

		}

		this.fnonPageErrorHandle(oSelectedObject, null);

	},

	onBeforeRendering: function (oEvt) {
		this.Core.byId(
			"i2d.ps.projectbillingrequests1::sap.suite.ui.generic.template.ObjectPage.view.Details::C_ProjectBillingRequestTP--ActionC_ProjectBillingRequestTPHeader1button"
		).setType("Emphasized");
		this.Core.byId(
			"i2d.ps.projectbillingrequests1::sap.suite.ui.generic.template.ObjectPage.view.Details::C_ProjectBillingRequestTP--edit").setVisible(
			false);
	},

	onAfterRendering: function (oEvt) {
		this.oTEGridTable = this.Core.byId(
			"i2d.ps.projectbillingrequests1::sap.suite.ui.generic.template.ObjectPage.view.Details::C_ProjectBillingRequestTP--timeAndExpenseItemsFacetID::gridTable"
		);
		this.Core.byId(
			"i2d.ps.projectbillingrequests1::sap.suite.ui.generic.template.ObjectPage.view.Details::C_ProjectBillingRequestTP--delete").setVisible(
			false);
		this.Core.byId(
			"i2d.ps.projectbillingrequests1::sap.suite.ui.generic.template.ObjectPage.view.Details::C_ProjectBillingRequestTP--template:::ObjectPageTable:::SegmentedButton:::sFacet::timeAndExpenseItemsFacetID"
		).attachSelectionChange(this.fnOnTEGridTableSegBtnChange);

	},

	fnSetTableColumnWidth: function (oTable) {
		if (oTable !== undefined) {
			for (var i = 0; i < oTable.getColumns().length; i++) {
				oTable.getColumns()[i].setWidth("200px");
			}
		}
	},

	fnOnTEGridTableSegBtnChange: function (oEvt) {
		var Core = sap.ui.getCore(),
			oSegmenttedButtonSelectedKey = Core.byId(
				"i2d.ps.projectbillingrequests1::sap.suite.ui.generic.template.ObjectPage.view.Details::C_ProjectBillingRequestTP--template:::ObjectPageTable:::SegmentedButton:::sFacet::timeAndExpenseItemsFacetID"
			).getSelectedKey();
		Core.byId(
			"i2d.ps.projectbillingrequests1::sap.suite.ui.generic.template.ObjectPage.view.Details::C_ProjectBillingRequestTP--timeAndExpenseItemsFacetID::gridTable"
		).getPlugins()[0].clearSelection();
		//remove the edit and delete button in case of refresh of the object page
		if (Core.byId(
				"i2d.ps.projectbillingrequests1::sap.suite.ui.generic.template.ObjectPage.view.Details::C_ProjectBillingRequestTP--edit") !==
			undefined &&
			Core.byId(
				"i2d.ps.projectbillingrequests1::sap.suite.ui.generic.template.ObjectPage.view.Details::C_ProjectBillingRequestTP--delete") !==
			undefined) {
			Core.byId(
				"i2d.ps.projectbillingrequests1::sap.suite.ui.generic.template.ObjectPage.view.Details::C_ProjectBillingRequestTP--edit").setVisible(
				false);
			Core.byId(
				"i2d.ps.projectbillingrequests1::sap.suite.ui.generic.template.ObjectPage.view.Details::C_ProjectBillingRequestTP--delete").setVisible(
				false);
		}
		// case statements to  set the custom action buttons' visibilty	based on the segmented buttons visibilty
		switch (oSegmenttedButtonSelectedKey) {
		case "_tab0":
			Core.byId(
				"i2d.ps.projectbillingrequests1::sap.suite.ui.generic.template.ObjectPage.view.Details::C_ProjectBillingRequestTP--ActionC_ProjectBillingRequestTPSections1button"
			).setVisible(true);
			Core.byId(
				"i2d.ps.projectbillingrequests1::sap.suite.ui.generic.template.ObjectPage.view.Details::C_ProjectBillingRequestTP--ActionC_ProjectBillingRequestTPSections2button"
			).setVisible(true);
			Core.byId(
				"i2d.ps.projectbillingrequests1::sap.suite.ui.generic.template.ObjectPage.view.Details::C_ProjectBillingRequestTP--ActionC_ProjectBillingRequestTPSections3button"
			).setVisible(true);
			Core.byId(
				"i2d.ps.projectbillingrequests1::sap.suite.ui.generic.template.ObjectPage.view.Details::C_ProjectBillingRequestTP--ActionC_ProjectBillingRequestTPSections4button"
			).setVisible(false);
			break;
		case "_tab1":
			Core.byId(
				"i2d.ps.projectbillingrequests1::sap.suite.ui.generic.template.ObjectPage.view.Details::C_ProjectBillingRequestTP--ActionC_ProjectBillingRequestTPSections1button"
			).setVisible(false);
			Core.byId(
				"i2d.ps.projectbillingrequests1::sap.suite.ui.generic.template.ObjectPage.view.Details::C_ProjectBillingRequestTP--ActionC_ProjectBillingRequestTPSections2button"
			).setVisible(false);
			Core.byId(
				"i2d.ps.projectbillingrequests1::sap.suite.ui.generic.template.ObjectPage.view.Details::C_ProjectBillingRequestTP--ActionC_ProjectBillingRequestTPSections3button"
			).setVisible(false);
			Core.byId(
				"i2d.ps.projectbillingrequests1::sap.suite.ui.generic.template.ObjectPage.view.Details::C_ProjectBillingRequestTP--ActionC_ProjectBillingRequestTPSections4button"
			).setVisible(true);
			break;
		case "_tab2":
			Core.byId(
				"i2d.ps.projectbillingrequests1::sap.suite.ui.generic.template.ObjectPage.view.Details::C_ProjectBillingRequestTP--ActionC_ProjectBillingRequestTPSections1button"
			).setVisible(false);
			Core.byId(
				"i2d.ps.projectbillingrequests1::sap.suite.ui.generic.template.ObjectPage.view.Details::C_ProjectBillingRequestTP--ActionC_ProjectBillingRequestTPSections2button"
			).setVisible(false);
			Core.byId(
				"i2d.ps.projectbillingrequests1::sap.suite.ui.generic.template.ObjectPage.view.Details::C_ProjectBillingRequestTP--ActionC_ProjectBillingRequestTPSections3button"
			).setVisible(false);
			Core.byId(
				"i2d.ps.projectbillingrequests1::sap.suite.ui.generic.template.ObjectPage.view.Details::C_ProjectBillingRequestTP--ActionC_ProjectBillingRequestTPSections4button"
			).setVisible(true);
			break;

		}
	},

	fnBeforeRebindFixPriceTable: function (oEvent) {
		var that = this,
			oBindingParams = oEvent.getParameter("bindingParams");
		oBindingParams.parameters = oBindingParams.parameters || {};
		oBindingParams.filters.push(new sap.ui.model.Filter("ProjBillgElmntEntrSourceType", "EQ", "B"));
		//oBindingParams.filters.push(new sap.ui.model.Filter("BillingPlanBillingDate", "EQ", new Date()));
	},

	fnBeforeRebindPrepaymentsTable: function (oEvent) {
		var oBindingParams = oEvent.getParameter("bindingParams");
		oBindingParams.parameters = oBindingParams.parameters || {};
		oBindingParams.filters.push(new sap.ui.model.Filter("Material", "EQ", "A002"));
	},

	fnBeforeRebindTETable: function (oEvent) {
		var that = this;
		//var oTEGridTable = oEvent.getSource().getTable();
		var oBindingParams = oEvent.getParameter("bindingParams");
		oBindingParams.parameters = oBindingParams.parameters || {};
		oBindingParams.filters.push(new sap.ui.model.Filter("Material", "NE", "A002"));
		oBindingParams.filters.push(new sap.ui.model.Filter("ProjBillgElmntEntrSourceType", "NE", "B"));
		/*oBindingParams.events = {
			dataReceived: function () {
				that.fnGetColumnIndices(oTEGridTable);
				that.fnAttachChangeEvents(oTEGridTable);
			}
		};*/
		this.fnSetTableColumnWidth(that.oTEGridTable);
	},

	////////////////////////////////////////////////////////////////////////////////////////
	///////////////////// T&E TABLE UI BASED EDIT FUNCTIONS START BELOW ////////////////////
	////////////////////////////////////////////////////////////////////////////////////////

	/*
		
	fnGetColumnIndices: function (oTable) {
		var that = this;
		var aFields = ["ToBePostponedAmtInTransacCrcy", "ToBeWrittenOffAmtInTransCrcy", "ToBeBilledAmtInTransCrcy", "ToBePostponedQuantity",
			"ToBeWrittenOffQuantity", "ToBeBilledQuantity"
		];
		var aColumns = oTable.getColumns();
		that.mColoumMap.clear();
		for (var i = 0; i < aColumns.length; i++) {
			if (aFields.includes(aColumns[i].getFilterProperty())) {
				that.mColoumMap.set(aColumns[i].getFilterProperty(), i);
			}
		}
	},

	fnAttachChangeEvents: function (oTable) {
		var that = this,
			aFields = ["ToBePostponedAmtInTransacCrcy", "ToBeWrittenOffAmtInTransCrcy", "ToBeBilledAmtInTransCrcy", "ToBePostponedQuantity",
				"ToBeWrittenOffQuantity", "ToBeBilledQuantity"
			],
			aRows = oTable.getRows();
		for (var j = 0; j < aFields.length; j++) {
			var iColumnIndex = that.mColoumMap.get(aFields[j]);
			for (var i = 0; i < aRows.length; i++) {
				if (oTable.getRows()[i].getCells()[iColumnIndex].getAggregation("edit").hasAttachedChange === undefined) {
					oTable.getRows()[i].getCells()[iColumnIndex].getAggregation("edit").attachChange(that.fnOnCellValueChanged.bind(that));
					oTable.getRows()[i].getCells()[iColumnIndex].getAggregation("edit").hasAttachedChange = true;
				}
			}
		}
	},

	fnOnCellValueChanged: function (oEvent) {
		var that = this,
			sChangedField = oEvent.getSource().getDataProperty().typePath;
		switch (sChangedField) {
		case "ToBePostponedAmtInTransacCrcy":
			that.fnCostToBePostponedChanged(oEvent, oEvent.getSource().getValue(), oEvent.getSource().getProperty("value"));
			break;
		case "ToBeWrittenOffAmtInTransCrcy":
			that.fnCostToBeWrittenOffChanged(oEvent, oEvent.getSource().getValue(), oEvent.getSource().getProperty("value"));
			break;
		case "ToBePostponedQuantity":
			that.fnQtyToBePostponedChanged(oEvent, oEvent.getSource().getValue(), oEvent.getSource().getProperty("value"));
			break;
		case "ToBeWrittenOffQuantity":
			that.fnQtyToBeWrittenOffChanged(oEvent, oEvent.getSource().getValue(), oEvent.getSource().getProperty("value"));
			break;
		}
	},

	fnCostToBePostponedChanged: function (oEvent, sNewValue, sOldValue) {
		var oi18nModel = this.getOwnerComponent().getModel("i18n|sap.suite.ui.generic.template.ListReport|C_ProjectBillingRequestTP").getResourceBundle(),
			that = this,
			Core = sap.ui.getCore(),
			iNewToBeBilled = 0,
			sOldToBeBilled = 0,
			iDeltaToBeBilled = 0,
			iOldHeaderToBilled = 0,
			oChangedRowData = oEvent.getSource().getBindingContext().getModel().getProperty(oEvent.getSource().getBindingContext().sPath),
			oOpenCost = parseFloat(oEvent.getSource().getBindingContext().getModel().getProperty(oEvent.getSource().getBindingContext()
				.getPath() + "/OpenAmountInTransCrcy")),
			oWrittenOffCost = parseFloat(oEvent.getSource().getBindingContext().getModel().getProperty(oEvent.getSource().getBindingContext()
				.getPath() + "/ToBeWrittenOffAmtInTransCrcy")),
			oPostponedCost = parseFloat(oEvent.getSource().getBindingContext().getModel().getProperty(oEvent.getSource().getBindingContext()
				.getPath() + "/ToBePostponedAmtInTransacCrcy"));
		oEvent.getSource().getBindingContext().getModel().setProperty(oEvent.getSource().getBindingContext().getPath() +
			"/ToBeBilledAmtInTransCrcy", String(oOpenCost - oPostponedCost - oWrittenOffCost));
		var oNewToBeBilledCost = oEvent.getSource().getBindingContext().getModel().getProperty(oEvent.getSource().getBindingContext().getPath() +
			"/ToBeBilledAmtInTransCrcy");
		if (that.fnCheckRowCostValidation(oNewToBeBilledCost)) {
			Core.byId(
				"i2d.ps.projectbillingrequests1::sap.suite.ui.generic.template.ObjectPage.view.Details::C_ProjectBillingRequestTP--save"
			).setEnabled(true);
			if (parseInt(oChangedRowData.ToBeBilledQuantity, 10) === 0 || isNaN(parseInt(oChangedRowData.ToBeBilledQuantity, 10))) {

				iNewToBeBilled = (oChangedRowData.OpenAmountInProjectCurrency / oChangedRowData.OpenAmountInTransCrcy) * parseFloat(sNewValue.replace(
					/,/g, ''));
				sOldToBeBilled = oChangedRowData.BillableRevenueAmtInDocCrcy;
				iDeltaToBeBilled = iNewToBeBilled - sOldToBeBilled;
				iOldHeaderToBilled = Core.byId($("[id*='headerDataPointBillableRevenueID']")[0].id).getNumber();
				if (sap.ui.core.format.NumberFormat.getFloatInstance(Core.byId($("[id*='headerDataPointBillableRevenueID']")[0].id)).oFormatOptions.decimalSeparator ===
					".") {
					iOldHeaderToBilled = parseFloat(iOldHeaderToBilled.replace(",", ""));
				} else {
					iOldHeaderToBilled = parseFloat(iOldHeaderToBilled.replace(".", ""));
				}

				oEvent.getSource().getBindingContext().getModel().setProperty(oEvent.getSource().getBindingContext().getPath() +
					"/BillableRevenueAmtInDocCrcy", String(iNewToBeBilled));
				sap.ui.getCore().byId($("[id*='headerDataPointBillableRevenueID']")[0].id).setNumber(iOldHeaderToBilled + iDeltaToBeBilled);
			}
		} else {
			Core.byId(
				"i2d.ps.projectbillingrequests1::sap.suite.ui.generic.template.ObjectPage.view.Details::C_ProjectBillingRequestTP--save"
			).setEnabled(false);
			sap.m.MessageBox.error(
				oi18nModel.getText("COST_ERROR"), {}
			);
		}
	},

	fnCostToBeWrittenOffChanged: function (oEvent, sNewValue, sOldValue) {
		var oi18nModel = this.getOwnerComponent().getModel("i18n|sap.suite.ui.generic.template.ListReport|C_ProjectBillingRequestTP").getResourceBundle(),
			that = this,
			Core = sap.ui.getCore(),
			iNewToBeBilled = 0,
			sOldToBeBilled = 0,
			iDeltaToBeBilled = 0,
			iOldHeaderToBilled = 0,
			oChangedRowData = oEvent.getSource().getBindingContext().getModel().getProperty(oEvent.getSource().getBindingContext().sPath),
			oOpenCost = parseFloat(oEvent.getSource().getBindingContext().getModel().getProperty(oEvent.getSource().getBindingContext()
				.getPath() + "/OpenAmountInTransCrcy")),
			oWrittenOffCost = parseFloat(oEvent.getSource().getBindingContext().getModel().getProperty(oEvent.getSource().getBindingContext()
				.getPath() + "/ToBeWrittenOffAmtInTransCrcy")),
			oPostponedCost = parseFloat(oEvent.getSource().getBindingContext().getModel().getProperty(oEvent.getSource().getBindingContext()
				.getPath() + "/ToBePostponedAmtInTransacCrcy"));
		oEvent.getSource().getBindingContext().getModel().setProperty(oEvent.getSource().getBindingContext().getPath() +
			"/ToBeBilledAmtInTransCrcy", String(oOpenCost - oPostponedCost - oWrittenOffCost));
		var oNewToBeBilledCost = oEvent.getSource().getBindingContext().getModel().getProperty(oEvent.getSource().getBindingContext().getPath() +
			"/ToBeBilledAmtInTransCrcy");
		if (that.fnCheckRowCostValidation(oNewToBeBilledCost)) {
			Core.byId(
				"i2d.ps.projectbillingrequests1::sap.suite.ui.generic.template.ObjectPage.view.Details::C_ProjectBillingRequestTP--save"
			).setEnabled(true);
			if (parseInt(oChangedRowData.ToBeBilledQuantity, 10) === 0 || isNaN(parseInt(oChangedRowData.ToBeBilledQuantity, 10))) {

				iNewToBeBilled = (oChangedRowData.OpenAmountInProjectCurrency / oChangedRowData.OpenAmountInTransCrcy) * parseFloat(sNewValue.replace(
					/,/g, ''));
				sOldToBeBilled = oChangedRowData.BillableRevenueAmtInDocCrcy;
				iDeltaToBeBilled = iNewToBeBilled - sOldToBeBilled;
				iOldHeaderToBilled = Core.byId($("[id*='headerDataPointBillableRevenueID']")[0].id).getNumber();
				if (sap.ui.core.format.NumberFormat.getFloatInstance(Core.byId($("[id*='headerDataPointBillableRevenueID']")[0].id)).oFormatOptions.decimalSeparator ===
					".") {
					iOldHeaderToBilled = parseFloat(iOldHeaderToBilled.replace(",", ""));
				} else {
					iOldHeaderToBilled = parseFloat(iOldHeaderToBilled.replace(".", ""));
				}

				oEvent.getSource().getBindingContext().getModel().setProperty(oEvent.getSource().getBindingContext().getPath() +
					"/BillableRevenueAmtInDocCrcy", String(iNewToBeBilled));
				sap.ui.getCore().byId($("[id*='headerDataPointBillableRevenueID']")[0].id).setNumber(iOldHeaderToBilled + iDeltaToBeBilled);
			}
		} else {
			Core.byId(
				"i2d.ps.projectbillingrequests1::sap.suite.ui.generic.template.ObjectPage.view.Details::C_ProjectBillingRequestTP--save"
			).setEnabled(false);
			sap.m.MessageBox.error(
				oi18nModel.getText("COST_ERROR"), {}
			);
		}
	},

	fnQtyToBePostponedChanged: function (oEvent, sNewValue, sOldValue) {
		var oi18nModel = this.getOwnerComponent().getModel("i18n|sap.suite.ui.generic.template.ListReport|C_ProjectBillingRequestTP").getResourceBundle(),
			that = this,
			Core = sap.ui.getCore(),
			oChangedRowData = oEvent.getSource().getBindingContext().getModel().getProperty(oEvent.getSource().getBindingContext().sPath);
		oEvent.getSource().getBindingContext().getModel().setProperty(oEvent.getSource().getBindingContext().getPath() +
			"/ToBePostponedAmtInTransacCrcy", String((parseFloat(sNewValue.replace(/,/g, '')) * oChangedRowData.BaseUnitActualCost)));

		var oOpenQuantity = parseFloat(oEvent.getSource().getBindingContext().getModel().getProperty(oEvent.getSource().getBindingContext().getPath() +
				"/OpenQuantity")),
			oPostponedQuantity = parseFloat(oEvent.getSource().getBindingContext().getModel().getProperty(oEvent.getSource().getBindingContext().getPath() +
				"/ToBePostponedQuantity")),
			oWrittenOffQuantity = parseFloat(oEvent.getSource().getBindingContext().getModel().getProperty(oEvent.getSource().getBindingContext()
				.getPath() + "/ToBeWrittenOffQuantity")),
			oOpenCost = parseFloat(oEvent.getSource().getBindingContext().getModel().getProperty(oEvent.getSource().getBindingContext()
				.getPath() + "/OpenAmountInTransCrcy")),
			oWrittenOffCost = parseFloat(oEvent.getSource().getBindingContext().getModel().getProperty(oEvent.getSource().getBindingContext()
				.getPath() + "/ToBeWrittenOffAmtInTransCrcy")),
			oPostponedCost = parseFloat(oEvent.getSource().getBindingContext().getModel().getProperty(oEvent.getSource().getBindingContext()
				.getPath() + "/ToBePostponedAmtInTransacCrcy"));
		oEvent.getSource().getBindingContext().getModel().setProperty(oEvent.getSource().getBindingContext().getPath() +
			"/ToBeBilledQuantity", String(oOpenQuantity - oPostponedQuantity - oWrittenOffQuantity));
		var sNewValueofBilledQauntity = oEvent.getSource().getBindingContext().getModel().getProperty(oEvent.getSource().getBindingContext().getPath() +
			"/ToBeBilledQuantity");
		if (that.fnCheckRowQtyValidation(sNewValueofBilledQauntity)) {
			Core.byId(
				"i2d.ps.projectbillingrequests1::sap.suite.ui.generic.template.ObjectPage.view.Details::C_ProjectBillingRequestTP--save"
			).setEnabled(true);
			var iNewItemToBeBilled = parseFloat(sNewValueofBilledQauntity.replace(/,/g, "")) * parseFloat(oChangedRowData.NetPriceAmountInDocCrcy),
				iDeltaToBilled = iNewItemToBeBilled - parseFloat(oChangedRowData.BillableRevenueAmtInDocCrcy),
				//iNewItemCostToBeBilled = parseFloat(sNewValue.replace(/,/g, '')) * parseFloat(oChangedRowData.BaseUnitActualCost),
				sHeaderNumber = Core.byId($("[id*='headerDataPointBillableRevenueID']")[0].id).getNumber();
			if (sap.ui.core.format.NumberFormat.getFloatInstance(Core.byId($("[id*='headerDataPointBillableRevenueID']")[0].id)).oFormatOptions.decimalSeparator ===
				".") {
				sHeaderNumber = parseFloat(sHeaderNumber.replace(",", ""));
			} else {
				sHeaderNumber = parseFloat(sHeaderNumber.replace(".", ""));
			}
			Core.byId($("[id*='headerDataPointBillableRevenueID']")[0].id).setNumber(sHeaderNumber + iDeltaToBilled);
			oEvent.getSource().getBindingContext().getModel().setProperty(oEvent.getSource().getBindingContext().getPath() +
				"/BillableRevenueAmtInDocCrcy", String(iNewItemToBeBilled));
			oEvent.getSource().getBindingContext().getModel().setProperty(oEvent.getSource().getBindingContext().getPath() +
				"/ToBeBilledQuantity", String(oOpenQuantity - oPostponedQuantity - oWrittenOffQuantity));
			oEvent.getSource().getBindingContext().getModel().setProperty(oEvent.getSource().getBindingContext().getPath() +
				"/ToBeBilledAmtInTransCrcy", String(oOpenCost - oPostponedCost - oWrittenOffCost));
		} else {
			Core.byId(
				"i2d.ps.projectbillingrequests1::sap.suite.ui.generic.template.ObjectPage.view.Details::C_ProjectBillingRequestTP--save"
			).setEnabled(false);
			sap.m.MessageBox.error(
				oi18nModel.getText("QUANTITY_ERROR"), {}
			);
		}

	},

	fnQtyToBeWrittenOffChanged: function (oEvent, sNewValue, sOldValue) {
		var oi18nModel = this.getOwnerComponent().getModel("i18n|sap.suite.ui.generic.template.ListReport|C_ProjectBillingRequestTP").getResourceBundle(),
			that = this,
			Core = sap.ui.getCore(),
			oChangedRowData = oEvent.getSource().getBindingContext().getModel().getProperty(oEvent.getSource().getBindingContext().sPath);
		oEvent.getSource().getBindingContext().getModel().setProperty(oEvent.getSource().getBindingContext().getPath() +
			"/ToBeWrittenOffAmtInTransCrcy", String((parseFloat(sNewValue.replace(/,/g, '')) * oChangedRowData.BaseUnitActualCost)));

		var oOpenQuantity = parseFloat(oEvent.getSource().getBindingContext().getModel().getProperty(oEvent.getSource().getBindingContext().getPath() +
				"/OpenQuantity")),
			oPostponedQuantity = parseFloat(oEvent.getSource().getBindingContext().getModel().getProperty(oEvent.getSource().getBindingContext().getPath() +
				"/ToBePostponedQuantity")),
			oWrittenOffQuantity = parseFloat(oEvent.getSource().getBindingContext().getModel().getProperty(oEvent.getSource().getBindingContext()
				.getPath() + "/ToBeWrittenOffQuantity")),
			oOpenCost = parseFloat(oEvent.getSource().getBindingContext().getModel().getProperty(oEvent.getSource().getBindingContext()
				.getPath() + "/OpenAmountInTransCrcy")),
			oWrittenOffCost = parseFloat(oEvent.getSource().getBindingContext().getModel().getProperty(oEvent.getSource().getBindingContext()
				.getPath() + "/ToBeWrittenOffAmtInTransCrcy")),
			oPostponedCost = parseFloat(oEvent.getSource().getBindingContext().getModel().getProperty(oEvent.getSource().getBindingContext()
				.getPath() + "/ToBePostponedAmtInTransacCrcy"));
		oEvent.getSource().getBindingContext().getModel().setProperty(oEvent.getSource().getBindingContext().getPath() +
			"/ToBeBilledQuantity", String(oOpenQuantity - oPostponedQuantity - oWrittenOffQuantity));
		var sNewValueofBilledQauntity = oEvent.getSource().getBindingContext().getModel().getProperty(oEvent.getSource().getBindingContext().getPath() +
			"/ToBeBilledQuantity");
		if (that.fnCheckRowQtyValidation(sNewValueofBilledQauntity)) {
			Core.byId(
				"i2d.ps.projectbillingrequests1::sap.suite.ui.generic.template.ObjectPage.view.Details::C_ProjectBillingRequestTP--save"
			).setEnabled(true);
			var iNewItemToBeBilled = parseFloat(sNewValueofBilledQauntity.replace(/,/g, "")) * parseFloat(oChangedRowData.NetPriceAmountInDocCrcy),
				iDeltaToBilled = iNewItemToBeBilled - parseFloat(oChangedRowData.BillableRevenueAmtInDocCrcy),
				//iNewItemCostToBeBilled = parseFloat(sNewValue.replace(/,/g, '')) * parseFloat(oChangedRowData.BaseUnitActualCost),
				sHeaderNumber = Core.byId($("[id*='headerDataPointBillableRevenueID']")[0].id).getNumber();
			if (sap.ui.core.format.NumberFormat.getFloatInstance(Core.byId($("[id*='headerDataPointBillableRevenueID']")[0].id)).oFormatOptions.decimalSeparator ===
				".") {
				sHeaderNumber = parseFloat(sHeaderNumber.replace(",", ""));
			} else {
				sHeaderNumber = parseFloat(sHeaderNumber.replace(".", ""));
			}
			Core.byId($("[id*='headerDataPointBillableRevenueID']")[0].id).setNumber(sHeaderNumber + iDeltaToBilled);
			oEvent.getSource().getBindingContext().getModel().setProperty(oEvent.getSource().getBindingContext().getPath() +
				"/BillableRevenueAmtInDocCrcy", String(iNewItemToBeBilled));
			oEvent.getSource().getBindingContext().getModel().setProperty(oEvent.getSource().getBindingContext().getPath() +
				"/ToBeBilledQuantity", String(oOpenQuantity - oPostponedQuantity - oWrittenOffQuantity));
			oEvent.getSource().getBindingContext().getModel().setProperty(oEvent.getSource().getBindingContext().getPath() +
				"/ToBeBilledAmtInTransCrcy", String(oOpenCost - oPostponedCost - oWrittenOffCost));
		} else {
			Core.byId(
				"i2d.ps.projectbillingrequests1::sap.suite.ui.generic.template.ObjectPage.view.Details::C_ProjectBillingRequestTP--save"
			).setEnabled(false);
			sap.m.MessageBox.error(
				oi18nModel.getText("QUANTITY_ERROR"), {}
			);
		}

	},

	fnCheckRowCostValidation: function (oRowObject) {
		if (parseFloat(oRowObject) < 0) {
			return false;
		} else {
			return true;
		}
	},

	fnCheckRowQtyValidation: function (oRowObject) {

		if (parseFloat(oRowObject) < 0) {
			return false;
		} else {
			return true;
		}
	},*/

	///////////////////// T&E TABLE EDIT FUNCTIONS END HERE /////////////////////

	// formatter function for T&E table custom columns for sales and cost rate
	fnGetFormattedRates: function (sValue, sCurrCode, sOpenQuantity) {
		var sCurrencyFormat = sap.ui.core.format.NumberFormat.getCurrencyInstance({
				showMeasure: false,
				currencyCode: true,
				currencyContext: 'standard'
			}),
			formattedRate = " ";
		if (sOpenQuantity !== null && sOpenQuantity !== undefined && parseFloat(sOpenQuantity) !== 0) {
			if (sValue !== null && sValue !== undefined && sValue !== " ") {
				if (sCurrCode !== null && sCurrCode !== undefined) {
					formattedRate = String(sCurrencyFormat.format(sValue, sCurrCode)) + " " + String(sCurrCode);
				} else {
					formattedRate = sCurrencyFormat.format(sValue, sCurrCode);
				}
			}
		} else {
			return formattedRate;
		}
		return formattedRate;
	},

	fnGetFormattedSalesDocument: function (sSalesDocument, sItem) {
		return this.oi18nModel.getText("SALESDOC_ITEM", [sSalesDocument, sItem]);
	},

	fnGetFormattedJournalEntry: function (sAccountingDocument, sItem, sFiscalYear) {
		return this.oi18nModel.getText("JE_ITEM_FY", [sAccountingDocument, sItem, sFiscalYear]);
	},

	fnGetPrepaymentType: function (sMaterial) {
		var sType;
		if (sMaterial === "A002") {
			sType = this.oi18nModel.getText("ON_ACCOUNT");
		} else {
			sType = "";
		}
		return sType;
	},

	fnGetToBeSettledAmount: function (sValue, sCurrency) {
		var sToBeSettledAmount;
		if (sValue !== null && sValue !== undefined) {
			sToBeSettledAmount = String(parseFloat(parseFloat(sValue, 10) * 1).toFixed(2), 10) + " " + sCurrency;
		} else {
			sToBeSettledAmount = " ";
		}
		return sToBeSettledAmount;
	},

	fnGetReceivedPaymentAmount: function (sValue, sCurrency) {
		var sReceivedPaymentAmount;
		if (sValue !== null && sValue !== undefined) {
			sReceivedPaymentAmount = String(parseFloat(sValue, 10).toFixed(2)) + " " + sCurrency;
		} else {
			sReceivedPaymentAmount = " ";
		}
		return sReceivedPaymentAmount;
	},

	/////////////////////////////////////////////////////////////////////

	//////////////////////////////////////////////////////////////////////
	////////////////////	ACTION HANDLERS	BELOW	//////////////////////
	//////////////////////////////////////////////////////////////////////

	//Delete Action
	fnOnDeleteButtonClick: function (oEvent) {
		var that = this,
			oModel = this.getView().getModel(),
			oProjectBillingRequest = oModel.getProperty(oEvent.getSource().getBindingContext().sPath).ProjectBillingRequest,
			oProjectBillingRequestUUID = oModel.getProperty(oEvent.getSource().getBindingContext().sPath).ProjectBillingRequestUUID,
			oDialog = new sap.m.Dialog({
				title: this.oi18nModel.getText("DELETE_PBR_TIT"),
				icon: "sap-icon://question-mark",
				//contentWidth: "25%",
				resizable: true,
				draggable: true,
				content: [new sap.m.Text({
					text: this.oi18nModel.getText("CONFIRM_DELETE_MESSAGE", [oProjectBillingRequest])
				}).addStyleClass("sapUiSmallMargin")],
				beginButton: new sap.m.Button({
					text: this.oi18nModel.getText("DELETE"),
					press: function (oEventPress) {
						that.fnDeleteAction(oProjectBillingRequest, oProjectBillingRequestUUID, oModel);
						oDialog.destroy();
					}
				}),
				endButton: new sap.m.Button({
					text: this.oi18nModel.getText("CANCEL"),
					press: function (oEventError) {
						oDialog.destroy();
					}
				}),
				afterClose: function () {
					oDialog.destroy();
				}
			});
		oDialog.open();
	},

	//Action on confirmation of delete
	fnDeleteAction: function (oProjectBillingRequest, oProjectBillingRequestUUID, oModel) {
		var that = this;
		oModel.create("/DeleteProjectBillingRequest", {}, {
			urlParameters: {
				ProjectBillingRequestUUID: "guid'" + oProjectBillingRequestUUID + "'"
			},
			success: jQuery.proxy(function (oReceivedData) {
				sap.m.MessageToast.show(that.oi18nModel.getText("DELETE_SUCCESSS_MESSAGE", [oProjectBillingRequest]));
				var oCrossAppNavigator = sap.ushell.Container.getService("CrossApplicationNavigation");
				oCrossAppNavigator.backToPreviousApp();
			}, this),
			error: jQuery.proxy(function (oDataResponse) {
				sap.m.MessageBox.error(
					that.oi18nModel.getText("ERROR_DELETE_ACTION"), {}
				);
			}, this)
		});
	},

	fnOnSubmitButtonClick: function (oEvt) {
		var that = this,
			oSubmittedeModel = this.getView().getModel(),
			oProjectBillingRequestUUID = oSubmittedeModel.getProperty(oEvt.getSource().getBindingContext().sPath).ProjectBillingRequestUUID;
		// check to see if due billing date is null or if on account case in effect if the due billing date is not null. 
		// billingplanitemusage is "1" only on case where there is on account component only
		if (this.bDueBillingDateIsNotNull) {
			this.Core.byId(
				"i2d.ps.projectbillingrequests1::sap.suite.ui.generic.template.ObjectPage.view.Details::C_ProjectBillingRequestTP--ActionC_ProjectBillingRequestTPSections1button"
			).setEnabled(false);
			this.Core.byId(
				"i2d.ps.projectbillingrequests1::sap.suite.ui.generic.template.ObjectPage.view.Details::C_ProjectBillingRequestTP--ActionC_ProjectBillingRequestTPSections2button"
			).setEnabled(false);
			this.Core.byId(
				"i2d.ps.projectbillingrequests1::sap.suite.ui.generic.template.ObjectPage.view.Details::C_ProjectBillingRequestTP--ActionC_ProjectBillingRequestTPSections3button"
			).setEnabled(false);
			this.Core.byId(
				"i2d.ps.projectbillingrequests1::sap.suite.ui.generic.template.ObjectPage.view.Details::C_ProjectBillingRequestTP--ActionC_ProjectBillingRequestTPSections4button"
			).setEnabled(false);
			this.Core.byId(
				"i2d.ps.projectbillingrequests1::sap.suite.ui.generic.template.ObjectPage.view.Details::C_ProjectBillingRequestTP--ActionC_ProjectBillingRequestTPHeader1button"
			).setEnabled(false);
			if (this.sCurrentSectionId !== "") {
				this.Core.byId(this.sCurrentSectionId).setBusy(true);
			}
			oSubmittedeModel.create("/CreateBillingDocumentRequest", {}, {
				urlParameters: {
					ProjectBillingRequestUUID: "guid'" + oProjectBillingRequestUUID + "'"
				},
				success: jQuery.proxy(function (oReceivedData, oResponse) {
						if (oReceivedData.results[0] !== undefined && oReceivedData.results[0].BillingDocumentRequest !==
							null && oReceivedData.results[0]
							.BillingDocumentRequest !== undefined) {
							that.fnGetBDRNumber(oReceivedData.results[0].PrecedingDocument, oSubmittedeModel);
						} else {
							sap.m.MessageToast.show(this.oi18nModel.getText("SUCCESS_CALL_FOR_CREATE_BDR"));
							that.Core.byId(
								"i2d.ps.projectbillingrequests1::sap.suite.ui.generic.template.ObjectPage.view.Details::C_ProjectBillingRequestTP--action::ActionC_ProjectBillingRequestTPHeader2button"
							).setVisible(false);
						}
						if (that.sCurrentSectionId !== "") {
							this.Core.byId(that.sCurrentSectionId).setBusy(false);
						}
					},
					this),
				error: jQuery.proxy(function (oDataResponse) {
					var aXMLParsedResponse = new DOMParser().parseFromString(oDataResponse.responseText, "text/xml").getElementsByTagName("code");
					this.Core.byId(
						"i2d.ps.projectbillingrequests1::sap.suite.ui.generic.template.ObjectPage.view.Details::C_ProjectBillingRequestTP--ActionC_ProjectBillingRequestTPSections1button"
					).setEnabled(true);
					this.Core.byId(
						"i2d.ps.projectbillingrequests1::sap.suite.ui.generic.template.ObjectPage.view.Details::C_ProjectBillingRequestTP--ActionC_ProjectBillingRequestTPSections2button"
					).setEnabled(true);
					this.Core.byId(
						"i2d.ps.projectbillingrequests1::sap.suite.ui.generic.template.ObjectPage.view.Details::C_ProjectBillingRequestTP--ActionC_ProjectBillingRequestTPSections3button"
					).setEnabled(true);
					this.Core.byId(
						"i2d.ps.projectbillingrequests1::sap.suite.ui.generic.template.ObjectPage.view.Details::C_ProjectBillingRequestTP--ActionC_ProjectBillingRequestTPSections4button"
					).setEnabled(true);
					this.Core.byId(
						"i2d.ps.projectbillingrequests1::sap.suite.ui.generic.template.ObjectPage.view.Details::C_ProjectBillingRequestTP--ActionC_ProjectBillingRequestTPHeader1button"
					).setEnabled(true);
					if (that.sCurrentSectionId !== "") {
						this.Core.byId(that.sCurrentSectionId).setBusy(false);
					}
					if ((aXMLParsedResponse === undefined) || (aXMLParsedResponse === null) || (aXMLParsedResponse.length === 0)) {
						// check is done to bring out schedule repricing dialog upon encountering a specific error code
						if (oDataResponse.responseText.startsWith("{")) {
							if (JSON.parse(oDataResponse.responseText).error.code === "PROJ_BILLG_ELMNT/210") {
								that.fnGetScheduleRepricingDialog(JSON.parse(oDataResponse.responseText).error.message.value);
							} else {
								that.fnToDisplayErrorMessagesFromSubmitAction(oDataResponse);
							}
						} else {
							//for a weird OPA behavior workaround
							sap.m.MessageBox.error(oDataResponse.responseText, {});
						}
					} else {
						sap.m.MessageBox.error(
							aXMLParsedResponse[0].innerHTML, {}
						);
					}
				}, this)
			});
		} else {
			sap.m.MessageBox.error(
				this.oi18nModel.getText("ERROR_CALL_FOR_SUBMIT_NODUE"), {}
			);
		}
	},

	fnToDisplayErrorMessagesFromSubmitAction: function (oDataResponse) {
		if (JSON.parse(oDataResponse.responseText).error !== undefined) {
			this.fnonPageErrorHandle(null, oDataResponse);
		} else {
			this.fnonPageErrorHandle(null, this.oi18nModel.getText("ERROR_CALL_FOR_SUBMIT"));
		}
	},

	fnGetScheduleRepricingDialog: function (sMessage) {
		var that = this,
			oScheduleRepricingDialog = new sap.m.Dialog({
				title: this.oi18nModel.getText("ERROR"),
				draggable: true,
				type: "Message",
				state: "Error",
				content: [new sap.m.VBox({
					items: [new sap.m.Text({
							text: sMessage
						}).addStyleClass("sapUiTinyMarginBottom"),
						new sap.m.Text({
							text: this.oi18nModel.getText("SCHEDULE_REPRICING_PROMPT")
						}).addStyleClass("sapUiTinyMarginBottom"),
						new sap.m.Link("scheduleRepricingLinkID", {
							text: this.oi18nModel.getText("SCHDULE_REPRICING_APP_LINK_TEXT"),
							press: function (oNavEvt) {
								var sMsgText = this.oi18nModel.getText("OUTBOUND_NAV_TO_SCHD_REPRICE_APP_ERR_MSG"),
									oNavigationHandler = new sap.ui.generic.app.navigation.service.NavigationHandler(that),
									oSelectionVariant = new sap.ui.generic.app.navigation.service.SelectionVariant(),
									fnOnError = function (oError) {
										var oDialoglet = new sap.m.Dialog({
											title: this.oi18nModel.getText("ERR_NAV"),
											state: "Error",
											draggable: true,
											content: new sap.m.Text({
												text: sMsgText
											}),
											endButton: new sap.m.Button({
												text: this.oi18nModel.getText("CLOSE"),
												press: function (oEventError) {
													oEventError.getSource().getParent().close();
												}
											}),
											afterClose: function () {
												oDialoglet.destroy();
											}
										});
										oDialoglet.addStyleClass("sapUiPopupWithPadding");
										oDialoglet.open();
									};
								oSelectionVariant.addSelectOption("JobCatalogEntryName", "I", "EQ", "PROJ_BILLG_MASS_PRCG_UPDATE");
								oNavigationHandler.navigate("ProjectBillingRequest", "scheduleRepricing", oSelectionVariant.toJSONString(), {},
									fnOnError, {
										selectionVariant: oSelectionVariant.toJSONString()
									});
							}
						})
					]
				})],
				beginButton: new sap.m.Button({
					text: this.oi18nModel.getText("BACK"),
					press: function (oOKEvt) {
						oScheduleRepricingDialog.close();
						var oCrossAppNavigator = sap.ushell.Container.getService("CrossApplicationNavigation");
						oCrossAppNavigator.backToPreviousApp();
					}
				}),
				afterClose: function () {
					oScheduleRepricingDialog.destroy();
				}
			}).addStyleClass("sapUiPopupWithPadding");
		oScheduleRepricingDialog.open();
	},

	fnGetBDRNumber: function (oPrecedingDocument, oSubmittedModel) {
		var that = this;
		oSubmittedModel.read("/C_ProjectBillgElmntEntrFlwTP", {
			success: function (oReceivedData, oResponse) {
				var bBDRCheck = (oReceivedData.results[0] !== undefined && oReceivedData.results[0] !== "" &&
						oReceivedData.results[0] !== null) && (oReceivedData.results[0].BillingDocument !== undefined && oReceivedData.results[0].BillingDocument !==
						"" && oReceivedData.results[0].BillingDocument !== null),
					aUniqueBDRs = [],
					sListOfBDRCreated = "";
				// this is done to pick up unique values of BDR to another array
				oReceivedData.results.forEach(function (e) {
					if (!aUniqueBDRs.includes(e.BillingDocument)) {
						aUniqueBDRs.push(e.BillingDocument);
					}
				});
				//once the unique BDR is in an array, we display that here
				aUniqueBDRs.forEach(function (each) {
					if (sListOfBDRCreated.length) {
						sListOfBDRCreated = sListOfBDRCreated + ", " + each;
					} else {
						sListOfBDRCreated = sListOfBDRCreated + each;
					}
				});
				if (bBDRCheck) {
					var oCrossAppNav = new sap.ushell.Container.getService("CrossApplicationNavigation"),
						aPreliminaryCreateIntent = [{
							target: {
								semanticObject: "PrelimBillingDocument",
								action: "create"
							}
						}],
						aCreateIntent = [{
							target: {
								semanticObject: "BillingDocument",
								action: "create"
							}
						}];

					oCrossAppNav.isNavigationSupported(aPreliminaryCreateIntent).done(function (aResponses) {
						that.Core.byId("PrelimCBDRLink").setEnabled(aResponses[0].supported);
					});
					oCrossAppNav.isNavigationSupported(aCreateIntent).done(function (aResponses) {
						that.Core.byId("BillDocReqLink").setEnabled(aResponses[0].supported);
					});
					var oDialog = new sap.m.Dialog({
						title: this.oi18nModel.getText("SUCCESS"),
						draggable: true,
						type: "Message",
						content: [new sap.m.VBox({
							items: [new sap.m.Text({
									text: this.oi18nModel.getText("SUCCESS_CALL_FOR_CREATE_BDR_PARA", [sListOfBDRCreated])
								}).addStyleClass("sapUiTinyMarginBottom"),
								new sap.m.Link("PrelimCBDRLink", {
									text: this.oi18nModel.getText("NAV_TO_PRELIM_CBDR_APP"),
									press: function (oEvent) {
										var sMsgText = that.oi18nModel.getText("OUTBOUND_NAV_TO_PRELIM_CBDR_APP_ERR_MSG"),
											oNavigationHandler = new sap.ui.generic.app.navigation.service.NavigationHandler(that),
											oSelectionVariant = new sap.ui.generic.app.navigation.service.SelectionVariant(),
											fnOnError = function (oError) {
												var oDialoglet = new sap.m.Dialog({
													title: that.oi18nModel.getText("ERR_NAV"),
													state: "Error",
													draggable: true,
													content: new sap.m.Text({
														text: sMsgText
													}),
													endButton: new sap.m.Button({
														text: that.oi18nModel.getText("CLOSE"),
														press: function (oEventError) {
															oEventError.getSource().getParent().close();
														}
													}),
													afterClose: function () {
														oDialoglet.destroy();
													}
												});
												oDialoglet.addStyleClass("sapUiPopupWithPadding");
												oDialoglet.open();
											};
										oSelectionVariant.addSelectOption("ReferenceSDDocument", "I", "EQ", oReceivedData.results[0].BillingDocument);
										oNavigationHandler.navigate("PrelimBillingDocument", "create", oSelectionVariant.toJSONString(), {}, fnOnError, {
											selectionVariant: oSelectionVariant.toJSONString()
										});
									}
								}).addStyleClass("sapUiTinyMarginBottom"),
								new sap.m.Link("BillDocReqLink", {
									text: this.oi18nModel.getText("NAV_TO_CBDR_APP"),
									press: function (oEvent) {
										var sMsgText = that.oi18nModel.getText("OUTBOUND_NAV_TO_CBDR_APP_ERR_MSG"),
											oNavigationHandler = new sap.ui.generic.app.navigation.service.NavigationHandler(that),
											oSelectionVariant = new sap.ui.generic.app.navigation.service.SelectionVariant(),
											fnOnError = function (oError) {
												var oDialoglet = new sap.m.Dialog({
													title: that.oi18nModel.getText("ERR_NAV"),
													state: "Error",
													draggable: true,
													content: new sap.m.Text({
														text: sMsgText
													}),
													endButton: new sap.m.Button({
														text: that.oi18nModel.getText("CLOSE"),
														press: function (oEventError) {
															oEventError.getSource().getParent().close();
														}
													}),
													afterClose: function () {
														oDialoglet.destroy();
													}
												});
												oDialoglet.addStyleClass("sapUiPopupWithPadding");
												oDialoglet.open();
											};
										oSelectionVariant.addSelectOption("ReferenceSDDocument", "I", "EQ", oReceivedData.results[0].BillingDocument);
										oNavigationHandler.navigate("BillingDocument", "create", oSelectionVariant.toJSONString(), {}, fnOnError, {
											selectionVariant: oSelectionVariant.toJSONString()
										});
									}
								}).addStyleClass("sapUiTinyMarginBottom")
							]
						})],
						beginButton: new sap.m.Button({
							text: this.oi18nModel.getText("OK"),
							type: "Emphasized",
							press: function (oOKEvt) {
								oDialog.close();
								var oCrossAppNavigator = sap.ushell.Container.getService("CrossApplicationNavigation");
								oCrossAppNavigator.backToPreviousApp();
							}
						}),
						afterClose: function () {
							oDialog.destroy();
						}
					}).addStyleClass("sapUiPopupWithPadding");
					oDialog.open();
				} else {
					this.Core.byId(
						"i2d.ps.projectbillingrequests1::sap.suite.ui.generic.template.ObjectPage.view.Details::C_ProjectBillingRequestTP--ActionC_ProjectBillingRequestTPSections1button"
					).setEnabled(true);
					this.Core.byId(
						"i2d.ps.projectbillingrequests1::sap.suite.ui.generic.template.ObjectPage.view.Details::C_ProjectBillingRequestTP--ActionC_ProjectBillingRequestTPSections2button"
					).setEnabled(false);
					this.Core.byId(
						"i2d.ps.projectbillingrequests1::sap.suite.ui.generic.template.ObjectPage.view.Details::C_ProjectBillingRequestTP--ActionC_ProjectBillingRequestTPSections3button"
					).setEnabled(false);
					this.Core.byId(
						"i2d.ps.projectbillingrequests1::sap.suite.ui.generic.template.ObjectPage.view.Details::C_ProjectBillingRequestTP--ActionC_ProjectBillingRequestTPSections4button"
					).setEnabled(false);
					this.Core.byId(
						"i2d.ps.projectbillingrequests1::sap.suite.ui.generic.template.ObjectPage.view.Details::C_ProjectBillingRequestTP--ActionC_ProjectBillingRequestTPHeader1button"
					).setEnabled(false);
					sap.m.MessageBox.success(
						this.oi18nModel.getText("SUCCESS_CALL_FOR_SAVED_BDR"), {
							onClose: function (oCloseEvt) {
								var oCrossAppNavigator = sap.ushell.Container.getService("CrossApplicationNavigation");
								oCrossAppNavigator.backToPreviousApp();
							}
						}
					);
				}
			}.bind(this),
			urlParameters: {
				"$filter": "PrecedingDocument eq " + "\'" + oPrecedingDocument + "\'",
				"$select": "BillingDocument"
			}
		});
	},

	//T&E table actions comes here
	fnOnClickRestrictDateAction: function (oEvt) {
		var dToday = new Date(),
			that = this,
			oRestrictDateModel = this.getView().getModel(),
			oProjectBillingRequestUUID = oRestrictDateModel.getProperty(oEvt.getSource().getBindingContext().sPath).ProjectBillingRequestUUID,
			oDateTimeFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
				pattern: "yyyy-MM-dd'T'HH:mm:ss"
			}),
			oCurrentDate = new Date(),
			oPrevDateLastMonth = new Date(oCurrentDate.getFullYear(), oCurrentDate.getMonth());
		oPrevDateLastMonth = new Date(oPrevDateLastMonth - 1);
		var oDialog = new sap.m.Dialog({
			title: this.oi18nModel.getText("RESTRICT_DATE"),
			draggable: true,
			type: "Message",
			content: [new sap.m.Label("restrictDateDescID", {
					text: this.oi18nModel.getText("RESTRICT_DATE_DIALOG_DESC"),
					labelFor: "radioButton2ID"
				}),
				new sap.m.VBox({
					items: [
						new sap.m.RadioButton({
							id: "radioButton2ID",
							text: this.oi18nModel.getText("UNTIL_LAST_DAY_PREVIOUS_MONTH"),
							tooltip: this.oi18nModel.getText("UNTIL_LAST_DAY_PREVIOUS_MONTH"),
							select: function (oToggleSelectEvt) {},
							selected: true
						}).addStyleClass("sapUiTinyMarginTop"),
						new sap.m.RadioButton({
							id: "radioButton3ID",
							text: this.oi18nModel.getText("UNTIL_SPECIFIC_DATE"),
							tooltip: this.oi18nModel.getText("UNTIL_SPECIFIC_DATE"),
							select: function (oToggleSelectEvt) {
								if (oToggleSelectEvt.getParameter("selected")) {
									that.Core.byId("restrictDatePicker").setEnabled(true);
								} else {
									that.Core.byId("restrictDatePicker").setEnabled(false);
									that.Core.byId("restrictDatePicker").setValueState("None");
								}
							},
							selected: false
						}).addStyleClass("sapUiTinyMarginTop")
					]
				}),
				new sap.m.DatePicker({
					id: "restrictDatePicker",
					enabled: false,
					maxDate: dToday,
					width: "200px"
				}).addStyleClass("sapUiTinyMarginTop sapUiMediumMarginBottom sapUiMediumMarginBegin").attachChange(function (e) {
					if (that.Core.byId("restrictDatePicker").getValue().length) {
						that.Core.byId("restrictDatePicker").setValueState("None");
					}
				})
			],
			beginButton: new sap.m.Button({
				text: this.oi18nModel.getText("RESTRICT"),
				type: "Emphasized",
				press: function (oOKEvt) {
					var oDialogItems = oOKEvt.getSource().getParent().getContent()[1].getAggregation("items");
					var sSelectedIndex, dDateToBeRestricted;
					for (var i = 0; i < oDialogItems.length; i++) {
						if (oDialogItems[i].getProperty("selected") === true) {
							sSelectedIndex = i;
						}
					}
					if (sSelectedIndex === 0) {
						//dDateToBeRestricted = String(oPrevDateLastMonth.getFullYear()) + String(oPrevDateLastMonth.getMonth() + 1) + String(oPrevDateLastMonth.getDate());
						dDateToBeRestricted = oDateTimeFormat.format(oPrevDateLastMonth);
					} else {
						dDateToBeRestricted = oDateTimeFormat.format(that.Core.byId("restrictDatePicker").getDateValue());
					}
					if (dDateToBeRestricted.length && that.Core.byId("restrictDatePicker").isValidValue()) {
						oRestrictDateModel.create("/PostponeByDate", {}, {
							urlParameters: {
								ServicesRenderedDate: "datetime'" + dDateToBeRestricted + "'",
								ProjectBillingRequestUUID: "guid'" + oProjectBillingRequestUUID + "'"
							},
							success: jQuery.proxy(function (oReceivedData) {
								that.Core.byId(
									"i2d.ps.projectbillingrequests1::sap.suite.ui.generic.template.ObjectPage.view.Details::C_ProjectBillingRequestTP--timeAndExpenseItemsFacetID::Section"
								).getModel().refresh(true);
								//Hiding Edit and delete buttons on model refresh due to introduction of Update_mc and Delete_mc fields from framework
								that.Core.byId(
									"i2d.ps.projectbillingrequests1::sap.suite.ui.generic.template.ObjectPage.view.Details::C_ProjectBillingRequestTP--edit"
								).setVisible(false);
								that.Core.byId(
									"i2d.ps.projectbillingrequests1::sap.suite.ui.generic.template.ObjectPage.view.Details::C_ProjectBillingRequestTP--delete"
								).setVisible(false);
								sap.m.MessageToast.show(that.oi18nModel.getText("SUCCESS_CALL_FOR_RESTRICT"));
							}, this),
							error: jQuery.proxy(function (oDataResponse) {
								sap.m.MessageBox.error(
									that.oi18nModel.getText("ERROR_CALL_FOR_RESTRICT"), {}
								);
							}, this)
						});
						oDialog.close();
					} else {
						that.Core.byId("restrictDatePicker").setValueState("Error");
					}
				}
			}),
			endButton: new sap.m.Button({
				text: this.oi18nModel.getText("CANCEL"),
				press: function () {
					oDialog.close();
				}
			}),
			afterClose: function () {
				oDialog.destroy();
			}
		}).addStyleClass("sapUiPopupWithPadding");
		oDialog.open();
	},

	fnOnClickPostponeAction: function (oEvent) {
		this.fnOnExecuteTETableActions(oEvent, oEvent.getSource().getText(), "PostponeProjBillgReqItem");
	},

	fnOnClickWriteOffAction: function (oEvent) {
		this.fnOnExecuteTETableActions(oEvent, oEvent.getSource().getText(), "WriteOffProjBillgReqItem");
	},

	fnOnClickReincludeAction: function (oEvent) {
		this.fnOnExecuteTETableActions(oEvent, oEvent.getSource().getText(), "ResetBillableValue");
	},

	fnOnExecuteTETableActions: function (oEvt, oBtnClicked, fnToBeCalled) {
			var oModel = this.getView().getModel(),
				that = this,
				oTEGridTable = this.Core.byId(
					"i2d.ps.projectbillingrequests1::sap.suite.ui.generic.template.ObjectPage.view.Details::C_ProjectBillingRequestTP--timeAndExpenseItemsFacetID::gridTable"
				),

				aProjectBillingRequestItemUUID = [];
			//	oTEGridTableData = oTEGridTable.getRows()[0].getBindingContext().getModel().oData;

			oTEGridTable.getPlugins()[0].getSelectedIndices().forEach(function (each) {
				aProjectBillingRequestItemUUID.push(oTEGridTable.getContextByIndex(each).sPath.replace("/C_ProjectBillingRequestItemTP(", "").replace(
					")", ""));
			});
			//to set busy so that we show show that the action is taking place
			oTEGridTable.getModel().attachBatchRequestSent(function (oBusyEvt) {
				that.Core.byId(
					"i2d.ps.projectbillingrequests1::sap.suite.ui.generic.template.ObjectPage.view.Details::C_ProjectBillingRequestTP--timeAndExpenseItemsFacetID::Section"
				).setBusy(true);
			});
			oTEGridTable.getModel().attachBatchRequestCompleted(function (oBusyEvt) {
				that.Core.byId(
					"i2d.ps.projectbillingrequests1::sap.suite.ui.generic.template.ObjectPage.view.Details::C_ProjectBillingRequestTP--timeAndExpenseItemsFacetID::Section"
				).setBusy(false);
			});
			var oDialogTitle, oDialogContentDesc, sOKButtonText, sMessageSuccessToastText, sMessageBoxErrorText;
			if (oBtnClicked === this.oi18nModel.getText("ActionC_ProjectBillingRequestTPSections4")) {
				oDialogTitle = this.oi18nModel.getText("REINCLUDE");
				oDialogContentDesc = this.oi18nModel.getText("REINCLUDE_DIALOG_DESC");
				sOKButtonText = this.oi18nModel.getText("REINCLUDE");
				sMessageSuccessToastText = this.oi18nModel.getText("REINCLUDE_SUCCESS_MESSAGE");
				sMessageBoxErrorText = this.oi18nModel.getText("REINCLUDE_ERROR_MESSAGE");
			} else if (oBtnClicked === this.oi18nModel.getText("ActionC_ProjectBillingRequestTPSections3")) {
				oDialogTitle = this.oi18nModel.getText("WRITE_OFF");
				oDialogContentDesc = this.oi18nModel.getText("WRITEOFF_DIALOG_DESC");
				sOKButtonText = this.oi18nModel.getText("WRITE_OFF");
				sMessageSuccessToastText = this.oi18nModel.getText("WRITE_OFF_SUCCESS_MESSAGE");
				sMessageBoxErrorText = this.oi18nModel.getText("WRITE_OFF_ERROR_MESSAGE");
			} else {
				oDialogTitle = this.oi18nModel.getText("POSTPONE_DATE");
				oDialogContentDesc = this.oi18nModel.getText("POSTPONE_DATE_DIALOG_DESC");
				sOKButtonText = this.oi18nModel.getText("POSTPONE");
				sMessageSuccessToastText = this.oi18nModel.getText("POSTPONE_SUCCESS_MESSAGE");
				sMessageBoxErrorText = this.oi18nModel.getText("POSTPONE_ERROR_MESSAGE");
			}
			var oDialog = new sap.m.Dialog({
				title: oDialogTitle,
				draggable: true,
				icon: "sap-icon://question-mark",
				type: "Message",
				content: [new sap.m.Text({
					text: oDialogContentDesc
				})],
				beginButton: new sap.m.Button({
					text: sOKButtonText,
					type: "Emphasized",
					press: function (oOKEvt) {
						for (var k = 0; k < aProjectBillingRequestItemUUID.length; k++) {
							oModel.create("/" + fnToBeCalled, {}, {
								urlParameters: {
									ProjectBillingRequestItemUUID: aProjectBillingRequestItemUUID[k]
								},
								success: jQuery.proxy(function (oReceivedData) {
									that.Core.byId(
										"i2d.ps.projectbillingrequests1::sap.suite.ui.generic.template.ObjectPage.view.Details::C_ProjectBillingRequestTP--timeAndExpenseItemsFacetID::Section"
									).getModel().refresh(true);
									//Hiding Edit and delete buttons on model refresh due to introduction of Update_mc and Delete_mc fields from framework
									that.Core.byId(
										"i2d.ps.projectbillingrequests1::sap.suite.ui.generic.template.ObjectPage.view.Details::C_ProjectBillingRequestTP--edit"
									).setVisible(false);
									that.Core.byId(
										"i2d.ps.projectbillingrequests1::sap.suite.ui.generic.template.ObjectPage.view.Details::C_ProjectBillingRequestTP--delete"
									).setVisible(false);
									sap.m.MessageToast.show(sMessageSuccessToastText);
								}, this),
								error: jQuery.proxy(function (oDataResponse) {
									sap.m.MessageBox.error(
										sMessageBoxErrorText, {}
									);
								}, this)
							});
						}
						oDialog.close();

					}
				}),
				endButton: new sap.m.Button({
					text: this.oi18nModel.getText("CANCEL"),
					press: function () {
						oDialog.close();
					}
				}),
				afterClose: function () {
					that.Core.byId(
						"i2d.ps.projectbillingrequests1::sap.suite.ui.generic.template.ObjectPage.view.Details::C_ProjectBillingRequestTP--timeAndExpenseItemsFacetID::Table"
					).getTable().getPlugins()[0].clearSelection();
					oDialog.destroy();
				}
			}).addStyleClass("sapUiPopupWithPadding");
			oDialog.open();
		}
		//T&E table actions ends here	
});