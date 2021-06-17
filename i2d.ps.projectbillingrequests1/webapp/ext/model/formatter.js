sap.ui.define([], function () {
		"use strict";
		var formatter = {

			fnGetHeaderFieldsText: function (sFieldValue) {
				if (sFieldValue === "10"){
					return this.getView().getModel("i18n").getResourceBundle().getText("MULTIPLE");
				}
				else{
					return sFieldValue;
				}
			},
			
			fnGetBillingMethod: function (sBillingPlanUsageCategoryName) {
				if (sBillingPlanUsageCategoryName === "3"){
					return this.getView().getModel("i18n").getResourceBundle().getText("TIME_AND_EXPENSE");
				}
				else if (sBillingPlanUsageCategoryName === "4"){
					return this.getView().getModel("i18n").getResourceBundle().getText("FIXED_PRICE");
				}
				else if (sBillingPlanUsageCategoryName === "5"){
					return this.getView().getModel("i18n").getResourceBundle().getText("TE_AND_FP");
				}
				else{
					return sBillingPlanUsageCategoryName;
				}
			},
			
			fnGetBillableRevenueStatus: function (sBilled, sBillable, sPlanned, sCap) {
				var iSum = parseFloat(sBilled) + parseFloat(sBillable);
				if (sCap !== null && sCap !== undefined && parseFloat(sCap) !== 0) {
					if (parseFloat(sBilled) > parseFloat(sCap)) {
						return "None";
					} else if (iSum > parseFloat(sCap)) {
						return "Warning";
					} else {
						return "None";
					}
				} else if (sPlanned !== null && sPlanned !== undefined && parseFloat(sPlanned) !== 0) {
					if (parseFloat(sBilled) > parseFloat(sPlanned)) {
						return "None";
					} else if (iSum > parseFloat(sPlanned)) {
						return "Warning";
					} else {
						return "None";
					}
				} else {
					return "None";
				}
			},

			fnEnableGrouping: function (sValue, sCurrCode) {
				var sCurrencyFormat = sap.ui.core.format.NumberFormat.getCurrencyInstance({
					showMeasure: false,
					currencyCode: true,
					currencyContext: 'standard'
				});
				return sCurrencyFormat.format(sValue, sCurrCode);
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