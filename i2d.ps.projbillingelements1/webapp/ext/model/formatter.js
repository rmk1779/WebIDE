sap.ui.define([], function () {
		"use strict";

		var formatter = {

			fnGetIsOnAccount: function (sItemUsage, sPlannedPrepaymentAmount) {
				if (parseInt(sItemUsage, 10) === 1 && parseFloat(sPlannedPrepaymentAmount, 10) !== 0) {
					return true;
				} else {
					return false;
				}
			},

			fnGetIsPlannedPrepayment: function (sPlannedPrepaymentAmount) {
				if (parseFloat(sPlannedPrepaymentAmount, 10) === 0) {
					return false;
				} else {
					return true;
				}
			},

			fnGetDueBillingDateStatus: function (sValue) {
				var dToday = new Date();
				if (dToday < sValue) {
					return "Information";
				} else {
					return "Error";
				}
			},

			fnGetBillingPlanBillingDateStatus: function (sValue) {
				var dToday = new Date();
				if (dToday < sValue) {
					return "None";
				} else {
					return "Error";
				}
			},

			fnGetDraftBillVisibility: function (sCategory, sDraftBillText) {
				if (sDraftBillText !== null && sDraftBillText !== undefined) {
					if (!sDraftBillText.startsWith("S")) {
						return false;
					} else {
						return true;
					}
				} else {
					return true;
				}
			},

			fnGetNetBilledRevStatus: function (sBilled, sPlanned, sCap) {
				if (sCap !== null && sCap !== undefined && parseFloat(sCap) !== 0) {
					if (parseFloat(sBilled) > parseFloat(sCap)) {
						return "Error";
					} else {
						return "Information";
					}
				} else if (sPlanned !== null && sPlanned !== undefined && parseFloat(sPlanned) !== 0) {
					if (parseFloat(sBilled) > parseFloat(sPlanned)) {
						return "Error";
					} else {
						return "Information";
					}
				} else {
					return "Information";
				}
			},

			fnGetEstActualStatus: function (sEstAct, sPlanned, sCap) {
				if (sCap !== null && sCap !== undefined && parseFloat(sCap) !== 0) {
					if (parseFloat(sEstAct) > parseFloat(sCap)) {
						return "Warning";
					} else {
						return "None";
					}
				} else if (sPlanned !== null && sPlanned !== undefined && parseFloat(sPlanned) !== 0) {
					if (parseFloat(sEstAct) > parseFloat(sPlanned)) {
						return "Warning";
					} else {
						return "None";
					}
				} else {
					return "None";
				}
			},

			fnGetEstActualActive: function (sEstAct, sPlanned, sCap) {
				if (sCap !== null && sCap !== undefined && parseFloat(sCap) !== 0) {
					if (parseFloat(sEstAct) > parseFloat(sCap)) {
						return true;
					} else {
						return false;
					}
				} else if (sPlanned !== null && sPlanned !== undefined && parseFloat(sPlanned) !== 0) {
					if (parseFloat(sEstAct) > parseFloat(sPlanned)) {
						return true;
					} else {
						return false;
					}
				} else {
					return false;
				}
			},

			fnGetEstActualPopText: function (sBilled, sEstAct, sPlanned, sCap, sDocumentCurrency) {
				if (sDocumentCurrency === undefined || sDocumentCurrency === null) {
					sDocumentCurrency = "";
				}
				if (sCap !== null && sCap !== undefined && sDocumentCurrency !== undefined && sDocumentCurrency !== null && parseFloat(sCap) !== 0) {
					if (parseFloat(sBilled) > parseFloat(sCap)) {
						return this.getView().getModel("i18n").getResourceBundle().getText("CAP_EXCEED", [sCap, sDocumentCurrency]);
					} else if (sEstAct > parseFloat(sCap)) {
						return this.getView().getModel("i18n").getResourceBundle().getText("CAP_EXCESS", [sCap, sDocumentCurrency]);
					}
				} else if (sPlanned !== null && sPlanned !== undefined && sDocumentCurrency !== undefined && sDocumentCurrency !== null &&
					parseFloat(sPlanned) !== 0) {
					if (parseFloat(sBilled) > parseFloat(sPlanned)) {
						return this.getView().getModel("i18n").getResourceBundle().getText("PLN_REV_EXCEED", [sPlanned, sDocumentCurrency]);
					} else if (sEstAct > parseFloat(sPlanned)) {
						return this.getView().getModel("i18n").getResourceBundle().getText("PLN_REV_EXCS", [sPlanned, sDocumentCurrency]);
					}
				}
			},

			fnGetFormattedCost: function (sValue, sCurrCode) {
				var sCurrencyFormat = sap.ui.core.format.NumberFormat.getCurrencyInstance({
					showMeasure: false,
					currencyCode: true,
					currencyContext: 'standard'
				});
				if (sValue !== null && sValue !== undefined) {
					if (sCurrCode !== null && sCurrCode !== undefined) {
						return this.getView().getModel("i18n").getResourceBundle().getText("COST_WITH_CURR", [sCurrencyFormat.format(sValue, sCurrCode),
							sCurrCode
						]);
					} else {
						return sCurrencyFormat.format(sValue, sCurrCode);
					}
				}
			}

		};
		return formatter;
	},
	true);