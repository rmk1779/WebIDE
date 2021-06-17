sap.ui.define(["com/sap/atp/reuselib/BaseFragmentController",
	"../model/VizChartPropertiesConfig",
	"sap/viz/ui5/format/ChartFormatter",
	"sap/viz/ui5/api/env/Format",
	"com/samsung/aATPOverview/controller/BaseController",
	"sap/viz/ui5/data/FlattenedDataset",
	"com/samsung/aATPOverview/util/ValueHelpDialogUtil",
	"com/sap/atp/reuselib/utils/DateUtils",
	"../model/TimeMoveDialogConfig",
	"com/sap/atp/reuselib/constants",
	"sap/m/SearchField",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
], function (BaseFragmentController, VizChartPropertiesConfig, ChartFormatter, Format, BaseController, FlattenedDataset,
	ValueHelpDialogUtil, DateUtils,
	TimeMoveDialogConfig, constants, SearchField, Filter, FilterOperator) {
	return BaseFragmentController.extend("com.samsung.aATPOverview.controller.MoveAllocHistoryFragment.controller", {
		constructor: function (params) {
			BaseFragmentController.call(this, {
				id: "moveAllocationHistoryId",
				fragmentName: "com.samsung.aATPOverview.view.fragments.MoveAllocationHistory",
				component: params.component,
				contentDensity: params.contentDensity,
				model: params.model,
				view: params.view
			});
			this.oView = params.view;
			this.oComponent = params.component;
			this.oResourceBundle = this.oComponent.getModel("i18n").getResourceBundle();
			this.initializeFragment();
			this.fetchProductGroupF4Data();
		},

		onInit: function () {
			BaseFragmentController.prototype.onInit.apply(this, arguments);
		},
		initializeFragment: function () {
			Format.numericFormatter(ChartFormatter.getInstance());
			var oMoveAllocationBlockLayoutCell, formatPattern = ChartFormatter.DefaultPattern;
			oMoveAllocationBlockLayoutCell = this.oView.byId("idLineChartCell");
			oMoveAllocationBlockLayoutCell.addContent(this._oFragment);
			this.oVizFrame = sap.ui.core.Fragment.byId(this.sFragmentId, "idVizFrame");
			var sXAxis = this.oResourceBundle.getText("xAxisLabel");
			var sYAxis = this.oResourceBundle.getText("yAxisLabel");
			this.oVizConfiguration = VizChartPropertiesConfig.moveAllocationHistory;
			this.oVizConfiguration.vizInitialProperties.plotArea.dataLabel.formatString = formatPattern.SHORTFLOAT_MFD2;
			this.oVizConfiguration.vizInitialProperties.categoryAxis.title.text = sXAxis;
			this.oVizConfiguration.vizInitialProperties.valueAxis.title.text = sYAxis;
			this.oVizFrame.setVizProperties(this.oVizConfiguration.vizInitialProperties);
		},
		setVizChartProperties: function () {
			var aFilters, oDataset, aDimensions, aFeed = [],
				oATPOverviewModel = this.oComponent.getModel("ATPOverviewModel"),
				oFlattenedDataset, oFeedCategoryAxis;
			aDimensions = [{
				name: this.oResourceBundle.getText("WEEK"),
				value: "{log_week}"
			}];
			oDataset = this.oVizConfiguration.dataSet;
			oDataset.dimensions = aDimensions;
			oDataset.measures = this.oVizConfiguration.measures;
			oFlattenedDataset = new FlattenedDataset(oDataset);
			this.oVizFrame.setDataset(oFlattenedDataset);
			oFeedCategoryAxis = sap.ui.core.Fragment.byId(this.sFragmentId, "idFeed2");
			this.oVizFrame.removeFeed(oFeedCategoryAxis);
			for (var i = 0; i < aDimensions.length; i++) {
				aFeed.push(aDimensions[i].name);
			}
			oFeedCategoryAxis.setValues(aFeed);
			this.oVizFrame.addFeed(oFeedCategoryAxis);
			aFilters = ValueHelpDialogUtil.formWeekFilters(this.oResourceBundle, oATPOverviewModel, oATPOverviewModel.getProperty(
				"/moveAllocationHistory/defaultData").CurrentWeek, "");
			this.oVizFrame.getDataset().getBinding("data").filter(aFilters);
		},
		getVizFrame: function () {
			return this.oVizFrame;
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
			oGrid.bindAggregation("content", "ATPOverviewModel>/moveAllocationHistory/moveWeeks", oTemplate);
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
			ATPOverviewModel.setProperty("/moveAllocationHistory/moveWeeks", aWeeks);
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
			ATPOverviewModel.setProperty("/moveAllocationHistory/sSelectedWeek", this.oResourceBundle.getText("calendarWeek", [iWeek, iYear]));
			ATPOverviewModel.setProperty("/moveAllocationHistory/fromWeek", this.oResourceBundle.getText("calendarWeek", [iWeek, iYear]));
			if (iWeek < 10) {
				sSelWeek = String(iYear) + "0" + String(iWeek);
			} else {
				sSelWeek = String(iYear) + String(iWeek);
			}
			ATPOverviewModel.setProperty("/moveAllocationHistory/startWeek", sSelWeek);
			this._openWeekCalendar.close();
			ATPOverviewModel.refresh();
		},
		/**
		 * Event Handler for Product Group MultiInput Token Update
		 * @public
		 * @param {object} oEvent - Event Object
		 */
		onProductGroupTokenUpdate: function (oEvent) {
			let oDialogConfig = TimeMoveDialogConfig.productGroupF4,
				ATPOverviewModel = this.oComponent.getModel("ATPOverviewModel");
			let sToken = ValueHelpDialogUtil.updateTokens(ATPOverviewModel, oDialogConfig.modelTokenProperty, oEvent);
			ValueHelpDialogUtil._setTreeSelection(ATPOverviewModel, sToken, oEvent.getParameters().type,
				"/moveAllocationHistory/productGroupF4FlatData", oDialogConfig.modelDataProperty,
				oDialogConfig.entityKey);
		},
		/**
		 * Mathod used for selection change of tree table check box
		 * @param {Constructor} [oEvent]  
		 */
		onChangeSelectionCB: function (oEvent) {
			//	let viewModelName = this.viewModelName;
			let ATPOverviewDataModel = this.oComponent.getModel("ATPOverviewModel");
			let oContext = oEvent.getSource().getBindingContext("ATPOverviewModel");
			let oTable = sap.ui.core.Fragment.byId("idProductGroupTreeTable", "idProductGroupTable");
			let oDialog = sap.ui.core.Fragment.byId("idProductGroupValueHelpDialog", "idProductGroupValueHelpDialog");
			let oBinding = oTable.getBinding("rows");
			let currentRow = oEvent.getSource().getBindingContext("ATPOverviewModel").getObject();
			let rowSelection = [currentRow];
			let aProductGroupTokens = ATPOverviewDataModel.getProperty("/moveAllocationHistory/productGroupTokens") || [];
			let bLowerLevel = ATPOverviewDataModel.getProperty("/moveAllocationHistory/lowLevelSelect");
			let sapTokens = [];

			if (bLowerLevel) {
				ValueHelpDialogUtil.fnUpdateChildSelection(oBinding, oContext, "/checked", oEvent.getParameter("selected"), rowSelection);
			}

			rowSelection.forEach(function (oRow) {
				let productID = oRow.Product;
				let id;
				for (id = 0; id < aProductGroupTokens.length; id++) {
					if (aProductGroupTokens[id].key === productID) {
						break;
					}
				}

				if (oRow.checked) {
					aProductGroupTokens.push({
						key: oRow.Product,
						text: oRow.Product
					});
				} else {
					aProductGroupTokens.splice(id, 1);
				}
			});
			sapTokens = aProductGroupTokens.map(function (item) {
				return new sap.m.Token({
					key: item.key,
					text: item.text
				});
			});
			oDialog.setTokens([]);
			oDialog.setTokens(sapTokens);
			ATPOverviewDataModel.setProperty("/moveAllocationHistory/productGroupTokens", aProductGroupTokens);
			ATPOverviewDataModel.refresh();
		},
		/**
		 * Event Handler to Handle Product Group Value Help Update Selection Change
		 * @public
		 * @param {object} oEvent - Event Object
		 */
		onProductGroupValueHelpUpdateSelection: function (oEvent) {
			let oATPOverviewModel = this.oComponent.getModel("ATPOverviewModel"),
				oCustomData = oEvent.getSource().data(),
				oDialogConfig = TimeMoveDialogConfig[oCustomData.f4name];
			ValueHelpDialogUtil.onBaseValueHelpUpdateSelection(oEvent, oDialogConfig.entityKey, "/moveAllocationHistory/productGroupF4FlatData",
				oDialogConfig.isTreeFilter);
			oATPOverviewModel.setProperty("/moveAllocationHistory/backUpProductTokens", jQuery.extend(true, [], oATPOverviewModel.getProperty(
				"/moveAllocationHistory/productGroupTokens")));
			oATPOverviewModel.setProperty("/moveAllocationHistory/backUpProductTableData", jQuery.extend(true, [], oATPOverviewModel.getProperty(
				"/moveAllocationHistory/productGroupF4Data")));
		},
		/**
		 * Event handler for the data point select in the stacked column chart
		 * @public
		 * @param {object} oEvent - Event Object
		 */
		onLineChartDataPointSelect: function (oEvent) {
			var oChartContainer = sap.ui.core.Fragment.byId(this.sFragmentId, "idChartContainer"),
				sSelectedLogWeek, sMoveType, aData = oEvent.getParameter("data"),
				oATPOverviewModel = this.oComponent.getModel("ATPOverviewModel");
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
			oATPOverviewModel.setProperty("/moveAllocationHistory/moveType", sMoveType);
			oATPOverviewModel.setProperty("/moveAllocationHistory/selectedLogWeek", sSelectedLogWeek);
			this.oComponent.getRouter().navTo("MoveAllocationHistoryDetail");
			if (oChartContainer.getFullScreen()) {
				oChartContainer.setFullScreen(false);
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
			this.oValueHelpDialog = ValueHelpDialogUtil._createFragment(oDialogConfig.fragmentId, oDialogConfig.fragmentPath, this);
			var oTreeTable = ValueHelpDialogUtil._createFragment(oDialogConfig.tableId, oDialogConfig.tablePath, this);
			var oBasicSearch = new SearchField({
				search: this.onProductGroupTreeSearch.bind(this, oDialogConfig.entityKey)
			});
			ValueHelpDialogUtil.openValueHelpDialog(this.oView, this.oValueHelpDialog, this.oMultiInput, oTreeTable, oBasicSearch);
		},

		/**
		 * Method for Search the Product Group Tree data from Table
		 * @public
		 * @param {object} oEvent - Event Object
		 */
		onProductGroupTreeSearch: function () {
			ValueHelpDialogUtil.onBaseItemTreeSearch(this.oValueHelpDialog, "Product");
		},

		/**
		 * Method For close Value Help Dialog on Cancel button press.
		 * @public
		 * @param {Constructor} [oEvent] Cancel Button Press Event in F4
		 */
		onValueHelpCancelPress: function (oEvent) {
			var oATPOverviewModel = this.oComponent.getModel("ATPOverviewModel"),
				oSource = oEvent.getSource();
			oATPOverviewModel.setProperty("/moveAllocationHistory/productGroupTokens", oATPOverviewModel.getProperty(
				"/moveAllocationHistory/backUpProductTokens"));
			oATPOverviewModel.setProperty("/moveAllocationHistory/productGroupF4Data", oATPOverviewModel.getProperty(
				"/moveAllocationHistory/backUpProductTableData"));
			oSource.close();
		},

		/**
		 * Method to fetch the Product Group Data for the F4 Dialog
		 * Invoked to build the Tree JSON data for the dialog
		 * @private
		 * @return {Promise} Promise
		 */
		fetchProductGroupF4Data: function () {
			let ATPOverviewModel = this.oComponent.getModel("ATPOverviewModel");
			this.oComponent.crud.whenRead({
				path: "/ZEIDPSD107_SET",
				busyControl: this.oView
			}).then(function (response) {
				//resolve(response);
				let oData = response.data;
				var oCopyData = jQuery.extend(true, {}, oData);
				var oTreeData = ValueHelpDialogUtil._flatToHeirarchy(oCopyData.results);
				ATPOverviewModel.setProperty("/moveAllocationHistory/productGroupF4Data", oTreeData);
				ATPOverviewModel.setProperty("/moveAllocationHistory/productGroupF4FlatData", oCopyData.results);
			}.bind(this), function () {
				//MessageToast.show("JSON Model not set");
			});
		},

		/*
		 * Event handler of Clear all Selected Product Group In F4
		 * @public
		 * @param {sap.ui.base.Event} [oEvent] the Event instance
		 */
		onClearAllSelection: function () {
			var ATPOverviewModel = this.oComponent.getModel("ATPOverviewModel");
			ATPOverviewModel.setProperty("/moveAllocationHistory/productGroupTokens", []);
			var oTable = this.oValueHelpDialog.getTable();
			oTable.expandToLevel(4);
			var aData = oTable.getBinding("rows").getModel().getProperty("/moveAllocationHistory/productGroupF4Data");
			this.setProductGroupCheckProperty(aData);
			this.oValueHelpDialog.setTokens([]);
			ATPOverviewModel.refresh();
		},

		/*
		 * Method to Clear all Selected Product Groups and Children data In F4
		 * @public
		 * @param {Array} [aData] array of records
		 */
		setProductGroupCheckProperty: function (aData) {
			jQuery.each(aData, function (index, oRow) {
				oRow.checked = false;
				if (oRow.hasOwnProperty("children")) {
					this.setProductGroupCheckProperty(oRow.children);
				}
			}.bind(this));
		},

		/**
		 * Event Handler to invoke the Base Controller's Remove Token method
		 * @public
		 * @param {object} oEvent - Event Object
		 */
		onTokenRemove: function (oEvent) {
			let aProductGroupTokens = this.oComponent.getModel("ATPOverviewModel").getProperty("/moveAllocationHistory/productGroupTokens"),
				tokenKeys = oEvent.getParameter("tokenKeys"),
				oJsonModel = this.oComponent.getModel("ATPOverviewModel"),
				productGroupF4Data = oJsonModel.getProperty("/moveAllocationHistory/productGroupF4Data");
			tokenKeys.forEach(function (tokenKey) {
				let removedRow = ValueHelpDialogUtil.searchTokenInTreeData(productGroupF4Data, tokenKey),
					id;
				if (removedRow) {
					removedRow.checked = false;
				}
				for (id = 0; id < aProductGroupTokens.length; id++) {
					if (aProductGroupTokens[id].key === tokenKey) {
						aProductGroupTokens.splice(id, 1);
					}
				}
				ValueHelpDialogUtil._setTreeSelection(tokenKey, oEvent.getParameters().type, "/moveAllocationHistory/productGroupF4FlatData",
					"productGroupF4Data", "Seller");

			});
			oJsonModel.refresh();
		},
		/**
		 * Mathod used to Search token in Tree Data
		 * @param {Array} [oData] array of Data
		 * @param {String} [sTokenKey] key of token 
		 */
		searchTokenInTreeData: function (aData, sTokenKey) {
			if (aData && aData.Product === sTokenKey) {
				return aData;
			} else if (aData.length) {
				let result = null;
				for (let i = 0; i < aData.length; i++) {
					result = this.searchTokenInTreeData(aData[i], sTokenKey);
					if (result) {
						return result;
					}
				}
			} else if (aData.children && aData.children.length) {
				let result = null;
				for (let i = 0; i < aData.children.length; i++) {
					result = this.searchTokenInTreeData(aData.children[i], sTokenKey);
					if (result) {
						return result;
					}
				}
			}
			return null;
		},

		/**
		 * Method For close Prodcut Group Value Help Dialog.
		 * @public
		 */
		onProductGroupDialogClose: function () {
			let ATPOverviewModel = this.oComponent.getModel("ATPOverviewModel");
			ATPOverviewModel.setProperty("/moveAllocationHistory/busy", false);
			this.oValueHelpDialog.close();
		},
		/**
		 * Event Handler for Product Group table Selection change
		 * @public
		 * @param {object} oEvent - Event Object
		 * @returns {boolean} flag
		 */
		onProductGroupSelectionChange: function (oEvent) {
			oEvent.preventDefault();
			return false;
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
		/**
		 * Event Handler for the checkbox update
		 * @public
		 * @param {object} oEvent - Event Object
		 */
		onLowlevelSelected: function (oEvent) {
			let aATPOverviewModel = this.oComponent.getModel("ATPOverviewModel");
			aATPOverviewModel.setProperty("/moveAllocationHistory/lowLevelSelect", oEvent.getSource().getSelected());
		},
		/*
		 *Method used to get the filters for sellarmove Table
		 *return array filters
		 */
		_getMoveAllocationHistoryfilters: function () {
			var oWeekFilter, sStartWeek, oSellarVal, oATPOverviewModel = this.oComponent.getModel("ATPOverviewModel"),
				iCurrentWeek = oATPOverviewModel.getProperty("/moveAllocationHistory/defaultData").CurrentWeek,
				aFilters = [];
			oSellarVal = oATPOverviewModel.getProperty("/moveAllocationHistory/productGroupTokens");
			sStartWeek = oATPOverviewModel.getProperty("/moveAllocationHistory/startWeek");
			if (oSellarVal && oSellarVal.length !== 0) {
				for (var i in oSellarVal) {
					aFilters.push(new Filter("product_group", FilterOperator.EQ, oSellarVal[i].key));
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
				oVizFrameBinding = this.oVizFrame.getDataset().getBinding("data");
			oVizFrameBinding.filter(aFilters);
		}
	});
});