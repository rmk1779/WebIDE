sap.ui.define([
		"i2d/ps/projbillingelements1/ext/model/formatter",
		"sap/ui/generic/app/navigation/service/NavigationHandler",
		"sap/ui/generic/app/navigation/service/SelectionVariant"
	],
	function (formatter, NavigationHandler, SelectionVariant) {
		"use strict";
		return sap.ui.controller("i2d.ps.projbillingelements1.ext.controller.ListReportExt", {
			formatter: formatter,
			onInit: function () {
				this.oNavigationHandler = new sap.ui.generic.app.navigation.service.NavigationHandler(this);
				this.oSmartFilterBar = this.getView().byId(
					"i2d.ps.projbillingelements1::sap.suite.ui.generic.template.ListReport.view.ListReport::C_ProjectBillingElementTP--listReportFilter"
				);
				this.oSmartFilterBar.setUseDateRangeType(true);
				this.oTable = this.getView().byId(
					"i2d.ps.projbillingelements1::sap.suite.ui.generic.template.ListReport.view.ListReport::C_ProjectBillingElementTP--listReport"
				);
				this.oTable.setRequestAtLeastFields(
					"PlndRevnAmt,ProjBillgElmntEntrIsCancelled,StoreCustomerName,UnbilledRevnAmtInDocCrcy,PlndPrepaymentAmtInProjCrcy,DueBillingDate,ProjectBillingRequest,BillingWBSElementInternalID,BillingPlanUsageCategory,BillingPlanItemUsage,ItemBillingBlockReason,HeaderBillingBlockReason,ProjectBillingRequestUUID,CostCenterName,EngmtProjectServiceOrgName,ProfitCenterName"
				);
				this.oTable.setUseExportToExcel(true);
				this.oTable.setIgnoreFromPersonalisation(
					"CustomerName,StoreCustomerName,PlndPrepaymentAmtInProjCrcy,DocumentCurrency,ProjectBillingRequest,BillableRevenueAmtInDocCrcy,IsMyProjectBillingElement,NetValueAmountInDocCurrency,BilledRevenueAmtInDocCrcy,CustomerProject,ProjectDescription,DueBillingDate"
				);
				this.oTable.getTable().attachUpdateFinished(this.fnOnForceUnselection);
				this.oTable.getTable().attachSelectionChange(this.fnOnLRTableSelectionChange);
			},

			restoreCustomAppStateDataExtension: function () {
				var that = this;
				var oParseNavigationPromise = that.oNavigationHandler.parseNavigation();
				oParseNavigationPromise.done(function (oAppData, oURLParameters, sNavType) {
					if (sNavType !== sap.ui.generic.app.navigation.service.NavType.initial) {
						var bHasOnlyDefaults = oAppData && oAppData.bNavSelVarHasDefaultsOnly;
						if (!bHasOnlyDefaults) {
							that.oSmartFilterBar.search();
						}
					}
				});
			},

			fnOnLRTableSelectionChange: function (oEvt) {
				var Core = sap.ui.getCore();
				if (oEvt.getSource().getSelectedItems().length >= 1) {
					var aCustomerProjects = oEvt.getSource().getSelectedContexts().map(function (item) {
							return item.getModel().getProperty(item.sPath).CustomerProject;
						}),
						bIsEveryProjectSame = aCustomerProjects.every(function (each) {
							return each === aCustomerProjects[0];
						}),
						aProjectBillingRequests = oEvt.getSource().getSelectedContexts().map(function (item) {
							return item.getModel().getProperty(item.sPath).ProjectBillingRequest;
						}),
						bIsEveryProjectBIllingRequestsEmptyorSame = aProjectBillingRequests.every(function (each) {
							return (!each.startsWith("S") && each === aProjectBillingRequests[0]);
						});
					// prepayment button is disabled upon multiselect	
					if (oEvt.getSource().getSelectedItems().length > 1) {
						Core.byId(
							"i2d.ps.projbillingelements1::sap.suite.ui.generic.template.ListReport.view.ListReport::C_ProjectBillingElementTP--ActionC_ProjectBillingElementTP2button"
						).setEnabled(false);
					}
					//prepayment button disabled based on conditions if single select
					if (oEvt.getSource().getSelectedItems().length === 1) {
						var sBillingPlanItemUsageonSingleSelect = parseInt(oEvt.getSource().getModel().getProperty(oEvt.getSource().getSelectedItem().getBindingContext()
								.sPath).BillingPlanItemUsage, 10),
							sPlannedPrepaymentAmountOnSingleSelect = parseFloat(oEvt.getSource().getModel().getProperty(oEvt.getSource().getSelectedItem()
								.getBindingContext()
								.sPath).PlndPrepaymentAmtInProjCrcy, 10);
						if ((sBillingPlanItemUsageonSingleSelect !== 0 && sBillingPlanItemUsageonSingleSelect !== 1) ||
							sPlannedPrepaymentAmountOnSingleSelect === 0) {
							Core.byId(
								"i2d.ps.projbillingelements1::sap.suite.ui.generic.template.ListReport.view.ListReport::C_ProjectBillingElementTP--ActionC_ProjectBillingElementTP2button"
							).setEnabled(false);
						}
					}
					//prepare billing button enablement check
					Core.byId(
						"i2d.ps.projbillingelements1::sap.suite.ui.generic.template.ListReport.view.ListReport::C_ProjectBillingElementTP--ActionC_ProjectBillingElementTP1button"
					).setEnabled(bIsEveryProjectSame && bIsEveryProjectBIllingRequestsEmptyorSame);
				}
			},

			//code triggered during delete action of project billing request.
			fnOnPressIconForDelete: function (oEvent) {
				var that = this,
					oi18n = this.getView().getModel("i18n").getResourceBundle(),
					oModel = this.getView().getModel(),
					oProjectBillingRequest = oEvent.getSource().getModel().getProperty(oEvent.getSource().getBindingContext().sPath).ProjectBillingRequest,
					oProjectBillingElementUUID = oEvent.getSource().getModel().getProperty(oEvent.getSource().getBindingContext().sPath).ProjectBillingElementUUID,
					oDialog = new sap.m.Dialog({
						title: oi18n.getText("DELETE_PBR_TIT"),
						icon: "sap-icon://question-mark",
						contentWidth: "25%",
						resizable: true,
						draggable: true,
						content: [new sap.m.Text({
							text: oi18n.getText("CONFIRM_DELETE_MESSAGE", [oProjectBillingRequest])
						}).addStyleClass("sapUiSmallMargin")],
						beginButton: new sap.m.Button({
							text: oi18n.getText("DELETE"),
							press: function (oEventPress) {
								oDialog.destroy();
								that.fnDeleteAction(oProjectBillingElementUUID, oModel);
							}
						}),
						endButton: new sap.m.Button({
							text: oi18n.getText("CANCEL"),
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

			//code triggered after confirmation of delete
			fnDeleteAction: function (oProjectBillingElementUUID, oModel) {
				var that = this;
				oModel.create("/DeleteProjectBillingRequest", {}, {
					urlParameters: {
						ProjectBillingElementUUID: "guid\'" + oProjectBillingElementUUID + "\'"
					},
					success: jQuery.proxy(function (oReceivedData, oResponse) {
						oModel.refresh(true);
					}, this),
					error: jQuery.proxy(function (oDataResponse) {
						sap.m.MessageBox.error(that.getView().getModel("i18n").getResourceBundle().getText("ERROR_DELETE_ACTION"), {});
					}, this)
				});
			},

			// this code to be reintroduced soon. Please dont remove the below commented code
			/*fnOnBeforeRebindListTable: function (oEvent) {
				var oBindingParams = oEvent.getParameter("bindingParams");
				oBindingParams.parameters = oBindingParams.parameters || {};
				oBindingParams.filters.push(new sap.ui.model.Filter("ProjBillgElmntEntrIsCancelled", "NE", "X"));
			},*/

			////POPOVER GENERIC FUNCTIONS
			fnOnAfterClose: function (oEvent) {
				this._oPopover.destroy();
				this.fnEnablePointerEvents();
			},

			fnDisablePointerEvents: function () {
				this.oTable.getTable().$().css("pointer-events", "none");
			},

			fnEnablePointerEvents: function () {
				this.oTable.getTable().$().css("pointer-events", "all");
			},

			fnOpenPopover: function (oEvent, sID) {
				var that = this;
				var oModel = new sap.ui.model.json.JSONModel(that.getView().getModel().getProperty(oEvent.getSource().getBindingContext().sPath));
				that._oPopover = sap.ui.xmlfragment(that.getView().getId(), sID, that);
				this._oPopover.setModel(oModel);
				that.getView().addDependent(that._oPopover);
				this._oPopover.attachAfterOpen(function () {
					this.fnDisablePointerEvents();
				}, this);
				that._oPopover.openBy(oEvent.getSource());
			},

			fnOnForceUnselection: function (oEvent) {
				var Core = sap.ui.getCore();
				Core.byId(
						"i2d.ps.projbillingelements1::sap.suite.ui.generic.template.ListReport.view.ListReport::C_ProjectBillingElementTP--listReport").getTable()
					.removeSelections();
				Core.byId(
					"i2d.ps.projbillingelements1::sap.suite.ui.generic.template.ListReport.view.ListReport::C_ProjectBillingElementTP--ActionC_ProjectBillingElementTP1button"
				).setEnabled(false);
				Core.byId(
					"i2d.ps.projbillingelements1::sap.suite.ui.generic.template.ListReport.view.ListReport::C_ProjectBillingElementTP--ActionC_ProjectBillingElementTP2button"
				).setEnabled(false);
			},

			//// DIALOG when Due billing date is pressed
			fnOnDueBillingDatePressed: function (oEvent) {
				var that = this;
				var oi18n = this.getView().getModel("i18n").getResourceBundle();
				var oData = this.getView().getModel().getProperty(oEvent.getSource().getBindingContext().sPath);
				var oModel = new sap.ui.model.json.JSONModel(oData);
				var oTable = new sap.m.Table("oDueBillingDatePopoverTableID", {
					columns: [
						new sap.m.Column({
							header: new sap.m.Text({
								text: oi18n.getText("BILL_PLAN_ITEM")
							})
						}),
						new sap.m.Column({
							header: new sap.m.Text({
								text: oi18n.getText("DUE_BILLING_AMT")
							}),
							hAlign: "End"
						}),
						new sap.m.Column({
							header: new sap.m.Text({
								text: oi18n.getText("BILLING_DUE_DATE")
							}),
							hAlign: "End"
						})
					]
				});

				oTable.bindAggregation("items", {
					path: oEvent.getSource().getBindingContext().sPath + "/to_ProjBillgSlsItmBillgPlnDuDte",
					template: new sap.m.ColumnListItem({
						cells: [
							new sap.m.Text({
								text: {
									parts: [{
										path: "BillingPlanUsageCategory"
									}, {
										path: "BillingPlanItemUsage"
									}],
									formatter: function (sBillingPlanUsageCategory, sBillingPlanItemUsage) {
										if (sBillingPlanUsageCategory === "1") {
											return that.getView().getModel("i18n").getResourceBundle().getText("FIXED_PRICE");
										} else if (sBillingPlanUsageCategory === "2" && sBillingPlanItemUsage !== "1") {
											return that.getView().getModel("i18n").getResourceBundle().getText("TIME_AND_EXPENSES");
										} else if (sBillingPlanUsageCategory === "2" && sBillingPlanItemUsage === "1") {
											return that.getView().getModel("i18n").getResourceBundle().getText("PAYMENT_ON_ACCOUNT");
										} else {
											return " ";
										}
									}
								}
							}),
							new sap.m.ObjectNumber({
								number: "{parts:[{path:'BillingPlanAmount'}],type: 'sap.ui.model.type.Currency'}",
								unit: "{parts:[{path:'TransactionCurrency'}]}",
								emphasized: false
							}),
							new sap.m.ObjectStatus({
								text: {
									path: "BillingPlanBillingDate",
									type: "sap.ui.model.type.Date",
									formatOptions: {
										UTC: true,
										type: "short"
									}
								},
								state: {
									path: "BillingPlanBillingDate",
									formatter: formatter.fnGetBillingPlanBillingDateStatus
								}
							})
						]
					})
				});

				oTable.setModel(this.getView().getModel());
				var oDialog = new sap.m.Dialog({
					title: oi18n.getText("DUE_BILL_POP_HEAD", [oData.WBSElement]),
					contentWidth: "35%",
					resizable: true,
					draggable: true,
					content: [oTable],
					beginButton: new sap.m.Button({
						text: oi18n.getText("EDIT_BILL_BUT"),
						press: function (oEventPress) {
							var oSelectionVariant = new sap.ui.generic.app.navigation.service.SelectionVariant();
							oSelectionVariant.addSelectOption("CustomerProject", "I", "EQ", oEventPress.getSource().getParent().data(
								"CustomerProject"));
							var vNavigationParameters = oSelectionVariant.toJSONString();
							that.fnNavigateTo("CustomerProject", "maintainCustomerProject", vNavigationParameters);
							oDialog.destroy();
						}
					}),
					endButton: new sap.m.Button({
						text: oi18n.getText("CLOSE"),
						press: function (oEventError) {
							oEventError.getSource().getParent().close();
							that.fnOnForceUnselection();
							oDialog.destroy();
						}
					}),
					afterClose: function () {
						that.fnOnForceUnselection();
						oDialog.destroy();
					}
				}).setModel(oModel, "data");
				oDialog.data("CustomerProject", oData.CustomerProject);
				oDialog.open();
				sap.ui.getCore().byId("oDueBillingDatePopoverTableID").getModel().refresh(true);
			},

			/// DIALOG when Net Unbilled is pressed
			fnOnNetBilledPressed: function (oEvent) {
				var that = this;
				var oData = this.getView().getModel().getProperty(oEvent.getSource().getBindingContext().sPath);
				var oModel = new sap.ui.model.json.JSONModel(oData);
				var oi18n = this.getView().getModel("i18n").getResourceBundle();
				if (!sap.ui.getCore().byId("oNetBilledPopoverTableID")) {
					var oTable = new sap.m.Table("oNetBilledPopoverTableID", {
						columns: [
							new sap.m.Column({
								header: new sap.m.Text({
									text: oi18n.getText("BILL_ID")
								})
							}),
							new sap.m.Column({
								header: new sap.m.Text({
									text: oi18n.getText("INVOICE_TYPE")
								})
							}),
							new sap.m.Column({
								header: new sap.m.Text({
									text: oi18n.getText("BILL_DATE")
								}),
								hAlign: "End"
							}),
							new sap.m.Column({
								header: new sap.m.Text({
									text: oi18n.getText("TOT_BILL")
								}),
								hAlign: "End"
							})
						]
					});
					oTable.bindAggregation("items", {
						path: oEvent.getSource().getBindingContext().sPath + "/to_ProjectBillingDocDetails",
						template: new sap.m.ColumnListItem({
							cells: [
								new sap.m.Text({
									text: "{BillingDocument}"
								}),
								new sap.m.Text({
									text: {
										path: "SDDocumentCategory",
										formatter: function (sSDDocumentCategory) {
											if (sSDDocumentCategory === "M") {
												return that.getView().getModel("i18n").getResourceBundle().getText("INVOICE");
											} else if (sSDDocumentCategory === "N") {
												return that.getView().getModel("i18n").getResourceBundle().getText("INVOICE_CANCEL");
											} else {
												return " ";
											}
										}
									}
								}),
								new sap.m.Text({
									text: {
										path: "BillingDocumentDate",
										type: "sap.ui.model.type.Date",
										formatOptions: {
											UTC: true,
											pattern: "dd.MM.yyyy"
										}
									}
								}),
								new sap.m.ObjectNumber({
									number: "{parts:[{path:'TotalNetAmount'}],type: 'sap.ui.model.type.Currency'}",
									unit: "{parts:[{path:'TransactionCurrency'}]}",
									emphasized: false
								})
							]
						})
					});
				}
				oTable.setModel(this.getView().getModel());
				var oDialog = new sap.m.Dialog({
					title: oi18n.getText("TAB_HEAD", [oData.WBSElement]),
					contentWidth: "35%",
					resizable: true,
					draggable: true,
					endButton: new sap.m.Button({
						text: oi18n.getText("CLOSE"),
						press: function (oEventError) {
							oEventError.getSource().getParent().close();
							that.fnOnForceUnselection();
							oDialog.destroyContent();
						}
					}),
					afterClose: function () {
						that.fnOnForceUnselection();
						oDialog.destroy();
					},
					content: [oTable]
				}).setModel(oModel, "data");
				oDialog.open();
				sap.ui.getCore().byId("oNetBilledPopoverTableID").getModel().refresh(true);
			},

			//On Account Icon Click for Information
			fnOnPressIconForOnAccount: function (oEvent) {
				var oData = this.getView().getModel().getProperty(oEvent.getSource().getBindingContext().sPath);
				var oPrepaymentAmountModel = new sap.ui.model.json.JSONModel(oData);
				var oi18n = this.getView().getModel("i18n").getResourceBundle();
				var oNumberFormat = sap.ui.core.format.NumberFormat.getFloatInstance({
					maxFractionDigits: 2,
					groupingEnabled: true
				});
				var oPopover = new sap.m.Popover({
					placement: "Bottom",
					showHeader: false,
					content: [
						new sap.m.Text({
							text: oi18n.getText("PREPAYMENTAMT_DETAILS", [oNumberFormat.format(oPrepaymentAmountModel.getData()
								.PlndPrepaymentAmtInProjCrcy), oPrepaymentAmountModel.getData().DocumentCurrency])
						}).addStyleClass("sapUiSmallMargin")
					]
				});
				oPopover.openBy(oEvent.getSource());
			},

			//On Account Dialog
			fnOnPressOnAccountButton: function (oEvt) {
				var that = this,
					oi18n = this.getView().getModel("i18n").getResourceBundle(),
					oWBSRef = oEvt.getSource().getModel().getProperty(oEvt.getSource().getBindingContext().sPath).WBSElement,
					oProjectBillingElementUUID = oEvt.getSource().getModel().getProperty(oEvt.getSource().getBindingContext().sPath).ProjectBillingElementUUID,
					oPrepaymentModel = this.getView().getModel(),
					oDueBillingDate = oEvt.getSource().getModel().getProperty(oEvt.getSource().getBindingContext().sPath).DueBillingDate;
				var oList = new sap.m.List("oOnAccountListID", {});
				oList.bindAggregation("items", {
					path: oEvt.getSource().getBindingContext().sPath + "/to_PrjBlgElmEntrForPrepayment",
					template: new sap.m.ObjectListItem({
						title: oi18n.getText("ONACCOUNT"),
						visible: "{= parseFloat(${PlndPrepaymentAmtInProjCrcy}, 10) !== 0 ? true : false }",
						number: {
							parts: [{
								path: "PlndPrepaymentAmtInProjCrcy"
							}, {
								path: "ProjectCurrency"
							}],
							formatter: function (sValue, sCurrCode) {
								var sFormattedCurrency, sCurrencyFormat = sap.ui.core.format.NumberFormat.getCurrencyInstance({
									showMeasure: false,
									currencyCode: true,
									currencyContext: "standard"
								});
								if (sValue !== null && sValue !== undefined) {
									if (sCurrCode !== null && sCurrCode !== undefined) {
										sFormattedCurrency = oi18n.getText("COST_WITH_CURR", [sCurrencyFormat.format(sValue,
												sCurrCode),
											sCurrCode
										]);
									} else {
										sFormattedCurrency = sCurrencyFormat.format(sValue, sCurrCode);
									}
								}
								return sFormattedCurrency;
							}
						},
						attributes: [new sap.m.ObjectAttribute({
							text: {
								path: "ServicesRenderedDate",
								type: "sap.ui.model.type.Date",
								formatOptions: {
									UTC: true,
									type: "short"
								}
							}
						})]
					})
				});
				oList.setModel(this.getView().getModel());
				var oDialog = new sap.m.Dialog({
					title: oi18n.getText("ONACCOUNT_SUBMIT_TITLE", [oWBSRef]),
					draggable: true,
					contentWidth: "35%",
					beginButton: new sap.m.Button({
						text: oi18n.getText("ONACCOUNT_SUBMIT"),
						type: "Emphasized",
						press: function (oSubmitEvt) {
							if (oDueBillingDate < new Date()) {
								that.oTable.setBusy(true);
								that.oTable.getToolbar().setBusy(true);
								oPrepaymentModel.create("/CreateBillgDocReqFromPrjBlgElm", {}, {
									urlParameters: {
										ProjectBillingElementUUID: "guid\'" + oProjectBillingElementUUID + "\'"
									},
									success: jQuery.proxy(function (oReceivedData, oResponse) {
										that.oTable.setBusy(false);
										that.oTable.getToolbar().setBusy(false);
										that.oTable.getTable().getModel().refresh(true);
										that.fnGetBDRNumber(oProjectBillingElementUUID, oPrepaymentModel, oReceivedData.results[0].ProjBillgElmntEntrItmFlowUUID);
									}, this),
									error: jQuery.proxy(function (oDataResponse) {
										that.oTable.setBusy(false);
										that.oTable.getToolbar().setBusy(false);
										var aXMLParsedResponse = new DOMParser().parseFromString(oDataResponse.responseText, "text/xml").getElementsByTagName(
											"code");
										if ((aXMLParsedResponse === undefined) || (aXMLParsedResponse === null) || (aXMLParsedResponse.length === 0)) {
											if (oDataResponse.responseText !== undefined || JSON.parse(oDataResponse.responseText).error !== undefined) {
												/*sap.m.MessageBox.error(oDataResponse.responseText.startsWith("{") ? JSON.parse(oDataResponse.responseText).error.message
													.value : oDataResponse.responseText, {});*/
												that.fnDisplayErrorMessageOnPrepareBilling(oDataResponse, true);
											} else {
												/*sap.m.MessageBox.error(that.getView().getModel("i18n").getResourceBundle().getText("ERROR_CREATE_ONACCOUNT"), {});*/
												that.fnDisplayErrorMessageOnPrepareBilling(that.getView().getModel("i18n").getResourceBundle().getText(
													"ERROR_CREATE_ONACCOUNT"), true);
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
									oi18n.getText("DUE_BILLING_DATE_IN_FUTURE"), {}
								);
							}
							oDialog.close();
						}

					}),
					endButton: new sap.m.Button({
						text: oi18n.getText("ONACCOUNT_CANCEL"),
						press: function (oEventError) {
							oEventError.getSource().getParent().close();
							oDialog.close();
						}
					}),
					content: [oList],
					afterClose: function (oCloseEvt) {
						oDialog.destroy();
					}
				});
				oList.getBinding("items").filter([new sap.ui.model.Filter("ServicesRenderedDate", sap.ui.model.FilterOperator.LE, oDueBillingDate)]);
				oDialog.open();
			},

			fnOnEstActualPressed: function (oEvent) {
				this.fnOpenPopover(oEvent, "i2d.ps.projbillingelements1.ext.fragment.EstActualPopover");
			},

			////PROJECT SMARTLINK POPOVER
			fnOnNavigationTargetsObtained: function (oEvent) {
				var sSelectedEntity = this.getView().getModel().getProperty(oEvent.getSource().getBindingContext().sPath);
				var oi18n = this.getView().getModel("i18n").getResourceBundle();
				var oParameters = oEvent.getParameters();
				var oDateFormatType = sap.ui.core.format.DateFormat.getDateInstance({
					style: "medium",
					interval: true
				});

				oParameters.show("", undefined, undefined, new sap.ui.layout.form.SimpleForm({
					maxContainerCols: 2,
					columnsL: 1,
					columnsM: 1,
					content: [
						new sap.ui.core.Title({
							text: oEvent.getSource().getText()
						}),
						new sap.m.Label({
							text: oi18n.getText("CUSTOMER")
						}),
						new sap.m.Text({
							text: sSelectedEntity.StoreCustomerName
						}),
						new sap.m.Label({
							text: oi18n.getText("DATE")
						}),
						new sap.m.Text({
							text: oDateFormatType.format([sSelectedEntity.PlannedStartDate, sSelectedEntity.PlannedEndDate])
						}),
						new sap.m.Label({
							text: oi18n.getText("SERVC_ORG")
						}),
						new sap.m.Text({
							text: sSelectedEntity.EngmtProjectServiceOrgName
						}),
						new sap.m.Label({
							text: oi18n.getText("COST_CENT")
						}),
						new sap.m.Text({
							text: sSelectedEntity.CostCenterName
						}),
						new sap.m.Label({
							text: oi18n.getText("PROF_CENT")
						}),
						new sap.m.Text({
							text: sSelectedEntity.ProfitCenterName
						})
					]
				}));

			},

			fnBillingDataIsInFuture: function (aValues) {
				var dToday = new Date(),
					bIsBillingDueDateInFuture;
				aValues.some(function (each) {
					bIsBillingDueDateInFuture = (each > dToday);
				});
				return bIsBillingDueDateInFuture;
			},

			//// Object Page Navigation
			fnOnClickPrepareBilling: function (oEvent) {
				var aSelectedObjects = this.extensionAPI.getSelectedContexts().map(function (each) {
						return each.getModel().getProperty(each.sPath);
					}),
					aItemBillingBlockingReasons = this.extensionAPI.getSelectedContexts().map(function (item) {
						return item.getModel().getProperty(item.sPath).ItemBillingBlockReason;
					}),
					bIsItemBillingBlockingReasonValid = aItemBillingBlockingReasons.every(function (each) {
						return (each !== "06");
					}),
					aHeaderBillingBlockingReasons = this.extensionAPI.getSelectedContexts().map(function (item) {
						return item.getModel().getProperty(item.sPath).HeaderBillingBlockReason;
					}),
					bIsHeaderBillingBlockingReasonValid = aHeaderBillingBlockingReasons.every(function (each) {
						return (each !== "06");
					}),
					aBillingPlanUsageCatagories = this.extensionAPI.getSelectedContexts().map(function (item) {
						return item.getModel().getProperty(item.sPath).BillingPlanUsageCategory;
					}),
					bIsBillingPlanUsageCategoriesInValid = aBillingPlanUsageCatagories.every(function (each) {
						return (each !== undefined && each !== null && each === "1");
					}),
					aDueBillingDates = this.extensionAPI.getSelectedContexts().map(function (item) {
						return item.getModel().getProperty(item.sPath).DueBillingDate;
					}),
					bIsDueBillingDatesInValid = aDueBillingDates.some(function (each) {
						return (each === undefined || each === null || each === "");
					}),
					aProjectBillingRequests = this.extensionAPI.getSelectedContexts().map(function (item) {
						return item.getModel().getProperty(item.sPath).ProjectBillingRequest;
					}),
					bIsProjectBillingRequestsValid = aProjectBillingRequests.every(function (each) {
						return (each.startsWith("S"));
					});
				//disable the prepare billing button for all the double clickers
				sap.ui.getCore().byId(
					"i2d.ps.projbillingelements1::sap.suite.ui.generic.template.ListReport.view.ListReport::C_ProjectBillingElementTP--ActionC_ProjectBillingElementTP1button"
				).setEnabled(false);
				// logic check before triggering the actual create of the project billing requests
				if (bIsItemBillingBlockingReasonValid && bIsHeaderBillingBlockingReasonValid) {
					if (bIsBillingPlanUsageCategoriesInValid) {
						if (bIsDueBillingDatesInValid) {
							sap.m.MessageBox.error(this.getView().getModel("i18n").getResourceBundle().getText("ERROR_CREATE_DBD_UNDEF"), {}); // upcoming text change
						} else {
							if (this.fnBillingDataIsInFuture(aDueBillingDates)) {
								sap.m.MessageBox.error(this.getView().getModel("i18n").getResourceBundle().getText("ERROR_CREATE_FUTURE_DBD"), {}); // upcoming text change
							} else {
								if (bIsProjectBillingRequestsValid) {
									this.fnNavigateToBillingRequest(aSelectedObjects);
								} else {
									this.fnCreateDraftBill(aSelectedObjects);
								}
							}
						}
					} else {
						if (bIsProjectBillingRequestsValid) {
							this.fnNavigateToBillingRequest(aSelectedObjects);
						} else {
							this.fnCreateDraftBill(aSelectedObjects);
						}
					}
				} else {
					sap.m.MessageBox.error(this.getView().getModel("i18n").getResourceBundle().getText("BLOCK_PRE_BILLING"), {});
				}
			},

			fnOnClickingPrepayment: function (oEvent) {
				var that = this,
					oi18n = this.getView().getModel("i18n").getResourceBundle(),
					oPrepaymentModel = this.getView().getModel(),
					oWBSRef = oPrepaymentModel.getProperty(this.extensionAPI.getSelectedContexts()[0].sPath).WBSElement,
					oProjectBillingElementUUID = oPrepaymentModel.getProperty(this.extensionAPI.getSelectedContexts()[0].sPath).ProjectBillingElementUUID,
					oDueBillingDate = oPrepaymentModel.getProperty(this.extensionAPI.getSelectedContexts()[0].sPath).DueBillingDate;
				var oList = new sap.m.List("oOnAccountListID", {});
				oList.bindAggregation("items", {
					path: this.extensionAPI.getSelectedContexts()[0].sPath + "/to_PrjBlgElmEntrForPrepayment",
					template: new sap.m.ObjectListItem({
						title: oi18n.getText("ONACCOUNT"),
						visible: "{= parseFloat(${PlndPrepaymentAmtInProjCrcy}, 10) !== 0 ? true : false }",
						number: {
							parts: [{
								path: "PlndPrepaymentAmtInProjCrcy"
							}, {
								path: "ProjectCurrency"
							}],
							formatter: function (sValue, sCurrCode) {
								var sCurrencyFormat = sap.ui.core.format.NumberFormat.getCurrencyInstance({
									showMeasure: false,
									currencyCode: true,
									currencyContext: 'standard'
								});
								if (sValue !== null && sValue !== undefined) {
									if (sCurrCode !== null && sCurrCode !== undefined) {
										return oi18n.getText("COST_WITH_CURR", [sCurrencyFormat.format(sValue,
												sCurrCode),
											sCurrCode
										]);
									} else {
										return sCurrencyFormat.format(sValue, sCurrCode);
									}
								}
							}
						},
						attributes: [new sap.m.ObjectAttribute({
							text: {
								path: "ServicesRenderedDate",
								type: "sap.ui.model.type.Date",
								formatOptions: {
									UTC: true,
									type: "short"
								}
							}
						})]
					})
				});

				oList.setModel(this.getView().getModel());
				var oDialog = new sap.m.Dialog({
					title: oi18n.getText("ONACCOUNT_SUBMIT_TITLE", [oWBSRef]),
					draggable: true,
					contentWidth: "35%",
					beginButton: new sap.m.Button({
						text: oi18n.getText("ONACCOUNT_SUBMIT"),
						type: "Emphasized",
						press: function (oSubmitEvt) {
							if (oDueBillingDate < new Date()) {
								that.oTable.setBusy(true);
								that.oTable.getToolbar().setBusy(true);
								oPrepaymentModel.create("/CreateBillgDocReqFromPrjBlgElm", {}, {
									urlParameters: {
										ProjectBillingElementUUID: "guid\'" + oProjectBillingElementUUID + "\'"
									},
									success: jQuery.proxy(function (oReceivedData, oResponse) {
										that.oTable.setBusy(false);
										that.oTable.getToolbar().setBusy(false);
										that.oTable.getTable().getModel().refresh(true);
										that.fnGetBDRNumber(oProjectBillingElementUUID, oPrepaymentModel, oReceivedData.results[0].ProjBillgElmntEntrItmFlowUUID);
									}, this),
									error: jQuery.proxy(function (oDataResponse) {
										that.oTable.setBusy(false);
										that.oTable.getToolbar().setBusy(false);
										var aXMLParsedResponse = new DOMParser().parseFromString(oDataResponse.responseText, "text/xml").getElementsByTagName(
											"code");
										if ((aXMLParsedResponse === undefined) || (aXMLParsedResponse === null) || (aXMLParsedResponse.length === 0)) {
											if (oDataResponse.responseText !== undefined || JSON.parse(oDataResponse.responseText).error !== undefined) {
												sap.m.MessageBox.error(oDataResponse.responseText.startsWith("{") ? JSON.parse(oDataResponse.responseText).error.message
													.value : oDataResponse.responseText, {});
											} else {
												sap.m.MessageBox.error(that.getView().getModel("i18n").getResourceBundle().getText("ERROR_CREATE_ONACCOUNT"), {});
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
									oi18n.getText("DUE_BILLING_DATE_IN_FUTURE"), {}
								);
							}
							oDialog.close();
						}

					}),
					endButton: new sap.m.Button({
						text: oi18n.getText("ONACCOUNT_CANCEL"),
						press: function (oEventError) {
							oEventError.getSource().getParent().close();
							oDialog.close();
						}
					}),
					content: [oList],
					afterClose: function (oCloseEvt) {
						oDialog.destroy();
					}
				});
				oList.getBinding("items").filter([new sap.ui.model.Filter("ServicesRenderedDate", sap.ui.model.FilterOperator.LE, oDueBillingDate)]);
				oDialog.open();
			},

			//the below code is the code for postpone, once the backend action is ready uncomment and modify if needed
			/*fnOnClickPostpone: function (oEvent) {
				var oi18n = this.getView().getModel("i18n").getResourceBundle(),
					oDueBillingDateRef = this.getView().getModel().getProperty(this.extensionAPI.getSelectedContexts()[0].sPath).DueBillingDate,
					oWBSRef = this.getView().getModel().getProperty(this.extensionAPI.getSelectedContexts()[0].sPath).WBSElement,
					oDialog = new sap.m.Dialog({
						title: oi18n.getText("POSTPONE_DUEBILLING_DATE_TITLE", [oWBSRef]),
						draggable: true,
						buttons: [new sap.m.Button({
								text: oi18n.getText("POSTPONE_DUEBILLING_DATE"),
								type: "Emphasized",
								press: function (oSubmitEvt) {
									oDialog.close();
								}
							}),
							new sap.m.Button({
								text: oi18n.getText("EDIT_BILL_BUT")
							}),
							new sap.m.Button({
								text: oi18n.getText("ONACCOUNT_CANCEL"),
								press: function (oEventError) {
									oEventError.getSource().getParent().close();
									oDialog.close();
								}
							})
						],
						content: [new sap.m.VBox({
							items: [new sap.m.ObjectStatus({
								title: "Current Due Billing Date",
								text: sap.ui.core.format.DateFormat.getDateTimeInstance({
									pattern: "yyyy/MM/dd"
								}).format(oDueBillingDateRef)
							})]

						})],
						afterClose: function (oCloseEvt) {
							oDialog.destroy();
						}
					}).addStyleClass("sapUiPopupWithPadding");

				oDialog.open();
			},*/

			fnGetBDRNumber: function (oPBEUUID, oSubmittedModel, oFlowUUID) {
				var oi18nModel = this.getOwnerComponent().getModel("i18n").getResourceBundle(),
					Core = sap.ui.getCore(),
					that = this;
				oSubmittedModel.read("/C_ProjectBillgElmntEntrFlwTP", {
					success: function (oReceivedData, oResponse) {
						var bBDRCheck = oReceivedData.results[0].BillingDocument !== undefined && oReceivedData.results[0].BillingDocument !== "" &&
							oReceivedData.results[0].BillingDocument !== null,
							oCrossAppNav = new sap.ushell.Container.getService("CrossApplicationNavigation"),
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
							Core.byId("PrelimCBDRLink").setEnabled(aResponses[0].supported);
						});
						oCrossAppNav.isNavigationSupported(aCreateIntent).done(function (aResponses) {
							Core.byId("BillDocReqLink").setEnabled(aResponses[0].supported);
						});
						var oDialog = new sap.m.Dialog({
							title: oi18nModel.getText("SUCCESS"),
							draggable: true,
							type: "Message",
							content: [new sap.m.VBox({
								items: [new sap.m.Text({
										text: bBDRCheck ? oi18nModel.getText("SUCCESS_CALL_FOR_CREATE_BDR_PARA", [oReceivedData.results[0].BillingDocument]) : oi18nModel
											.getText("SUCCESS_CALL_FOR_CREATE_BDR")
									}).addStyleClass("sapUiTinyMarginBottom"),
									new sap.m.Link("PrelimCBDRLink", {
										text: oi18nModel.getText("NAV_TO_PRELIM_CBDR_APP"),
										press: function (oEvent) {
											var oi18n = that.getView().getModel("i18n").getResourceBundle(),
												sMsgText = oi18n.getText("OUTBOUND_NAV_TO_PRELIM_CBDR_APP_ERR_MSG"),
												oNavigationHandler = new sap.ui.generic.app.navigation.service.NavigationHandler(that),
												oSelectionVariant = new sap.ui.generic.app.navigation.service.SelectionVariant(),
												fnOnError = function (oError) {
													var oDialoglet = new sap.m.Dialog({
														title: oi18n.getText("ERR_NAV"),
														state: "Error",
														draggable: true,
														content: new sap.m.Text({
															text: sMsgText
														}),
														endButton: new sap.m.Button({
															text: oi18n.getText("CLOSE"),
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
										text: oi18nModel.getText("NAV_TO_CBDR_APP"),
										press: function (oEvent) {
											var oi18n = that.getView().getModel("i18n").getResourceBundle(),
												sMsgText = oi18n.getText("OUTBOUND_NAV_TO_CBDR_APP_ERR_MSG"),
												oNavigationHandler = new sap.ui.generic.app.navigation.service.NavigationHandler(that),
												oSelectionVariant = new sap.ui.generic.app.navigation.service.SelectionVariant(),
												fnOnError = function (oError) {
													var oDialoglet = new sap.m.Dialog({
														title: oi18n.getText("ERR_NAV"),
														state: "Error",
														draggable: true,
														content: new sap.m.Text({
															text: sMsgText
														}),
														endButton: new sap.m.Button({
															text: oi18n.getText("CLOSE"),
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
								text: oi18nModel.getText("OK"),
								type: "Emphasized",
								press: function (oOKEvt) {
									oDialog.close();
								}
							}),
							afterClose: function () {
								oDialog.destroy();
							}
						}).addStyleClass("sapUiPopupWithPadding");
						oDialog.open();

					}.bind(this),
					urlParameters: {
						"$filter": "ProjBillgElmntEntrItmFlowUUID eq guid'" + oFlowUUID + "'",
						"$select": "BillingDocument"
					}
				});
			},

			fnCreateDraftBill: function (oSelectedObject) {
				var that = this,
					oModel = this.getView().getModel(),
					aSelectedObjects = [],
					nCounter = 0,
					nNumberOfSelectedObjects = oSelectedObject.length;
				that.oTable.setBusy(true);
				that.oTable.getToolbar().setBusy(true);
				for (var i = 0; i < oSelectedObject.length; i++) {
					oModel.create("/CreateProjectBillingRequest", {}, {
						urlParameters: {
							BillingWBSElementInternalID: "\'" + oSelectedObject[i].BillingWBSElementInternalID + "\'"
						},
						success: jQuery.proxy(function (oReceivedData, oResponse) {
							++nCounter;
							if (that.getView().getModel().getProperty(that.extensionAPI.getSelectedContexts()[0].sPath).BillingPlanUsageCategory !==
								"1") {
								sap.m.MessageToast.show(that.getView().getModel("i18n").getResourceBundle().getText("SUCCESS_CREATE"));
							}
							aSelectedObjects.push(oReceivedData);
							if ((oReceivedData !== undefined || oReceivedData.ProjectBillingRequestUUID !== "" || oReceivedData.ProjectBillingRequestUUID !==
									undefined || oReceivedData.ProjectBillingRequestUUID !== null) && (nCounter === nNumberOfSelectedObjects)) {
								that.fnNavigateToBillingRequest(aSelectedObjects);
							}
						}, this),
						error: jQuery.proxy(function (oDataResponse) {
							++nCounter;
							that.oTable.setBusy(false);
							that.oTable.getToolbar().setBusy(false);
							//upon error the disabled prepare billing button has to be enabled again
							sap.ui.getCore().byId(
								"i2d.ps.projbillingelements1::sap.suite.ui.generic.template.ListReport.view.ListReport::C_ProjectBillingElementTP--ActionC_ProjectBillingElementTP1button"
							).setEnabled(true);
							if ((oDataResponse.responseText !== undefined || JSON.parse(oDataResponse.responseText).error !== undefined) && (nCounter ===
									nNumberOfSelectedObjects)) {
								that.fnDisplayErrorMessageOnPrepareBilling(oDataResponse, false);
							}
						}, this)
					});
				}
			},

			fnDisplayErrorMessageOnPrepareBilling: function (oDataResponse, bIsTheErrorFromOnAccountSubmission) {
				//for a weird OPA behavior workaround
				if (!oDataResponse.responseText.startsWith("{")) {
					sap.m.MessageBox.error(oDataResponse.responseText, {});
				} else {
					if (oDataResponse !== this.getView().getModel("i18n").getResourceBundle().getText("ERROR_CREATE_ONACCOUNT")) {
						var aErrorMessages = JSON.parse(oDataResponse.responseText).error.innererror.errordetails,
							oi18nModel = this.getView().getModel("i18n").getResourceBundle(),
							aDisplayMessages = [];
						for (var k = 0; k < aErrorMessages.length; k++) {
							var oMessageObject = {},
								sErrorMessageDescription;
							if (!bIsTheErrorFromOnAccountSubmission) {
								sErrorMessageDescription = aErrorMessages[k].message.indexOf("&") === -1 ? aErrorMessages[k].message : aErrorMessages[k].message
									.slice(
										aErrorMessages[k].message.indexOf(""), aErrorMessages[k].message.indexOf(
											"&")) + aErrorMessages[k].message.slice(aErrorMessages[k].message.indexOf("&") + 1, aErrorMessages[k].message.indexOf("& ")) +
									aErrorMessages[k].message.slice(aErrorMessages[k].message.indexOf("& ") + 1, aErrorMessages[k].message.indexOf(". "));
							} else {
								sErrorMessageDescription = aErrorMessages[k].message.slice(aErrorMessages[k].message.indexOf("&") + 1, aErrorMessages[k].message
									.indexOf(".") + 1);
							}
							oMessageObject.type = oi18nModel.getText("ERROR");
							oMessageObject.title = oi18nModel.getText("ERROR_MESSAGE");
							oMessageObject.desc = sErrorMessageDescription;
							oMessageObject.errorCode = aErrorMessages[k].code;
							aDisplayMessages.push(oMessageObject);
						}
					} else {
						aDisplayMessages.push({
							type: oi18nModel.getText("ERROR"),
							title: oi18nModel.getText("ERROR_MESSAGE"),
							desc: this.getView().getModel("i18n").getResourceBundle().getText("ERROR_CREATE_ONACCOUNT"),
							subtitle: this.getView().getModel("i18n").getResourceBundle().getText("ERROR_CREATE_ONACCOUNT")
						});
					}
					//message popover in dialog
					var oMessageTemplate = new sap.m.MessageItem({
						type: "{type}",
						title: "{title}",
						description: "{desc}",
						subtitle: "{desc}"
					});

					var oErrorMessageModel = new sap.ui.model.json.JSONModel();
					oErrorMessageModel.setData(aDisplayMessages);

					var oBackButton = new sap.m.Button({
						icon: sap.ui.core.IconPool.getIconURI("nav-back"),
						visible: false,
						press: function () {
							oMessageView.navigateBack();
							this.setVisible(false);
						}
					});

					var oMessageView = new sap.m.MessageView({
						showDetailsPageHeader: false,
						itemSelect: function () {
							oBackButton.setVisible(true);
						},
						items: {
							path: "/",
							template: oMessageTemplate
						}
					});

					oMessageView.setModel(oErrorMessageModel);

					var oDialog = new sap.m.Dialog({
						title: oi18nModel.getText("ERROR"),
						content: oMessageView,
						state: "Error",
						beginButton: new sap.m.Button({
							press: function () {
								oDialog.close();
							},
							text: oi18nModel.getText("CLOSE")
						}),
						afterClose: function () {
							oDialog.destroy();
						},
						customHeader: new sap.m.Bar({
							contentMiddle: [
								new sap.m.Text({
									text: oi18nModel.getText("ERROR")
								})
							],
							contentLeft: [oBackButton]
						}),
						contentHeight: "25%",
						contentWidth: "25%",
						verticalScrolling: false
					});
					oDialog.open();

				}
			},

			fnNavigateToBillingRequest: function (oSelectedObject) {
				var oSelectionVariant = new sap.ui.generic.app.navigation.service.SelectionVariant(),
					oProjectBillingRequestUUID;
				// since only one response object in the array of responses hold the PBR since there is a possibility of the PBRUUID to be dupkicated here	
				for (var i = 0, length = oSelectedObject.length; i <= length; i++) {
					if (oSelectedObject[i].ProjectBillingRequestUUID !== "" || oSelectedObject[i].ProjectBillingRequestUUID !== null ||
						oSelectedObject[i].ProjectBillingRequestUUID !== undefined || oSelectedObject[i] !== undefined) {
						oProjectBillingRequestUUID = oSelectedObject[i].ProjectBillingRequestUUID;
						break;
					}
				}
				oSelectionVariant.addSelectOption("ProjectBillingRequestUUID", "I", "EQ", oProjectBillingRequestUUID);
				var vNavigationParameters = oSelectionVariant.toJSONString();
				this.fnNavigateTo("ProjectBillingRequest", "manage", vNavigationParameters);
			},

			fnNavigateTo: function (sSemanticObject, sActionName, vNavigationParameters) {
				var that = this;
				var oi18n = that.getView().getModel("i18n").getResourceBundle();
				var sMsgText = sSemanticObject === "ProjectBillingRequest" ? oi18n.getText("OUTBOUND_NAV_ERR_MSG_PBR") : oi18n.getText(
					"OUTBOUND_NAV_ERR_MSG_CP");
				that.bIsNavigation = true;
				var oNavigationHandler = new sap.ui.generic.app.navigation.service.NavigationHandler(this);
				//app state for back navigation
				var oInnerAppData = {};
				var oExternalAppData = {
					selectionVariant: vNavigationParameters
				};
				// callback function in case of errors
				var fnOnError = function (oError) {

					var oDialog = new sap.m.Dialog({
						title: oi18n.getText("ERR_NAV"),
						state: "Error",
						draggable: true,
						content: new sap.m.Text({
							text: sMsgText
						}),
						endButton: new sap.m.Button({
							text: oi18n.getText("CLOSE"),
							press: function (oEventError) {
								oEventError.getSource().getParent().close();
							}
						}),
						afterClose: function () {
							oDialog.destroy();
						}
					});
					oDialog.addStyleClass("sapUiPopupWithPadding");
					oDialog.open();
				};
				oNavigationHandler.navigate(sSemanticObject, sActionName, vNavigationParameters, oInnerAppData, fnOnError, oExternalAppData);
			}

		});
	});