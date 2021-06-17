/*&--------------------------------------------------------------------------------------*
 * File Name	                       : MoveAllocationConsumptionFragment.controller.js                    *
 * Created By                          :                   		        				 *
 * Created On                          : 04-March-2020                               		 *
 * Stories                             :                            					 *
 * Transport No                        :		                                         *
 * Purpose                             : Manage Move allocation vs consumption -			 *
 *										MoveAllocationConsumption  Fragment							 *
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

sap.ui.define(["com/sap/atp/reuselib/BaseFragmentController",
	"../model/VizChartPropertiesConfig",
	"sap/viz/ui5/format/ChartFormatter",
	"sap/viz/ui5/api/env/Format",
	"com/samsung/aATPOverview/controller/BaseController",
	"sap/viz/ui5/data/FlattenedDataset",
	"com/samsung/aATPOverview/util/ValueHelpDialogUtil",
	"com/sap/atp/reuselib/utils/DateUtils",
	"../model/TimeMoveDialogConfig",
	"sap/m/SearchField",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/m/MessageToast"
], function (BaseFragmentController, VizChartPropertiesConfig, ChartFormatter, Format, BaseController, FlattenedDataset,
	ValueHelpDialogUtil, DateUtils, TimeMoveDialogConfig, SearchField, Filter, FilterOperator, MessageToast) {
	return BaseFragmentController.extend("com.samsung.aATPOverview.controller.MoveAllocationConsumptionFragment.controller", {
		viewModelPath: "/allocationAndConsumption",
		constructor: function (params) {
			BaseFragmentController.call(this, {
				id: "moveAllocationConsumptionId",
				fragmentName: "com.samsung.aATPOverview.view.fragments.MoveAllocationConsumption",
				component: params.component,
				contentDensity: params.contentDensity,
				model: params.model,
				view: params.view
			});
			this.oView = params.view;
			this.oComponent = params.component;
			this.oResourceBundle = BaseController.prototype.getResourceBundle.apply(this, arguments);
			this.initializeFragment();
			var oATPOverviewModel = this.oComponent.getModel("ATPOverviewModel");
			oATPOverviewModel.setProperty(this.viewModelPath, {});
			oATPOverviewModel.setProperty(this.viewModelPath + "/productGrpDetailF4Data", []);
			oATPOverviewModel.setProperty(this.viewModelPath + "/sectionF4Data", []);
			oATPOverviewModel.setProperty(this.viewModelPath + "/bProductGroupEnable", false);
			oATPOverviewModel.setProperty(this.viewModelPath + "/sSectionValueState", "None");
			//oATPOverviewModel.setProperty("/allocationAndConsumption/busy", true);
			this._fetchSectionData();
		},

		/* =========================================================== */
		/* lifecycle methods                                           */
		/* =========================================================== */

		onInit: function () {
			BaseFragmentController.prototype.onInit.apply(this, arguments);
		},

		/* =========================================================== */
		/* event handlers                                              */
		/* =========================================================== */

		/*
		 * Event handler on Value help Request Press
		 * @public
		 * @param {sap.ui.base.Event} [oEvent] the Event instance
		 */
		onF4ValueRequest: function (oEvent) {
			var sF4TableBindingPath;
			let oCustomData = oEvent.getSource().data();
			this.f4Name = oCustomData.f4name;
			sF4TableBindingPath = this.getTableBindingPath();
			let oDialogConfig = TimeMoveDialogConfig[this.getF4ConfigObjectName()];
			this.oMultiInput = oEvent.getSource();
			this.oValueHelpDialog = ValueHelpDialogUtil._createFragment(oDialogConfig.fragmentId, oDialogConfig.fragmentPath, this);
			var oTreeTable = ValueHelpDialogUtil._createFragment(oDialogConfig.tableId, oDialogConfig.tablePath, this);
			oTreeTable.bindRows({
				path: sF4TableBindingPath.tablePath
			});
			var oBasicSearch = new SearchField();
			ValueHelpDialogUtil.openValueHelpDialog(this.oView, this.oValueHelpDialog, this.oMultiInput, oTreeTable, oBasicSearch);

		},

		/*
		 * Event handler on Value help Request Cancel Press
		 * @public
		 * @param {sap.ui.base.Event} [oEvent] the Event instance
		 */
		onValueHelpCancelPress: function (oEvent) {
			var oSource = oEvent.getSource();
			oSource.close();
		},

		/*
		 * Event handler on Value help Request Ok Press
		 * @public
		 * @param {sap.ui.base.Event} [oEvent] the Event instance
		 */
		onValueHelpOkPress: function (oEvent) {
			var oCustomData, aTokens, oSource = oEvent.getSource();
			oCustomData = oSource.data();
			var f4Name = oCustomData.f4name;
			var oDialogConfig = TimeMoveDialogConfig[f4Name];
			aTokens = oEvent.getParameter("tokens");
			this.setTokensFromValueHelp(aTokens, oDialogConfig.modelTokenProperty);
			if (f4Name === "sectionTypeF4") {
				this.setSectionInputProperty();
			}
			oSource.close();
		},

		/**
		 * Method getting called after Value help dialog closed.
		 * @public
		 * @param {Constructor} [oEvent] Close Event of F4
		 */
		onValueHelpAfterClose: function (oEvent) {
			var oSource = oEvent.getSource();
			oSource.destroy();
		},

		/*
		 * Event handler on Filter Bar Go Press
		 * @public
		 * @param {sap.ui.base.Event} [oEvent] the Event instance
		 */
		onSearchAllocationVsConsumption: function () {
			var oATPOverviewModel = this.getOwnerComponent().getModel("ATPOverviewModel");
			var aSectionToken = oATPOverviewModel.getProperty(this.viewModelPath + "/sectionTokens");
			if (aSectionToken && aSectionToken.length > 0) {
				this.initializeXAxisTitle();
				this.setVizChartProperties();
				oATPOverviewModel.setProperty(this.viewModelPath + "/sSectionValueState", "None");
			} else {
				oATPOverviewModel.setProperty(this.viewModelPath + "/sSectionValueState", "Error");
			}

		},

		/*
		 * Event handler on Value Help Selected Token Remove
		 * @public
		 * @param {sap.ui.base.Event} [oEvent] the Event instance
		 */
		onValueHelpTokenRemove: function (oEvent) {
			var f4Name = oEvent.getSource().data().f4name;
			var oDialogConfig = TimeMoveDialogConfig[f4Name];
			ValueHelpDialogUtil.onTokenRemove(oEvent, oDialogConfig.entityKey, this.viewModelPath + oDialogConfig.modelDataProperty);
		},

		/*
		 * Event handler on Multi Input Selected Token Remove
		 * @public
		 * @param {sap.ui.base.Event} [oEvent] the Event instance
		 */
		onInputTokenUpdate: function (oEvent) {
			let ATPOverviewModel = this.getOwnerComponent().getModel("ATPOverviewModel");
			var f4Name = oEvent.getSource().data().f4name;
			var oDialogConfig = TimeMoveDialogConfig[f4Name];
			//var aAllToken = ATPOverviewModel.getProperty(oDialogConfig.modelTokenProperty);
			ValueHelpDialogUtil.updateTokens(ATPOverviewModel, this.viewModelPath + oDialogConfig.modelTokenProperty, oEvent, oDialogConfig.isTreeFilter);
			if (f4Name === "sectionF4") {
				this.setSectionInputProperty();
			}
		},

		/* =========================================================== */
		/* internal methods                                 			*/
		/* =========================================================== */

		/*
		 * Method for Initialize Viz Graph Property.
		 * @public
		 */
		initializeFragment: function () {
			Format.numericFormatter(ChartFormatter.getInstance());
			var oMoveAllocationBlockLayoutCell, formatPattern = ChartFormatter.DefaultPattern;
			oMoveAllocationBlockLayoutCell = this.oView.byId("idAllocationbConsumptionCell");
			oMoveAllocationBlockLayoutCell.addContent(this._oFragment);
			this.oVizFrame = sap.ui.core.Fragment.byId(this.sFragmentId, "idVizFrameCon");
			var sXAxis = this.oResourceBundle.getText("xAxisAllocationConsumptionSectionLabel");
			var sYAxis = this.oResourceBundle.getText("yAxisAllocationConsumptionLabel");
			this.oConsumptionVizConfiguration = VizChartPropertiesConfig.moveAllocationConsumption;
			this.oConsumptionVizConfiguration.vizInitialProperties.plotArea.dataLabel.formatString = formatPattern.SHORTFLOAT_MFD2;
			this.oConsumptionVizConfiguration.vizInitialProperties.categoryAxis.title.text = sXAxis;
			this.oConsumptionVizConfiguration.vizInitialProperties.valueAxis.title.text = sYAxis;
			this.oVizFrame.setVizProperties(this.oConsumptionVizConfiguration.vizInitialProperties);
		},

		/*
		 * Method for Initialize XAxis Graph Property based on Selected F4.
		 * @public
		 */
		initializeXAxisTitle: function () {
			var oATPOverviewModel = this.oComponent.getModel("ATPOverviewModel");
			var aProductGroupToken = oATPOverviewModel.getProperty(this.viewModelPath + "/productGrpDetailTokens");
			var sXAxis;
			if (aProductGroupToken && aProductGroupToken.length > 0) {
				sXAxis = this.oResourceBundle.getText("xAxisAllocationConsumptionProductGrpLabel");
			} else {
				sXAxis = this.oResourceBundle.getText("xAxisAllocationConsumptionSectionLabel");
			}
			this.oConsumptionVizConfiguration.vizInitialProperties.categoryAxis.title.text = sXAxis;
			this.oVizFrame.setVizProperties(this.oConsumptionVizConfiguration.vizInitialProperties);
		},

		/*
		 * Method for set Viz Chart Dimension and Measures with Filters.
		 * @public
		 */
		setVizChartProperties: function () {
			var aFilters = [],
				oDataset = {},
				aDimensions, aFeed = [],
				oATPOverviewModel = this.oComponent.getModel("ATPOverviewModel"),
				oFlattenedDataset, oFeedCategoryAxis;
			var aProductGroupToken = oATPOverviewModel.getProperty(this.viewModelPath + "/productGrpDetailTokens");
			if (aProductGroupToken && aProductGroupToken.length > 0) {
				aDimensions = [{
					name: "Product Group",
					value: "{product_grp}"
				}];
			} else {
				aDimensions = [{
					name: "Section",
					value: "{zsection}"
				}];
			}
			oDataset.data = jQuery.extend(true, {}, this.oConsumptionVizConfiguration.data);
			oDataset.dimensions = aDimensions;
			oDataset.measures = this.oConsumptionVizConfiguration.measures;
			oFlattenedDataset = new FlattenedDataset(oDataset);
			this.oVizFrame.setDataset(oFlattenedDataset);
			oFeedCategoryAxis = sap.ui.core.Fragment.byId(this.sFragmentId, "idFeedStoreName");
			this.oVizFrame.removeFeed(oFeedCategoryAxis);
			for (var i = 0; i < aDimensions.length; i++) {
				aFeed.push(aDimensions[i].name);
			}
			oFeedCategoryAxis.setValues(aFeed);
			this.oVizFrame.addFeed(oFeedCategoryAxis);
			aFilters = this._createFilterForGraph();
			this.oVizFrame.getDataset().getBinding("data").filter(aFilters);
			//oATPOverviewModel.setProperty("/allocationAndConsumption/busy", false);
		},

		/*
		 * Method for Create Filters for Graph.
		 * @public
		 * @return return a Array of filters
		 */
		_createFilterForGraph: function () {
			var aFilters = [];
			var aTempFilters = [];
			var oATPOverviewModel = this.oComponent.getModel("ATPOverviewModel");
			var iCurrentWeek = oATPOverviewModel.getProperty(this.viewModelPath + "/startWeek");
			if (!iCurrentWeek) {
				iCurrentWeek = oATPOverviewModel.getProperty("/moveAllocationHistory/defaultData").CurrentWeek;
				this.formSelectedWeek(parseInt(iCurrentWeek.toString().slice(4, 6)), parseInt(iCurrentWeek.toString().slice(0, 4)));
				//oATPOverviewModel.setProperty(this.viewModelPath + "/startWeek", iCurrentWeek);
			}
			var aSectionToken = oATPOverviewModel.getProperty(this.viewModelPath + "/sectionTokens");
			var aProductGroupToken = oATPOverviewModel.getProperty(this.viewModelPath + "/productGrpDetailTokens");
			var index;
			var oFilter1 = new Filter({
				filters: [
					new Filter("week", FilterOperator.EQ, iCurrentWeek)
				]
			});

			if (aProductGroupToken && aProductGroupToken.length > 0) {
				for (index in aProductGroupToken) {
					aTempFilters.push(new Filter("product_grp", FilterOperator.EQ, aProductGroupToken[index].key));
				}
			} else if (aSectionToken && aSectionToken.length > 0) {
				for (index in aSectionToken) {
					aTempFilters.push(new Filter("zsection", FilterOperator.EQ, aSectionToken[index].key));
				}
			}

			var oFilter2 = new Filter({
				filters: aTempFilters
			});

			aFilters.push(new Filter({
				filters: [oFilter1, oFilter2],
				and: true
			}));
			return aFilters;

		},

		/*
		 * Method for Setting all Selected Token to the model from ValueHelp.
		 * @public
		 * @param {Array} [aTokens] array of all Selected Tokens
		 * @param {String} [aTokenProperty] Binding Property of Selected Value help Tokens
		 */
		setTokensFromValueHelp: function (aTokens, aTokenProperty) {
			var allTokens = [],
				ATPOverviewModel = this.getOwnerComponent().getModel("ATPOverviewModel");
			aTokens.forEach(function (item) {
				var oEmptyObject = {
					"key": item.getProperty("key"),
					"text": item.getProperty("text")
				};
				allTokens.push(oEmptyObject);
			});
			ATPOverviewModel.setProperty(this.viewModelPath + aTokenProperty, allTokens);
		},

		/*
		 * Method for Setting all Selected Token to the model for Initial Load.
		 * @public
		 * @param {Array} [aTokens] array of all Selected Tokens
		 * @param {String} [aTokenProperty] Binding Property of Selected Value help Tokens
		 */
		setTokensFromData: function (aTokens, aTokenProperty) {
			var allTokens = [],
				ATPOverviewModel = this.getOwnerComponent().getModel("ATPOverviewModel");
			aTokens.forEach(function (item) {
				var oEmptyObject = {
					"key": item.Section,
					"text": item.Section
				};
				allTokens.push(oEmptyObject);
			});
			ATPOverviewModel.setProperty(this.viewModelPath + aTokenProperty, allTokens);
		},

		/*
		 * Method for Fetching Section Data.
		 * @public
		 */
		_fetchSectionData: function () {
			var ATPOverviewModel = this.getOwnerComponent().getModel("ATPOverviewModel");
			//ATPOverviewModel.setProperty("/allocationAndConsumption/busy", true);
			this.getOwnerComponent().crud.whenRead({
				path: "/ZEIDPSD108_SET",
				busyControl: this.oView
			}).then(function (response) {
				var oData = response.data;
				ATPOverviewModel.setProperty(this.viewModelPath + "/sectionF4Data", oData.results);
				this.setTokensFromData(oData.results, "/sectionTokens");
				//ATPOverviewModel.setProperty("/allocationAndConsumption/busy", false);
				if (oData.results.length === 1) {
					ATPOverviewModel.setProperty(this.viewModelPath + "/bProductGroupEnable", true);
					this.fetchConsumptionProductGroupData();
				} else {
					//ATPOverviewModel.setProperty("/allocationAndConsumption/busy");
					ATPOverviewModel.setProperty(this.viewModelPath + "/productGrpDetailTokens", []);
					ATPOverviewModel.setProperty(this.viewModelPath + "/bProductGroupEnable", false);
				}
			}.bind(this), function (err, oResponse) {
				MessageToast.show("JSON Model not set");
			}.bind(this));
		},

		/*
		 * Method for Fetching Production Group Data.
		 * @public
		 */
		fetchConsumptionProductGroupData: function () {
			var ATPOverviewModel = this.getOwnerComponent().getModel("ATPOverviewModel");
			//ATPOverviewModel.setProperty("/allocationAndConsumption/busy", true);
			var aFilters = this._createFilter(ATPOverviewModel.getProperty(this.viewModelPath + "/sectionTokens"), "Section");
			this.getOwnerComponent().crud.whenRead({
				path: "/ZEIDPSD110_SET",
				filters: aFilters,
				busyControl: this.oView
			}).then(function (response) {
				var oData = response.data;
				ATPOverviewModel.setProperty(this.viewModelPath + "/productGrpDetailF4Data", oData.results);
				//ATPOverviewModel.setProperty("/allocationAndConsumption/busy", false);
			}.bind(this), function (err, oResponse) {
				MessageToast.show("JSON Model not set");
			}.bind(this));

		},

		/**
		 * Mathod used to create a filters
		 * @param {Array} [aTokens] array of all Tokens
		 * @param {String} [sFilterProp] property for Filter
		 * @return return a Array of filters
		 */
		_createFilter: function (aTokens, sFilterProp) {
			var aFilters = [];
			if (aTokens && aTokens.length > 0) {
				for (var i in aTokens) {
					aFilters.push(new Filter(sFilterProp, FilterOperator.EQ, aTokens[i].key));
				}
			}
			return aFilters;
		},

		/**
		 * Event handler for the data point select in the stacked column chart
		 * @public
		 * @param {object} oEvent - Event Object
		 */
		onLineChartDataPointSelect: function (oEvent) {
			var oChartContainer = sap.ui.core.Fragment.byId(this.sFragmentId, "idConsumptionChartContainer");

			this.oComponent.getRouter().navTo("AllocationVsConsumptionDetail");
			if (oChartContainer.getFullScreen()) {
				oChartContainer.setFullScreen(false);
			}

		},

		onSelectShowSuggestions: function (oEvent) {
			var sPath = oEvent.getParameter("selectedRow").getBindingContext("ATPOverviewModel").getPath();
			var ATPOverviewModel = this.oComponent.getModel("ATPOverviewModel");
			var selRowData = ATPOverviewModel.getProperty(sPath);
			var oCustomData = oEvent.getSource().data();
			var f4Name = oCustomData.f4name;
			var oDialogConfig = TimeMoveDialogConfig[f4Name];
			var aTokens = ATPOverviewModel.getProperty(this.viewModelPath + oDialogConfig.modelTokenProperty);
			var aTempObj = {
				"key": selRowData[oDialogConfig.entityKey],
				"text": selRowData[oDialogConfig.entityKey]
			};
			aTokens.push(aTempObj);
			ATPOverviewModel.setProperty(this.viewModelPath + oDialogConfig.modelTokenProperty, aTokens);
			ATPOverviewModel.refresh();

			if (f4Name === "sectionTypeF4") {
				this.setSectionInputProperty();
				/*if (aTokens.length === 1) {
					ATPOverviewModel.setProperty("/allocationAndConsumption/bProductGroupEnable", true);
					this.fetchConsumptionProductGroupData();
				} else {
					ATPOverviewModel.setProperty("/allocationAndConsumption/productGrpDetailTokens", []);
					ATPOverviewModel.setProperty("/allocationAndConsumption/bProductGroupEnable", false);
				}
			*/
			}

		},

		setSectionInputProperty: function () {
			var ATPOverviewModel = this.getOwnerComponent().getModel("ATPOverviewModel");
			var aTokens = ATPOverviewModel.getProperty(this.viewModelPath + "/sectionTokens");
			if (aTokens.length > 0) {
				ATPOverviewModel.setProperty(this.viewModelPath + "/sSectionValueState", "None");
			}
			if (aTokens.length === 1) {
				ATPOverviewModel.setProperty(this.viewModelPath + "/bProductGroupEnable", true);
				this.fetchConsumptionProductGroupData();
			} else {
				ATPOverviewModel.setProperty(this.viewModelPath + "/productGrpDetailTokens", []);
				ATPOverviewModel.setProperty(this.viewModelPath + "/bProductGroupEnable", false);
			}
		},

		/*
		 * Event handler used for open calendarweek
		 * @param {object} oEvent - Event Object
		 */
		onCalendarPress: function (oEvent) {
			var fragDialogId = this.createId("openweekCalendar"),
				oGrid,
				fragItemId = this.createId("openweekCalendarItem"),
				ATPOverviewModel = this.oComponent.getModel("ATPOverviewModel"),
				oTemplate;
			this._openWeekCalendar = ValueHelpDialogUtil._createFragment(fragDialogId, "com.samsung.aATPOverview.view.fragments.CalendarWeek",
				this);
			oGrid = this._openWeekCalendar.getContent()[2];
			oTemplate = ValueHelpDialogUtil._createFragment(fragItemId, "com.samsung.aATPOverview.view.fragments.CalendarWeekList", this);
			oGrid.bindAggregation("content", "ATPOverviewModel>/allocationAndConsumption/moveWeeks", oTemplate);
			this.oView.addDependent(this._openWeekCalendar);
			this._openWeekCalendar.openBy(oEvent.getSource());
			var sYear, oStartDate, sWeek, iCurrentWeek = ATPOverviewModel.getProperty("/moveAllocationHistory/defaultData").CurrentWeek;
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
				//oResourceModel = this.getResourceBundle(),
				ATPOverviewModel = this.oComponent.getModel("ATPOverviewModel");
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
				weekdate = this.oResourceBundle.getText("fromAndToDateText", [oStartingDate, oEndDingdate]);
				oEmptyObject = {
					"year": iYear,
					"week": iWeek,
					"weekdates": weekdate
				};
				//Updating the date to next week's start date
				oStartDate.setDate(oStartDate.getDate() - 7);
				aWeeks.push(oEmptyObject);
			}
			ATPOverviewModel.setProperty(this.viewModelPath + "/moveWeeks", aWeeks);
		},
		/*
		 *Method used to set calendar startweek and endweek data
		 * @{Param} oDate object Edm.date type 
		 */
		getIsoWeekdate: function (oStartDate) {
			var oStartingdate;
			//var oResourceModel = this.oComponent.getModel("i18n").getResourceBundle();
			switch (oStartDate.getMonth() + 1) {
			case 1:
				oStartingdate = oStartDate.getDate() + "-" + this.oResourceBundle.getText("januaryMonth") + "-" + oStartDate.getFullYear();
				break;

			case 2:
				oStartingdate = oStartDate.getDate() + "-" + this.oResourceBundle.getText("febraruryMonth") + "-" + oStartDate.getFullYear();
				break;

			case 3:
				oStartingdate = oStartDate.getDate() + "-" + this.oResourceBundle.getText("marchMonth") + "-" + oStartDate.getFullYear();
				break;

			case 4:
				oStartingdate = oStartDate.getDate() + "-" + this.oResourceBundle.getText("aprilMonth") + "-" + oStartDate.getFullYear();
				break;

			case 5:
				oStartingdate = oStartDate.getDate() + "-" + this.oResourceBundle.getText("mayMonth") + "-" + oStartDate.getFullYear();
				break;

			case 6:
				oStartingdate = oStartDate.getDate() + "-" + this.oResourceBundle.getText("juneMonth") + "-" + oStartDate.getFullYear();
				break;
			case 7:
				oStartingdate = oStartDate.getDate() + "-" + this.oResourceBundle.getText("julyMonth") + "-" + oStartDate.getFullYear();
				break;
			case 8:
				oStartingdate = oStartDate.getDate() + "-" + this.oResourceBundle.getText("augustMonth") + "-" + oStartDate.getFullYear();
				break;

			case 9:
				oStartingdate = oStartDate.getDate() + "-" + this.oResourceBundle.getText("septemberMonth") + "-" + oStartDate.getFullYear();
				break;

			case 10:
				oStartingdate = oStartDate.getDate() + "-" + this.oResourceBundle.getText("octoberMonth") + "-" + oStartDate.getFullYear();
				break;

			case 11:
				oStartingdate = oStartDate.getDate() + "-" + this.oResourceBundle.getText("novemberMonth") + "-" + oStartDate.getFullYear();
				break;

			case 12:
				oStartingdate = oStartDate.getDate() + "-" + this.oResourceBundle.getText("decemberMonth") + "-" + oStartDate.getFullYear();
				break;
			}
			return oStartingdate;
		},
		/*
		 * Event handler on calendar icon Press 
		 * @public
		 * @param {sap.ui.base.Event} [oEvent] the Event instance
		 */
		onWeekCalendPress: function (oEvent) {
			var sSelWeek,
				iWeek = oEvent.getSource().data("week"),
				//oResourceModel = this.getResourceBundle(),
				iYear = oEvent.getSource().data("year");
			var ATPOverviewModel = this.oComponent.getModel("ATPOverviewModel");
			/*ATPOverviewModel.setProperty(this.viewModelPath + "/sSelectedWeek", this.oResourceBundle.getText("calendarWeek", [iWeek, iYear]));
			//ATPOverviewModel.setProperty("/moveAllocationHistory/fromWeek", this.oResourceBundle.getText("calendarWeek", [iWeek, iYear]));
			if (iWeek < 10) {
				sSelWeek = String(iYear) + "0" + String(iWeek);
			} else {
				sSelWeek = String(iYear) + String(iWeek);
			}
			ATPOverviewModel.setProperty(this.viewModelPath + "/startWeek", sSelWeek);*/
			this.formSelectedWeek(iWeek, iYear);
			this._openWeekCalendar.close();
			ATPOverviewModel.refresh();
		},

		getTableBindingPath: function () {
			var oObject = {};
			switch (this.f4Name) {
			case "sectionF4":
				oObject.tablePath = "ATPOverviewModel>/allocationAndConsumption/sectionF4Data";
				break;
			case "productGrpDetailF4":
				oObject.tablePath = "ATPOverviewModel>/allocationAndConsumption/productGrpDetailF4Data";
				break;
			default:
				break;

			}
			return oObject;
		},

		getF4ConfigObjectName: function () {
			var sConfigName;

			if (this.f4Name.indexOf("section") !== -1) {
				sConfigName = "sectionF4";
			} else if (this.f4Name.indexOf("productGrpDetail") !== -1) {
				sConfigName = "productGrpDetailF4";
			}
			return sConfigName;
		},

		formSelectedWeek: function (iWeek, iYear) {
			var sSelWeek;
			var ATPOverviewModel = this.oComponent.getModel("ATPOverviewModel");
			ATPOverviewModel.setProperty(this.viewModelPath + "/sSelectedWeek", this.oResourceBundle.getText("calendarWeek", [iWeek, iYear]));
			//ATPOverviewModel.setProperty("/moveAllocationHistory/fromWeek", this.oResourceBundle.getText("calendarWeek", [iWeek, iYear]));
			if (iWeek < 10) {
				sSelWeek = String(iYear) + "0" + String(iWeek);
			} else {
				sSelWeek = String(iYear) + String(iWeek);
			}
			ATPOverviewModel.setProperty(this.viewModelPath + "/startWeek", sSelWeek);
		}
	});
});