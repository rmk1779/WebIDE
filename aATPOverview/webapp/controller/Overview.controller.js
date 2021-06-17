/*&--------------------------------------------------------------------------------------*
 * File Name	                       : Overiew.controller.js             *
 * Created By                          :                   		        				 *
 * Created On                          : 20-Feb-2020                               		 *
 * Stories                             :                            					 *
 * Transport No                        :		                                         *
 * Purpose                             : aATP Overview View 			     *
 *---------------------------------------------------------------------------------------*
 * This is an unpublished work containing __ confidential and                       	 *
 * proprietary information. Disclosure, use or                                           *
 * reproduction without the written authorization of __ is prohibited.              	 *
 * If publication occurs, the following                                                  *
 * notice applies:                                                                       *
 *      Copyright © 2020, __ rights reserved.                                	    	 *
 *---------------------------------------------------------------------------------------*
 * C H A N G E   H I S T O R Y:                                                          *
 *---------------------------------------------------------------------------------------*
 *.......................................................................................*
 */
sap.ui.define([
	"com/samsung/aATPOverview/controller/BaseController",
	"sap/viz/ui5/format/ChartFormatter",
	"sap/viz/ui5/api/env/Format",
	"sap/viz/ui5/data/FlattenedDataset",
	"com/sap/atp/reuselib/utils/DateUtils",
	"../model/TimeMoveDialogConfig",
	"sap/m/SearchField",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"com/sap/atp/reuselib/constants",
	"../model/VizChartPropertiesConfig",
	"com/samsung/aATPOverview/controller/MoveAllocHistoryFragment.controller",
	"com/samsung/aATPOverview/controller/MoveAllocationConsumptionFragment.controller",
	"sap/m/MessageToast"
], function (BaseController, ChartFormatter, Format, FlattenedDataset, DateUtils, TimeMoveDialogConfig, SearchField, Filter,
	FilterOperator, constants, VizChartPropertiesConfig, MoveAllocHistoryFragment, MoveAllocationConsumptionFragment, MessageToast) {
	"use strict";

	return BaseController.extend("com.samsung.aATPOverview.controller.Overview", {
		viewModelName: "ATPOverviewModel",

		/* =========================================================== */
		/* lifecycle methods                                           */
		/* =========================================================== */

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf com.samsung.aATPOverview.view.Overview
		 */
		onInit: function () {
			// Format.numericFormatter(ChartFormatter.getInstance());
			// var formatPattern = ChartFormatter.DefaultPattern;
			this.loadChartFragments();

			this.oRouter = this.getOwnerComponent().getRouter();
			this.oRouter.getRoute("Overview").attachPatternMatched(this.onRouteMatched, this);
		},

		/**
		 * Event handler for the attach pattern matched of route object
		 * @public
		 * @param {object} oEvent - Event Object
		 */
		onRouteMatched: function (oEvent) {
			var sRouteName = oEvent.getParameter("name");
			if (sRouteName === "Overview") {
				var aFilters, oATPOverviewModel = this.getModel("ATPOverviewModel");
				if (!oATPOverviewModel.getProperty("/moveAllocationHistory/defaultData")) {
					this.fetchCurrentWeek().then(function () {
						this.oMoveAllocationHistoryFragment.setVizChartProperties();
						this.oMoveAllocationConsumptionFragment.setVizChartProperties();
					}.bind(this));
				} else {
					aFilters = this.oMoveAllocationHistoryFragment._getMoveAllocationHistoryfilters();
					this.oMoveAllocationHistoryFragment.getVizFrame().getDataset().getBinding("data").filter(aFilters);
				}
			}

		},

		/**
		 * Event Handler for Product Group Value Help dialog launch
		 * @public
		 * @param {object} oEvent - Event Object
		 */
		onProductGroupValueRequest: function (oEvent) {
			let oCustomData = oEvent.getSource().data();
			let f4Name = oCustomData.f4name;
			let oDialogConfig = TimeMoveDialogConfig[f4Name];
			this.oMultiInput = oEvent.getSource();
			this.oValueHelpDialog = this._createFragment(oDialogConfig.fragmentId, oDialogConfig.fragmentPath);
			var oTreeTable = this._createFragment(oDialogConfig.tableId, oDialogConfig.tablePath);
			var oBasicSearch = new SearchField({
				search: this.onProductGroupTreeSearch.bind(this, oDialogConfig.entityKey)
			});
			this.openValueHelpDialog(oTreeTable, oBasicSearch);
		},

		/**
		 * Method for Search the Product Group Tree data from Table
		 * @public
		 * @param {object} oEvent - Event Object
		 */
		onProductGroupTreeSearch: function (oEvent) {
			this.onBaseItemTreeSearch(oEvent, "Product");
		},

		/**
		 * Event handler for the data point select in the stacked column chart
		 * @public
		 * @param {object} oEvent - Event Object
		 */
		onLineChartDataPointSelect: function (oEvent) {
			var oChartContainer = this.byId("idChartContainer"),
				sSelectedLogWeek, sMoveType, aData = oEvent.getParameter("data"),
				oATPOverviewModel = this.getModel("ATPOverviewModel");
			sSelectedLogWeek = oEvent.getParameter("data")[0].data.Week;
			sMoveType = oEvent.getParameter("data")[0].data.measureNames.toUpperCase();
			if (sMoveType.indexOf("SITE") !== -1) {
				sMoveType = constants.SITE_MOVETYPE;
			} else if (sMoveType.indexOf("SELLER") !== -1) {
				sMoveType = constants.SELLER_MOVETYPE;
			} else if (sMoveType.indexOf("TIME") !== -1) {
				sMoveType = constants.TIME_MOVETYPE;
			}
			if (aData.length > 1) {
				sMoveType = "";

			}
			oATPOverviewModel.setProperty("/moveType", sMoveType);
			oATPOverviewModel.setProperty("/selectedLogWeek", sSelectedLogWeek);
			this.getRouter().navTo("MoveAllocationHistoryDetail");
			if (oChartContainer.getFullScreen()) {
				oChartContainer.setFullScreen(false);
			}

		},

		/**
		 * Event Handler to Handle Product Group Value Help Update Selection Change
		 * @public
		 * @param {object} oEvent - Event Object
		 */
		onProductGroupValueHelpUpdateSelection: function (oEvent) {
			let oATPOverviewModel = this.getModel("ATPOverviewModel"),
				oCustomData = oEvent.getSource().data(),
				oDialogConfig = TimeMoveDialogConfig[oCustomData.f4name];
			this.onBaseValueHelpUpdateSelection(oEvent, oDialogConfig.entityKey, "/productGroupF4FlatData", oDialogConfig.isTreeFilter);
			oATPOverviewModel.setProperty("/backUpProductTokens", jQuery.extend(true, [], oATPOverviewModel.getProperty("/productGroupTokens")));
			oATPOverviewModel.setProperty("/backUpProductTableData", jQuery.extend(true, [], oATPOverviewModel.getProperty(
				"/productGroupF4Data")));
		},

		/**
		 * Event Handler for Product Group MultiInput Token Update
		 * @public
		 * @param {object} oEvent - Event Object
		 */
		onProductGroupTokenUpdate: function (oEvent) {
			let oDialogConfig = TimeMoveDialogConfig.productGroupF4;
			let sToken = this.updateTokens(oDialogConfig.modelTokenProperty, oEvent);
			this._setTreeSelection(sToken, oEvent.getParameters().type, "/productGroupF4FlatData", oDialogConfig.modelDataProperty,
				oDialogConfig.entityKey);
		},

		/*
		 *Method used to get the filters for sellarmove Table
		 *return array filters
		 */
		_getMoveAllocationHistoryfilters: function () {
			var oWeekFilter, sStartWeek, oSellarVal, oATPOverviewModel = this.getModel("ATPOverviewModel"),
				iCurrentWeek = oATPOverviewModel.getProperty("/defaultData").CurrentWeek,
				aFilters = [];
			oSellarVal = this.getView().byId("idProductGroup").getTokens();
			sStartWeek = this.getOwnerComponent().getModel("ATPOverviewModel").getProperty("/startWeek");
			if (oSellarVal.length !== 0) {
				for (var i in oSellarVal) {
					aFilters.push(new Filter("product_group", FilterOperator.EQ, oSellarVal[i].getProperty("key")));
				}
			}
			oWeekFilter = new Filter("log_week", FilterOperator.BT, sStartWeek, String(iCurrentWeek));
			aFilters.push(oWeekFilter);
			return aFilters;
		},

		/*
		 * Event handler for the Filter bar search/go
		 */
		onSearchButtonPress: function () {
			var aFilters = this._getMoveAllocationHistoryfilters(),
				oVizFrameBinding = this.byId("idVizFrame").getDataset().getBinding("data");
			oVizFrameBinding.filter(aFilters);
		},

		/*
		 * Event handler used for open calendarweek
		 * @param {object} oEvent - Event Object
		 */
		onCalendarPress: function (oEvent) {
			var fragId = this.createId("openweekCalendar"),
				ATPOverviewModel = this.getOwnerComponent().getModel("ATPOverviewModel");
			this._openWeekCalendar = this._createFragment(fragId, "com.samsung.aATPOverview.view.fragments.CalendarWeek");
			this.getView().addDependent(this._openWeekCalendar);
			this._openWeekCalendar.openBy(oEvent.getSource());
			var sYear, oStartDate, sWeek, iCurrentWeek = ATPOverviewModel.getProperty("/defaultData").CurrentWeek;
			sYear = iCurrentWeek.toString().slice(0, 4);
			sWeek = iCurrentWeek.toString().slice(4, 6);
			oStartDate = DateUtils.getDateOfISOWeek(parseInt(sWeek), parseInt(sYear));
			this._setWeeksData(oStartDate.startDate);
		},

		/**
		 * Method where the calendar weeks model got updated.
		 * @param {object} oDate - Date Object
		 */
		_setWeeksData: function (oDate) {
			var oStartDate = DateUtils.getAdjustedDate(oDate),
				oEndDate = DateUtils.getAdjustedDate(new Date(oStartDate)),
				oResourceModel = this.getResourceBundle(),
				ATPOverviewModel = this.getOwnerComponent().getModel("ATPOverviewModel");
			var iYear, aWeeks = [],
				oEmptyObject, iWeek, weekdate;

			for (var i = 1; i <= 16; i++) {
				iYear = DateUtils.getISOYearByDate(oStartDate);

				iWeek = DateUtils.getISOWeekByDate(oStartDate);

				let oStartingDate = this.getIsoWeekdate(oStartDate);
				//End date 
				oEndDate.setYear(oStartDate.getFullYear());
				oEndDate.setMonth(oStartDate.getMonth());
				oEndDate.setDate(oStartDate.getDate() + 7);
				let oEndDingdate = this.getIsoWeekdate(oEndDate);
				weekdate = oResourceModel.getText("fromAndToDateText", [oStartingDate, oEndDingdate]);
				oEmptyObject = {
					"year": iYear,
					"week": iWeek,
					"weekdates": weekdate
				};
				//Updating the date to next week's start date
				oStartDate.setDate(oStartDate.getDate() - 7);
				aWeeks.push(oEmptyObject);
			}
			ATPOverviewModel.setProperty("/moveWeeks", aWeeks);
		},

		/*
		 * Event handler on calendar icon Press 
		 * @public
		 * @param {sap.ui.base.Event} [oEvent] the Event instance
		 */
		onWeekCalendPress: function (oEvent) {
			var sSelWeek,
				iWeek = oEvent.getSource().data("week"),
				oResourceModel = this.getResourceBundle(),
				iYear = oEvent.getSource().data("year");
			var ATPOverviewModel = this.getOwnerComponent().getModel("ATPOverviewModel");
			ATPOverviewModel.setProperty("/sSelectedWeek", oResourceModel.getText("calendarWeek", [iWeek, iYear]));
			ATPOverviewModel.setProperty("/fromWeek", oResourceModel.getText("calendarWeek", [iWeek, iYear]));
			if (iWeek < 10) {
				sSelWeek = String(iYear) + "0" + String(iWeek);
			} else {
				sSelWeek = String(iYear) + String(iWeek);
			}
			ATPOverviewModel.setProperty("/startWeek", sSelWeek);
			this._openWeekCalendar.close();
			ATPOverviewModel.refresh();
		},

		loadChartFragments: function () {
			this.oMoveAllocationHistoryFragment = new MoveAllocHistoryFragment({
				id: "moveAllocationHistoryId",
				fragmentName: "com.samsung.aATPOverview.view.fragments.MoveAllocationHistory",
				component: this.getOwnerComponent(),
				contentDensity: this.contentDensity,
				view: this.getView()
			});

			this.oMoveAllocationConsumptionFragment = new MoveAllocationConsumptionFragment({
				id: "moveAllocationConsumptionId",
				fragmentName: "com.samsung.aATPOverview.view.fragments.MoveAllocationConsumption",
				component: this.getOwnerComponent(),
				contentDensity: this.contentDensity,
				view: this.getView()
			});
		},

		/*
		 * Event handler on Section Value help Request Press
		 * @public
		 * @param {sap.ui.base.Event} [oEvent] the Event instance
		 */
		onSectionValueRequest: function (oEvent) {
			let oCustomData = oEvent.getSource().data();
			let f4Name = oCustomData.f4name;
			let oDialogConfig = TimeMoveDialogConfig[f4Name];
			this.oMultiInput = oEvent.getSource();
			this.oValueHelpDialog = this._createFragment(oDialogConfig.fragmentId, oDialogConfig.fragmentPath);
			var oTreeTable = this._createFragment(oDialogConfig.tableId, oDialogConfig.tablePath);
			var oBasicSearch = new SearchField({
				search: this.onProductGroupTreeSearch.bind(this, oDialogConfig.entityKey)
			});
			this.openValueHelpDialog(oTreeTable, oBasicSearch);
		}

	});
});