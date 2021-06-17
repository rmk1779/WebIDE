/*&--------------------------------------------------------------------------------------*
 * File Name	                       : AllocationHistoryView.controller.js             *
 * Created By                          :                   		        				 *
 * Created On                          : 11-Feb-2020                               		 *
 * Stories                             :                            					 *
 * Transport No                        :		                                         *
 * Purpose                             : Manage Allocation History View 			     *
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
	"./BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/m/SearchField",
	"com/sap/atp/reuselib/SmartTableBindingUpdate",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"com/sap/atp/reuselib/utils/DateUtils",
	"com/samsung/aATPOverview/util/ValueHelpDialogUtil",
	"../model/TimeMoveDialogConfig",
	"../model/formatter",
	"com/sap/atp/reuselib/constants"
], function (BaseController, JSONModel, SearchField, SmartTableBinding, Filter, FilterOperator, DateUtils, ValueHelpDialogUtil, TimeMoveDialogConfig, formatter, constants) {
	"use strict";

	return BaseController.extend("com.samsung.aATPOverview.controller.MoveAllocationHistoryDetail", {
		viewModelPath: "/moveAllocationHistory",
		formatter: formatter,

		/* =========================================================== */
		/* lifecycle methods                                           */
		/* =========================================================== */

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf com.samsung.MoveAllovationHistory.view.AllocationHistoryView
		 */
		onInit: function () {
			this.oRouter = this.getRouter();
			this.oResourceBundle = this.getResourceBundle();
			this.oRouter.getRoute("MoveAllocationHistoryDetail").attachPatternMatched(this.onRouteMatched, this);
			this.oRouter.attachRouteMatched(this.onRouteMatched, this);
			// var oFilter = this.byId("filterBarId");
			// if(oFilter){
			// oFilter.variantsInitialized();
			// }
		},

		onRouteMatched: function (oEvent) {
			var sRouteName = oEvent.getParameter("name");
			if (sRouteName === "MoveAllocationHistoryDetail") {
				setTimeout(function(){ this.byId("idHistoryMoveList").rebindTable();}.bind(this), 0);
				this._initializeFilters();
			}
		},
		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf com.samsung.MoveAllovationHistory.view.AllocationHistoryView
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf com.samsung.MoveAllovationHistory.view.AllocationHistoryView
		 */
		onAfterRendering: function () {
			// this._initializeFilters();
			// oTable = this.getView().byId("idHistoryMoveList");
		},
		
		getToolbarText: function(week, seller, moveType){
			return ""+ week+ seller+ moveType;
		},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf com.samsung.MoveAllovationHistory.view.AllocationHistoryView
		 */
		//	onExit: function() {
		//
		//	}

		onBeforeRebindMoveListHistory: function (oEvent) {
			let sToWeek, sFromWeek, aSections, aProducts, aItems, aFromSiteTokens, aFromSellerTokens, oUpdate = new SmartTableBinding(oEvent.getParameter("bindingParams")),oMoveTypeComboBox,aMoveKeys,
				oModel = this.getOwnerComponent().getModel("ATPOverviewModel"),
				tooltip = "Filters: ";
			oMoveTypeComboBox = this.byId("idMoveType");
			aMoveKeys = oMoveTypeComboBox.getSelectedKeys();
			//var sCurrentWeek = oModel.getProperty("/defaultData").CurrentWeek ;
			var sSelectedLogWeek = oModel.getProperty("/moveAllocationHistory/moveWeekValue"); 
			var allProducts =  oModel.getProperty("/moveAllocationHistory/productGrpDetailTokens") || []; 
			//var sMoveTypeFilterVal = oModel.getProperty("/moveAllocationHistory/moveType") || "";
			var aToSellerTokens = oModel.getProperty("/moveAllocationHistory/toSellerTokens") || [];
			var aToSiteTokens = oModel.getProperty("/moveAllocationHistory/toSiteTokens") || [];
			var aMoveUserTokens = oModel.getProperty("/moveAllocationHistory/moveUserTokens") || [];
			var sMoveDate = oModel.getProperty("/moveAllocationHistory/moveDate");
			var sMoveTime = oModel.getProperty("/moveAllocationHistory/moveTime");
			sToWeek = oModel.getProperty("/moveAllocationHistory/toWeekValue");
			sFromWeek = oModel.getProperty("/moveAllocationHistory/fromWeekValue");
			aSections = oModel.getProperty("/moveAllocationHistory/sectionTokens")|| [];
			aProducts = oModel.getProperty("/moveAllocationHistory/productTokens")|| [];
			aItems = oModel.getProperty("/moveAllocationHistory/materialTokens")|| [];
			aFromSiteTokens = oModel.getProperty("/moveAllocationHistory/fromSiteTokens")|| [];
			aFromSellerTokens = oModel.getProperty("/moveAllocationHistory/fromSellerTokens")|| [];
			
			var oTable = oEvent.getSource();
			if(!oTable.getTable()){
				oUpdate.prevent();
			}
			let moveStr = "";
			if (aMoveKeys && aMoveKeys.length > 0) {
				// oUpdate.addFilter("move_type", FilterOperator.EQ, sMoveTypeFilterVal.toUpperCase());
				// tooltip += " Move: " + sMoveTypeFilterVal.toUpperCase();
				aMoveKeys.forEach(function(token) {
					if(token){
						oUpdate.addFilter("move_type", FilterOperator.EQ, token);
						moveStr += token + ", ";
					}
				});
				tooltip += ", Move: " + moveStr.trim().substring(0, moveStr.length -2);
			}else{				
				tooltip += " Move: ALL";
			}
			
			if(sSelectedLogWeek){
				oUpdate.addFilter("log_week", FilterOperator.EQ, sSelectedLogWeek);
				tooltip += ", Week: " + sSelectedLogWeek;
			}
			if(sMoveDate){
				oUpdate.addFilter("log_date", FilterOperator.EQ, sMoveDate);
				tooltip += ", Move Date: " + sMoveDate;
			}
			if(sMoveTime){
				oUpdate.addFilter("move_time", FilterOperator.EQ, sMoveTime);
				tooltip += ", Move Time: " + sMoveTime;
			}
			if(sToWeek){
				oUpdate.addFilter("to_week", FilterOperator.EQ, sToWeek);
				tooltip += ", To Week: " + sToWeek;
			}
			if(sFromWeek){
				oUpdate.addFilter("from_week", FilterOperator.EQ, sFromWeek);
				tooltip += ", From Week: " + sFromWeek;
			}
			oUpdate.endFilterAnd();
			let productGroupStr = "";
			if(allProducts && allProducts.length > 0){
				allProducts.forEach(function(token) {
					if (token.key) {
						oUpdate.addFilter("product_group", FilterOperator.EQ, token.key);
						productGroupStr += token.key + ", ";
					}
				});
				tooltip += ", Product Group: " + productGroupStr.trim().substring(0, productGroupStr.length -2);
			}
			oUpdate.endFilterOr();
			//oUpdate.endFilterAnd();
			let toSellerStr = "";
			if(aToSellerTokens && aToSellerTokens.length > 0){
				aToSellerTokens.forEach(function(token) {
					if (token.key) {
						oUpdate.addFilter("to_seller", FilterOperator.EQ, token.key);
						toSellerStr += token.key + ", ";
					}
				});
				tooltip += ", To Seller: " + toSellerStr.trim().substring(0, toSellerStr.length -2);
			}
			oUpdate.endFilterOr();
			//oUpdate.endFilterAnd();
			let toSiteStr = "";
			if(aToSiteTokens && aToSiteTokens.length > 0){
				aToSiteTokens.forEach(function(token) {
					if (token.key) {
						oUpdate.addFilter("to_logical_site", FilterOperator.EQ, token.key);
						toSiteStr += token.key + ", ";
					}
				});
				tooltip += ", To Site: " + toSiteStr.trim().substring(0, toSiteStr.length -2);
			}
			oUpdate.endFilterOr();
			//oUpdate.endFilterAnd();
			let moveUserStr = "";
			if(aMoveUserTokens && aMoveUserTokens.length > 0){
				aMoveUserTokens.forEach(function(token) {
					if (token.key) {
						oUpdate.addFilter("log_user", FilterOperator.EQ, token.key);
						moveUserStr += token.key + ", ";
					}
				});
				tooltip += ", Move User: " + moveUserStr.trim().substring(0, moveUserStr.length -2);
			}
			oUpdate.endFilterOr();
			let sectionStr = "";
			if(aSections && aSections.length > 0){
				aSections.forEach(function(token) {
					if (token.key) {
						oUpdate.addFilter("zsection", FilterOperator.EQ, token.key);
						sectionStr += token.key + ", ";
					}
				});
				tooltip += ", Section: " + sectionStr.trim().substring(0, sectionStr.length -2);
			}
			oUpdate.endFilterOr();
			let productStr = "";
			if(aProducts && aProducts.length > 0){
				aProducts.forEach(function(token) {
					if (token.key) {
						oUpdate.addFilter("section_product", FilterOperator.EQ, token.key);
						productStr += token.key + ", ";
					}
				});
				tooltip += ", Product: " + productStr.trim().substring(0, productStr.length -2);
			}
			oUpdate.endFilterOr();
			let materialStr = "";
			if(aItems && aItems.length > 0){
				aItems.forEach(function(token) {
					if (token.key) {
						oUpdate.addFilter("product", FilterOperator.EQ, token.key);
						materialStr += token.key + ", ";
					}
				});
				tooltip += ", Material: " + materialStr.trim().substring(0, materialStr.length -2);
			}
			oUpdate.endFilterOr();
			let fromSiteStr = "";
			if(aFromSiteTokens && aFromSiteTokens.length > 0){
				aFromSiteTokens.forEach(function(token) {
					if (token.key) {
						oUpdate.addFilter("from_logical_site", FilterOperator.EQ, token.key);
						fromSiteStr += token.key + ", ";
					}
				});
				tooltip += ", From Site: " + fromSiteStr.trim().substring(0, fromSiteStr.length -2);
			}
			let fromSellerStr = "";
			if(aFromSellerTokens && aFromSellerTokens.length > 0){
				aFromSellerTokens.forEach(function(token) {
					if (token.key) {
						oUpdate.addFilter("from_seller", FilterOperator.EQ, token.key);
						fromSellerStr += token.key + ", ";
					}
				});
				tooltip += ", From Seller: " + fromSellerStr.trim().substring(0, fromSellerStr.length -2);
			}
			oUpdate.endFilterAnd();
			this.byId("idTableToolbar").setText(tooltip);
		},
		
		/**
		 * Method to Initial the F4 Data for the Filters
		 * Also to fetch the Current CW for Time Move
		 * @private
		 */
		_initializeFilters: function () {
			var sSelectedLogWeek,sYear,sWeek, sMoveType,oMoveDate, oMoveTime, oMoveTypeComboBox, aChartProductTokens, oModel = this.getOwnerComponent().getModel("ATPOverviewModel");
			sSelectedLogWeek = oModel.getProperty("/moveAllocationHistory/selectedLogWeek");
			sMoveType = oModel.getProperty("/moveAllocationHistory/moveType");
			aChartProductTokens = oModel.getProperty("/moveAllocationHistory/productGroupTokens")  || [];
			oMoveTypeComboBox = this.byId("idMoveType");
			oMoveDate = this.byId("moveDateId");
			oMoveTime = this.byId("moveTimeId");
			sYear = sSelectedLogWeek.toString().slice(0, 4);
			sWeek = sSelectedLogWeek.toString().slice(4, 6);
			oModel.setProperty("/moveAllocationHistory/moveWeekValue", sSelectedLogWeek);
			oModel.setProperty("/moveAllocationHistory/moveWeekButtonText", this.oResourceBundle.getText("calendarWeek", [parseInt(sWeek), parseInt(sYear)]));
			oModel.setProperty("/moveAllocationHistory/toWeekButtonText", this.oResourceBundle.getText("selectWeek"));
			oModel.setProperty("/moveAllocationHistory/fromWeekButtonText", this.oResourceBundle.getText("selectWeek"));
			oModel.setProperty("/moveAllocationHistory/productGrpDetailTokens",aChartProductTokens);
			oModel.setProperty("/moveAllocationHistory/materialTokens",[]);
			oModel.setProperty("/moveAllocationHistory/toSiteTokens",[]);
			oModel.setProperty("/moveAllocationHistory/fromSiteTokens",[]);
			oModel.setProperty("/moveAllocationHistory/toSellerTokens",[]);
			oModel.setProperty("/moveAllocationHistory/fromSellerTokens",[]);
			oModel.setProperty("/moveAllocationHistory/moveUserTokens",[]);
			oModel.setProperty("/moveAllocationHistory/sectionTokens",[]);
			oModel.setProperty("/moveAllocationHistory/productTokens",[]);
			oModel.setProperty("/moveAllocationHistory/toWeekValue",null);
			oModel.setProperty("/moveAllocationHistory/fromWeekValue",null);
			oModel.setProperty("/moveAllocationHistory/moveDate",null);
			oModel.setProperty("/moveAllocationHistory/moveTime",null);
			oMoveDate.setDateValue(null);
			oMoveTime.setDateValue(null);
			if(sMoveType){
				oMoveTypeComboBox.setSelectedKeys([sMoveType]);	
			} else {
				oMoveTypeComboBox.setSelectedKeys([constants.SELLER_MOVETYPE,constants.SITE_MOVETYPE,constants.TIME_MOVETYPE]);
			}
			this._fetchSiteF4Data();
			this._fetchMoveUserF4Data();
			this._fetchSellerF4Data();
			this._fetchSectionF4Data();
			this._fetchDetailProductGroupF4Data();
			this._fetchProductF4Data();
			this._fetchMaterialF4Data();
			this._fetchMoveTypeF4Data();
			
		},
		
		/**
		 * Method used to fetch site Entity data for Site F4
		 */
		_fetchSiteF4Data: function () {
			var ATPOverviewModel;
			ATPOverviewModel = this.getOwnerComponent().getModel("ATPOverviewModel");
			this.getOwnerComponent().crud.whenRead({
				path: "/ZEIDPSD109_SET",
				busyControl: this.getView()
			}).then(function (response) {
				let oData = response.data;
				var oCopyData = jQuery.extend(true, {}, oData);
				ATPOverviewModel.setProperty("/moveAllocationHistory/siteF4Data", oCopyData.results);
				ATPOverviewModel.setProperty("/moveAllocationHistory/toSiteF4Data", oCopyData.results);
				ATPOverviewModel.setProperty("/moveAllocationHistory/fromSiteF4Data", oCopyData.results);
			}.bind(this), function (err) {
				//MessageToast.show("JSON Model not set");
			}.bind(this));
		},
		
		/**
		 * Method used to fetch site Entity data for Site F4
		 */
		_fetchMoveUserF4Data: function () {
			var ATPOverviewModel;
			ATPOverviewModel = this.getOwnerComponent().getModel("ATPOverviewModel");
			this.getOwnerComponent().crud.whenRead({
				path: "/ZCCDPSD1_MOVE_USER",
				busyControl: this.getView()
			}).then(function (response) {
				let oData = response.data;
				var oCopyData = jQuery.extend(true, {}, oData);
				ATPOverviewModel.setProperty("/moveAllocationHistory/moveUserF4Data", oCopyData.results);
			}.bind(this), function (err) {
				//MessageToast.show("JSON Model not set");
			}.bind(this));
		},
		
		/**
		 * Method used to fetch site Entity data for Site F4
		 */
		_fetchSellerF4Data: function () {
			var ATPOverviewModel;
			ATPOverviewModel = this.getOwnerComponent().getModel("ATPOverviewModel");
			this.getOwnerComponent().crud.whenRead({
				path: "/ZEIDPSD103_SET",
				busyControl: this.getView()
			}).then(function (response) {
				let oData = response.data;
				var oCopyData = jQuery.extend(true, {}, oData);
				var oTreeData = ValueHelpDialogUtil._flatToHeirarchy(oCopyData.results);
				ATPOverviewModel.setProperty("/moveAllocationHistory/toSellerF4Data", oTreeData);
				ATPOverviewModel.setProperty("/moveAllocationHistory/fromSellerF4Data", oTreeData);
				ATPOverviewModel.setProperty("/moveAllocationHistory/sellerF4FlatData", oCopyData.results);
			}.bind(this), function (err) {
				//MessageToast.show("JSON Model not set");
			}.bind(this));
		},
		
		/**
		 * Method used to fetch Product Group Entity data for Product Group F4
		 */
		_fetchDetailProductGroupF4Data: function () {
			var ATPOverviewModel;
			ATPOverviewModel = this.getOwnerComponent().getModel("ATPOverviewModel");
			this.getOwnerComponent().crud.whenRead({
				path: "/ZEIDPSD110_SET",
				busyControl: this.getView()
			}).then(function (response) {
				let oData = response.data;
				var oCopyData = jQuery.extend(true, {}, oData);
				ATPOverviewModel.setProperty("/moveAllocationHistory/productGrpDetailF4Data", oCopyData.results);
			}.bind(this), function (err) {
				//MessageToast.show("JSON Model not set");
			}.bind(this));
		},
		
		/**
		 * Method used to fetch Section Entity data for Section F4
		 */
		_fetchSectionF4Data: function () {
			var ATPOverviewModel;
			ATPOverviewModel = this.getOwnerComponent().getModel("ATPOverviewModel");
			this.getOwnerComponent().crud.whenRead({
				path: "/ZEIDPSD105_SET",
				busyControl: this.getView()
			}).then(function (response) {
				let oData = response.data;
				var oCopyData = jQuery.extend(true, {}, oData);
				ATPOverviewModel.setProperty("/moveAllocationHistory/sectionF4Data", oCopyData.results);
			}.bind(this), function (err) {
				//MessageToast.show("JSON Model not set");
			}.bind(this));
		},
		
		/**
		 * Method used to fetch Product Entity data for Product F4
		 */
		_fetchProductF4Data: function () {
			var ATPOverviewModel;
			ATPOverviewModel = this.getOwnerComponent().getModel("ATPOverviewModel");
			this.getOwnerComponent().crud.whenRead({
				path: "/ZEIDPSD111_SET",
				busyControl: this.getView()
			}).then(function (response) {
				let oData = response.data;
				var oCopyData = jQuery.extend(true, {}, oData);
				ATPOverviewModel.setProperty("/moveAllocationHistory/productF4Data", oCopyData.results);
			}.bind(this), function (err) {
				//MessageToast.show("JSON Model not set");
			}.bind(this));
		},
		
		/**
		 * Method used to fetch Material Entity data for Material F4
		 */
		_fetchMaterialF4Data: function () {
			var ATPOverviewModel;
			ATPOverviewModel = this.getOwnerComponent().getModel("ATPOverviewModel");
			this.getOwnerComponent().crud.whenRead({
				path: "/ZEIDPSD102_SET",
				busyControl: this.getView()
			}).then(function (response) {
				let oData = response.data;
				var oCopyData = jQuery.extend(true, {}, oData);
				ATPOverviewModel.setProperty("/moveAllocationHistory/materialF4Data", oCopyData.results);
			}.bind(this), function (err) {
				//MessageToast.show("JSON Model not set");
			}.bind(this));
		},
		
		/**
		 * Method used to fetch Move Type Entity data for MoveType F4
		 */
		_fetchMoveTypeF4Data: function () {
			var ATPOverviewModel;
			ATPOverviewModel = this.getOwnerComponent().getModel("ATPOverviewModel");
			this.getOwnerComponent().crud.whenRead({
				path: "/ZEIDPSD104_SET",
				busyControl: this.getView()
			}).then(function (response) {
				let oData = response.data;
				var oCopyData = jQuery.extend(true, {}, oData);
				ATPOverviewModel.setProperty("/moveAllocationHistory/moveTypeF4Data", oCopyData.results);
			}.bind(this), function (err) {
				//MessageToast.show("JSON Model not set");
			}.bind(this));
		},
		
		/**
		 * Common Event Handler for all the Value Help dialog launch
		 * @public
		 * @param {object} oEvent - Event Object
		 */
		f4ValueRequest: function (oEvent) {
			var oBasicSearch, sF4TableBindingPath;
			let oCustomData = oEvent.getSource().data();
			this.f4Name = oCustomData.f4name;
			sF4TableBindingPath = this.getTableBindingPath();
			let oDialogConfig = TimeMoveDialogConfig[this.getF4ConfigObjectName()];
			this.oMultiInput = oEvent.getSource();
			this.oValueHelpDialog = ValueHelpDialogUtil._createFragment(oDialogConfig.fragmentId, oDialogConfig.fragmentPath, this);
			var oTreeTable = ValueHelpDialogUtil._createFragment(oDialogConfig.tableId, oDialogConfig.tablePath, this);
			if(oDialogConfig.isTreeFilter){
				oTreeTable.bindRows({
					path: sF4TableBindingPath.tablePath,
					parameters: sF4TableBindingPath.parameters
				});
			} else {
				oTreeTable.bindRows({
					path: sF4TableBindingPath.tablePath
				});
			}
			
			switch(this.f4Name){
				case "toSellerF4":
				case "fromSellerF4":
				case "materialF4":
				case "productGrpDetailF4":
					oBasicSearch = new SearchField({
					search: this.onItemTreeSearch.bind(this, oDialogConfig.entityKey, oDialogConfig.entityDescriptionKey)
				});
					break;
				case "toSiteF4":
				case "fromSiteF4":
				case "moveUserF4":
				case "sectionF4":
				case "productF4":
					oBasicSearch = new SearchField({
					search: this.onItemTreeSearch.bind(this, oDialogConfig.entityKey)
				});
					break;
				default:
					break;
			}
			ValueHelpDialogUtil.openValueHelpDialog(this.getView(), this.oValueHelpDialog, this.oMultiInput, oTreeTable, oBasicSearch);
		},
		
		/**
		 * Method for Search the Tree data from Table
		 * @public
		 * @param {object} oEvent - Event Object
		 */
		onItemTreeSearch: function (sFilerPath1, sFilerPath2) {
			ValueHelpDialogUtil.onBaseItemTreeSearch(this.oValueHelpDialog, sFilerPath1, sFilerPath2);
		},
		
		/**
		 * Mathod used for selection change of tree table check box
		 * @param {Constructor} [oEvent]  
		 */
		onChangeSellerSelectionCB: function (oEvent) {
		//	let viewModelName = this.viewModelName;
			let ATPOverviewDataModel = this.getOwnerComponent().getModel("ATPOverviewModel");
			let oContext = oEvent.getSource().getBindingContext("ATPOverviewModel");
			let oTable = sap.ui.core.Fragment.byId("idSellerTreeTable", "idSellerTable");
			let oDialog = sap.ui.core.Fragment.byId("idSellerValueHelpDialog", "idSellerValueHelpDialog");
			let oBinding = oTable.getBinding("rows");
			let currentRow = oEvent.getSource().getBindingContext("ATPOverviewModel").getObject();
			let sCheckBoxProperty="fromSellerLowLevelSelect", oDialogConfig = TimeMoveDialogConfig["sellerF4"], sTokenProperty= this.viewModelPath + oDialogConfig.modelTokenPropertyFromSeller, rowSelection = [currentRow];
			if(this.f4Name === "toSellerF4"){
				sCheckBoxProperty = "toSellerLowLevelSelect";
				sTokenProperty = this.viewModelPath + oDialogConfig.modelTokenPropertyToSeller;
			}
			let aSellerTokens = ATPOverviewDataModel.getProperty(sTokenProperty) || [];
			let bLowerLevel = ATPOverviewDataModel.getProperty(this.viewModelPath + "/" + sCheckBoxProperty);
			let sapTokens = [];

			if (bLowerLevel) {
				ValueHelpDialogUtil.fnUpdateChildSelection(oBinding, oContext, "/checked", oEvent.getParameter("selected"), rowSelection);
			}

			rowSelection.forEach(function(oRow){
				let sellerID = oRow.Seller;
				let id;
				for (id = 0; id < aSellerTokens.length; id++) {
					if (aSellerTokens[id].key === sellerID) {
						break;
					}
				}

				if (oRow.checked) {
					aSellerTokens.push({
						key: oRow.Seller,
						text: oRow.Seller
					});
				} else {
					aSellerTokens.splice(id, 1);
				}
			});
			sapTokens = aSellerTokens.map(function(item) { 
				return new sap.m.Token({
				key: item.key,
				text: item.text
			});});
			oDialog.setTokens([]);
			oDialog.setTokens(sapTokens);
			ATPOverviewDataModel.setProperty(sTokenProperty, aSellerTokens);
			ATPOverviewDataModel.refresh();
		},
		
		/**
		 * Event Handler for Seller Token Update
		 * @public
		 * @param {object} oEvent - Event Object
		 */
		onSellerTokenUpdate: function (oEvent) {
			let sTokenProperty, sDataProperty, ATPOverviewModel = this.getOwnerComponent().getModel("ATPOverviewModel"), oDialogConfig = TimeMoveDialogConfig["sellerF4"];
			if(this.f4Name === "toSellerF4"){
				sTokenProperty = this.viewModelPath + oDialogConfig.modelTokenPropertyToSeller;
				sDataProperty = this.viewModelPath + oDialogConfig.modelDataPropertyToSeller;
			} else {
				sTokenProperty = this.viewModelPath + oDialogConfig.modelTokenPropertyFromSeller;
				sDataProperty = this.viewModelPath + oDialogConfig.modelDataPropertyFromSeller;
			}
			ValueHelpDialogUtil.updateTokens(ATPOverviewModel, sTokenProperty, oEvent, sDataProperty, oDialogConfig.entityKey);
			//ValueHelpDialogUtil._setTreeSelection(ATPOverviewModel, sToken, oEvent.getParameters().type, "/sellerF4FlatData", oDialogConfig.modelDataProperty, oDialogConfig.entityKey);
		},
		
		/*
		 * Event handler on To Seller Suggestion Item Selection
		 * @public
		 * @param {sap.ui.base.Event} [oEvent] the Event instance
		 */
		onSelectSellerSuggestion: function (oEvent) {
			var sTokenProperty,sSellerF4Property, sPath = oEvent.getParameter("selectedRow").getBindingContext("ATPOverviewModel").getPath(), oDialogConfig = TimeMoveDialogConfig["sellerF4"];
			var ATPOverviewModel = this.getOwnerComponent().getModel("ATPOverviewModel");
			var selRowData = ATPOverviewModel.getProperty(sPath);
			if(this.f4Name === "toSellerF4"){
				sTokenProperty = this.viewModelPath + oDialogConfig.modelTokenPropertyToSeller;
				sSellerF4Property = this.viewModelPath + oDialogConfig.modelDataPropertyToSeller;
			} else {
				sTokenProperty = this.viewModelPath + oDialogConfig.modelTokenPropertyFromSeller;
				sSellerF4Property = this.viewModelPath + oDialogConfig.modelDataPropertyFromSeller;
			}
			var aSellerToken = ATPOverviewModel.getProperty(sTokenProperty) || [];
			var aF4Data = ATPOverviewModel.getProperty(sSellerF4Property);

			var aTempObj = {
				"key": selRowData.Seller,
				"text": selRowData.SellerName + " (" + selRowData.Seller + ")"
			};
			aSellerToken.push(aTempObj);
			//	var index = sPath.split("/")[2];
			//	MoveAllocationDataModel.setProperty("/sellerF4Data/" + index + "/checked", true);
			let selRowInTree = ValueHelpDialogUtil.searchTokenInTreeData(aF4Data, selRowData.Seller, oDialogConfig.entityKey);
			if (selRowInTree.Seller) {
				selRowInTree.checked = true;
			}
			ATPOverviewModel.setProperty(sTokenProperty, aSellerToken);
			//ATPOverviewModel.setProperty("/sellerSuggestSelected", true);
			ATPOverviewModel.refresh();
			//this.displayValueState("idSeller", "None");
		},
		/**
		 * Event Handler for Seller Token Update
		 * @public
		 * @param {object} oEvent - Event Object
		 */
		onSiteTokenUpdate: function (oEvent) {
			let sDataProperty, sTokenProperty, ATPOverviewModel = this.getOwnerComponent().getModel("ATPOverviewModel"), oDialogConfig = TimeMoveDialogConfig["siteF4"];
			if(this.f4Name === "toSiteF4"){
				sTokenProperty = this.viewModelPath + oDialogConfig.modelTokenPropertyToSite;
				sDataProperty = this.viewModelPath + oDialogConfig.modelDataPropertyToSite;
			} else {
				sTokenProperty = this.viewModelPath + oDialogConfig.modelTokenPropertyFromSite;
				sDataProperty = this.viewModelPath + oDialogConfig.modelDataPropertyFromSite;
			}
			ValueHelpDialogUtil.updateTokens(ATPOverviewModel, sTokenProperty, oEvent, sDataProperty, oDialogConfig.entityKey);
			//ValueHelpDialogUtil._setTreeSelection(ATPOverviewModel, sToken, oEvent.getParameters().type, "/sellerF4FlatData", oDialogConfig.modelDataProperty, oDialogConfig.entityKey);
		},
		
		/*
		 * Event handler on To Seller Suggestion Item Selection
		 * @public
		 * @param {sap.ui.base.Event} [oEvent] the Event instance
		 */
		onSelectSiteSuggestion: function (oEvent) {
			var sTokenProperty, sPath = oEvent.getParameter("selectedRow").getBindingContext("ATPOverviewModel").getPath(), oDialogConfig = TimeMoveDialogConfig["siteF4"];
			var ATPOverviewModel = this.getOwnerComponent().getModel("ATPOverviewModel");
			var selRowData = ATPOverviewModel.getProperty(sPath);
			if(this.f4Name === "toSiteF4"){
				sTokenProperty = this.viewModelPath + oDialogConfig.modelTokenPropertyToSite;
			} else {
				sTokenProperty = this.viewModelPath + oDialogConfig.modelTokenPropertyFromSite;
			}
			var aSiteToken = ATPOverviewModel.getProperty(sTokenProperty) || [];
			//var aF4Data = ATPOverviewModel.getProperty("/toSiteF4Data");

			var aTempObj = {
				"key": selRowData.Site,
				"text": selRowData.Site
			};
			aSiteToken.push(aTempObj);
			//	var index = sPath.split("/")[2];
			//	MoveAllocationDataModel.setProperty("/sellerF4Data/" + index + "/checked", true);
			
			//commented due to flat data
			// let selRowInTree = ValueHelpDialogUtil.searchTokenInTreeData(aF4Data, selRowData.Site);
			// if (selRowInTree.Seller) {
			// 	selRowInTree.checked = true;
			// }
			ATPOverviewModel.setProperty(sTokenProperty, aSiteToken);
			//ATPOverviewModel.setProperty("/sellerSuggestSelected", true);
			ATPOverviewModel.refresh();
			//this.displayValueState("idSeller", "None");
		},
		/**
		 * Event Handler for Section Token Update
		 * @public
		 * @param {object} oEvent - Event Object
		 */    
		onSectionTokenUpdate: function (oEvent) {
			let sTokenProperty, sDataProperty, ATPOverviewModel = this.getOwnerComponent().getModel("ATPOverviewModel"), oDialogConfig = TimeMoveDialogConfig["sectionF4"];
			sTokenProperty = this.viewModelPath + oDialogConfig.modelTokenProperty;
			sDataProperty = this.viewModelPath + oDialogConfig.modelDataProperty;
			ValueHelpDialogUtil.updateTokens(ATPOverviewModel, sTokenProperty, sDataProperty, oDialogConfig.entityKey);
			//ValueHelpDialogUtil._setTreeSelection(ATPOverviewModel, sToken, oEvent.getParameters().type, "/sellerF4FlatData", oDialogConfig.modelDataProperty, oDialogConfig.entityKey);
		},
		
		/*
		 * Event handler on Section Suggestion Item Selection
		 * @public
		 * @param {sap.ui.base.Event} [oEvent] the Event instance
		 */
		onSelectSectionSuggestion: function (oEvent) {
			var sPath = oEvent.getParameter("selectedRow").getBindingContext("ATPOverviewModel").getPath();
			var ATPOverviewModel = this.getOwnerComponent().getModel("ATPOverviewModel");
			var selRowData = ATPOverviewModel.getProperty(sPath);
			var aSectionToken = ATPOverviewModel.getProperty("/sectionTokens")|| [];
			//var aF4Data = ATPOverviewModel.getProperty("/toSiteF4Data");

			var aTempObj = {
				"key": selRowData.Section,
				"text": selRowData.Section
			};
			aSectionToken.push(aTempObj);
			//commented due to flat data
			// let selRowInTree = ValueHelpDialogUtil.searchTokenInTreeData(aF4Data, selRowData.Site);
			// if (selRowInTree.Seller) {
			// 	selRowInTree.checked = true;
			// }
			ATPOverviewModel.setProperty("/sectionTokens", aSectionToken);
			//ATPOverviewModel.setProperty("/sellerSuggestSelected", true);
			ATPOverviewModel.refresh();
			//this.displayValueState("idSeller", "None");
		},
		
		/**
		 * Event Handler for Product Group Token Update
		 * @public
		 * @param {object} oEvent - Event Object
		 */
		onProductGrpTokenUpdate: function (oEvent) {
			let sTokenProperty, sDataProperty, ATPOverviewModel = this.getOwnerComponent().getModel("ATPOverviewModel"), oDialogConfig = TimeMoveDialogConfig["productGrpDetailF4"];
			sTokenProperty = this.viewModelPath + oDialogConfig.modelTokenProperty;
			sDataProperty = this.viewModelPath + oDialogConfig.modelDataProperty;
			ValueHelpDialogUtil.updateTokens(ATPOverviewModel, sTokenProperty, oEvent, sDataProperty, oDialogConfig.entityKey);
			//ValueHelpDialogUtil._setTreeSelection(ATPOverviewModel, sToken, oEvent.getParameters().type, "/sellerF4FlatData", oDialogConfig.modelDataProperty, oDialogConfig.entityKey);
		},
		
		/*
		 * Event handler on ProductGroup Suggestion Item Selection
		 * @public
		 * @param {sap.ui.base.Event} [oEvent] the Event instance
		 */
		onSelectProductGrpSuggestion: function (oEvent) {
			var sPath = oEvent.getParameter("selectedRow").getBindingContext("ATPOverviewModel").getPath();
			var ATPOverviewModel = this.getOwnerComponent().getModel("ATPOverviewModel");
			var selRowData = ATPOverviewModel.getProperty(sPath);
			var aProductGrpToken = ATPOverviewModel.getProperty("/productGrpDetailTokens") || [];
			//var aF4Data = ATPOverviewModel.getProperty("/toSiteF4Data");

			var aTempObj = {
				"key": selRowData.ProductGrp,
				"text": selRowData.ProductGrp
			};
			aProductGrpToken.push(aTempObj);
			//commented due to flat data
			// let selRowInTree = ValueHelpDialogUtil.searchTokenInTreeData(aF4Data, selRowData.Site);
			// if (selRowInTree.Seller) {
			// 	selRowInTree.checked = true;
			// }
			ATPOverviewModel.setProperty("/productGrpDetailTokens", aProductGrpToken);
			//ATPOverviewModel.setProperty("/sellerSuggestSelected", true);
			ATPOverviewModel.refresh();
			//this.displayValueState("idSeller", "None");
		},
		/**
		 * Event Handler for Product Token Update
		 * @public
		 * @param {object} oEvent - Event Object
		 */
		onProductTokenUpdate: function (oEvent) {
			let sTokenProperty, sDataProperty, ATPOverviewModel = this.getOwnerComponent().getModel("ATPOverviewModel"), oDialogConfig = TimeMoveDialogConfig["productF4"];
			sTokenProperty = this.viewModelPath + oDialogConfig.modelTokenProperty;
			sDataProperty = this.viewModelPath + oDialogConfig.modelDataProperty;
			ValueHelpDialogUtil.updateTokens(ATPOverviewModel, sTokenProperty, oEvent, sDataProperty, oDialogConfig.entityKey);
			//ValueHelpDialogUtil._setTreeSelection(ATPOverviewModel, sToken, oEvent.getParameters().type, "/sellerF4FlatData", oDialogConfig.modelDataProperty, oDialogConfig.entityKey);
		},
		
		/*
		 * Event handler on Product Suggestion Item Selection
		 * @public
		 * @param {sap.ui.base.Event} [oEvent] the Event instance
		 */
		onSelectProductSuggestion: function (oEvent) {
			var sPath = oEvent.getParameter("selectedRow").getBindingContext("ATPOverviewModel").getPath();
			var ATPOverviewModel = this.getOwnerComponent().getModel("ATPOverviewModel");
			var selRowData = ATPOverviewModel.getProperty(sPath);
			var aProductToken = ATPOverviewModel.getProperty("/productTokens") || [];
			//var aF4Data = ATPOverviewModel.getProperty("/toSiteF4Data");

			var aTempObj = {
				"key": selRowData.Product,
				"text": selRowData.Product
			};
			aProductToken.push(aTempObj);
			//commented due to flat data
			// let selRowInTree = ValueHelpDialogUtil.searchTokenInTreeData(aF4Data, selRowData.Site);
			// if (selRowInTree.Seller) {
			// 	selRowInTree.checked = true;
			// }
			ATPOverviewModel.setProperty("/productTokens", aProductToken);
			//ATPOverviewModel.setProperty("/sellerSuggestSelected", true);
			ATPOverviewModel.refresh();
			//this.displayValueState("idSeller", "None");
		},
		
		/**
		 * Event Handler for Product Token Update
		 * @public
		 * @param {object} oEvent - Event Object
		 */
		onMaterialTokenUpdate: function (oEvent) {
			let sTokenProperty, sDataProperty, ATPOverviewModel = this.getOwnerComponent().getModel("ATPOverviewModel"), oDialogConfig = TimeMoveDialogConfig["materialF4"];
			sTokenProperty = this.viewModelPath + oDialogConfig.modelTokenProperty;
			sDataProperty = this.viewModelPath + oDialogConfig.modelDataProperty;
			ValueHelpDialogUtil.updateTokens(ATPOverviewModel, sTokenProperty, oEvent, sDataProperty, oDialogConfig.entityKey);
			//ValueHelpDialogUtil._setTreeSelection(ATPOverviewModel, sToken, oEvent.getParameters().type, "/sellerF4FlatData", oDialogConfig.modelDataProperty, oDialogConfig.entityKey);
		},
		
		/*
		 * Event handler on Product Suggestion Item Selection
		 * @public
		 * @param {sap.ui.base.Event} [oEvent] the Event instance
		 */
		onSelectMaterialSuggestion: function (oEvent) {
			var sPath = oEvent.getParameter("selectedRow").getBindingContext("ATPOverviewModel").getPath();
			var ATPOverviewModel = this.getOwnerComponent().getModel("ATPOverviewModel");
			var selRowData = ATPOverviewModel.getProperty(sPath);
			var aMaterialToken = ATPOverviewModel.getProperty("/materialTokens") || [];
			//var aF4Data = ATPOverviewModel.getProperty("/toSiteF4Data");

			var aTempObj = {
				"key": selRowData.Item,
				"text": selRowData.Item
			};
			aMaterialToken.push(aTempObj);
			//commented due to flat data
			// let selRowInTree = ValueHelpDialogUtil.searchTokenInTreeData(aF4Data, selRowData.Site);
			// if (selRowInTree.Seller) {
			// 	selRowInTree.checked = true;
			// }
			ATPOverviewModel.setProperty("/materialTokens", aMaterialToken);
			//ATPOverviewModel.setProperty("/sellerSuggestSelected", true);
			ATPOverviewModel.refresh();
			//this.displayValueState("idSeller", "None");
		},
		/**
		 * Event Handler for Seller Token Update
		 * @public
		 * @param {object} oEvent - Event Object
		 */
		onMoveUserTokenUpdate: function (oEvent) {
			let sTokenProperty, sDataProperty,  ATPOverviewModel = this.getOwnerComponent().getModel("ATPOverviewModel"), oDialogConfig = TimeMoveDialogConfig["moveUserF4"];
			sTokenProperty = this.viewModelPath + oDialogConfig.modelTokenProperty;
			sDataProperty = this.viewModelPath + oDialogConfig.modelDataProperty;
			ValueHelpDialogUtil.updateTokens(ATPOverviewModel, sTokenProperty, oEvent, sDataProperty, oDialogConfig.entityKey);
			//ValueHelpDialogUtil._setTreeSelection(ATPOverviewModel, sToken, oEvent.getParameters().type, "/sellerF4FlatData", oDialogConfig.modelDataProperty, oDialogConfig.entityKey);
		},
		
		/*
		 * Event handler on To Seller Suggestion Item Selection
		 * @public
		 * @param {sap.ui.base.Event} [oEvent] the Event instance
		 */
		onSelectMoveUserSuggestion: function (oEvent) {
			var sPath = oEvent.getParameter("selectedRow").getBindingContext("ATPOverviewModel").getPath();
			var ATPOverviewModel = this.getOwnerComponent().getModel("ATPOverviewModel");
			var selRowData = ATPOverviewModel.getProperty(sPath);
			var aSellerToken = ATPOverviewModel.getProperty("/moveUserTokens") || [];
			//var aF4Data = ATPOverviewModel.getProperty("/moveUserF4Data");

			var aTempObj = {
				"key": selRowData.bname,
				"text": selRowData.bname
			};
			aSellerToken.push(aTempObj);
			//	var index = sPath.split("/")[2];
			//	MoveAllocationDataModel.setProperty("/sellerF4Data/" + index + "/checked", true);
			
			//commented due to flat data
			// let selRowInTree = ValueHelpDialogUtil.searchTokenInTreeData(aF4Data, selRowData.bname);
			// if (selRowInTree.Seller) {
			// 	selRowInTree.checked = true;
			// }
			ATPOverviewModel.setProperty("/toSellerTokens", aSellerToken);
			//ATPOverviewModel.setProperty("/sellerSuggestSelected", true);
			ATPOverviewModel.refresh();
			//this.displayValueState("idSeller", "None");
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
		 * Method For close Value Help Dialog on Cancel button press.
		 * @public
		 * @param {Constructor} [oEvent] Cancel Button Press Event in F4
		 */
		onSellerValueHelpCancelPress: function (oEvent) {
			var oDialogConfig = TimeMoveDialogConfig["sellerF4"], sTokenProperty= this.viewModelPath + oDialogConfig.modelTokenPropertyFromSeller, 
				sDataProperty= this.viewModelPath + oDialogConfig.modelDataPropertyFromSeller, sBackupTokenProperty = this.viewModelPath + oDialogConfig.modelBackUpTokenPropertyFromSeller, sBackupDataProperty= this.viewModelPath + oDialogConfig.modelBackUpDataPropertyFromSeller, oATPOverviewModel = this.getOwnerComponent().getModel("ATPOverviewModel"), oSource = oEvent.getSource();
			if(this.f4Name === "toSellerF4"){
				sTokenProperty= this.viewModelPath + oDialogConfig.modelTokenPropertyToSeller;
				sDataProperty= this.viewModelPath + oDialogConfig.modelDataPropertyToSeller;
				sBackupTokenProperty= this.viewModelPath + oDialogConfig.modelBackUpTokenPropertyToSeller;
				sBackupDataProperty= this.viewModelPath + oDialogConfig.modelBackUpDataPropertyToSeller;
			}
			oATPOverviewModel.setProperty(sTokenProperty, oATPOverviewModel.getProperty(sBackupTokenProperty));
			oATPOverviewModel.setProperty(sDataProperty, oATPOverviewModel.getProperty(sBackupDataProperty));
			oSource.close();
		},
		
		
		/**
		 * Event Handler to Handle Seller Value Help Update Selection Change
		 * @public
		 * @param {object} oEvent - Event Object
		 */
		onSellerValueHelpUpdateSelection: function (oEvent) {
			let oATPOverviewModel = this.getOwnerComponent().getModel("ATPOverviewModel"),
				oCustomData = oEvent.getSource().data(),
				oDialogConfig = TimeMoveDialogConfig[oCustomData.f4name],
				sTokenProperty= this.viewModelPath + oDialogConfig.modelTokenPropertyFromSeller, sDataProperty= this.viewModelPath + oDialogConfig.modelDataPropertyFromSeller, sBackupTokenProperty= this.viewModelPath + oDialogConfig.modelBackUpTokenPropertyFromSeller, sBackupDataProperty= this.viewModelPath + oDialogConfig.modelBackUpDataPropertyFromSeller;
			if(this.f4Name === "toSellerF4"){
				sTokenProperty= this.viewModelPath + oDialogConfig.modelTokenPropertyToSeller;
				sDataProperty= this.viewModelPath + oDialogConfig.modelDataPropertyToSeller;
				sBackupTokenProperty= this.viewModelPath + oDialogConfig.modelBackUpTokenPropertyToSeller;
				sBackupDataProperty= this.viewModelPath + oDialogConfig.modelBackUpDataPropertyToSeller;
			}
			ValueHelpDialogUtil.onBaseValueHelpUpdateSelection(oEvent, oDialogConfig.entityKey, this.viewModelPath + oDialogConfig.modelDataProperty, oDialogConfig.isTreeFilter);
			oATPOverviewModel.setProperty(sBackupTokenProperty, jQuery.extend(true, [], oATPOverviewModel.getProperty(sTokenProperty)));
			oATPOverviewModel.setProperty(sBackupDataProperty, jQuery.extend(true, [], oATPOverviewModel.getProperty(sDataProperty)));
		},
		
		/**
		 * Event Handler to invoke the Base Controller's Remove Token method
		 * @public
		 * @param {object} oEvent - Event Object
		 */
		onTokenRemove: function (oEvent) {
			let aTokens = this.getOwnerComponent().getModel("ATPOverviewModel").getProperty("/moveAllocationHistory/toSellerTokens"),
				tokenKeys = oEvent.getParameter("tokenKeys"),
				oJsonModel = this.getOwnerComponent().getModel("ATPOverviewModel"),
				oCustomData = oEvent.getSource().data(),oSellerF4Data,
				oDialogConfig = TimeMoveDialogConfig[oCustomData.f4name],
				sDataProperty = this.viewModelPath + oDialogConfig.modelDataPropertyFromSeller;
				if(this.f4Name === "toSellerF4"){
					sDataProperty = this.viewModelPath + oDialogConfig.modelDataPropertyToSeller;
				}
				oSellerF4Data = oJsonModel.getProperty(sDataProperty);
			tokenKeys.forEach(function(tokenKey) {
				let removedRow = ValueHelpDialogUtil.searchTokenInTreeData(oSellerF4Data, tokenKey, oDialogConfig.entityKey),
					id;
				if (removedRow) {
					removedRow.checked = false;
				}
				for (id = 0; id < aTokens.length; id++) {
					if (aTokens[id].key === tokenKey) {
						aTokens.splice(id, 1);
					}
				}
				//ValueHelpDialogUtil._setTreeSelection(tokenKey, oEvent.getParameters().type, "/moveAllocationHistory/sellerF4FlatData", "toSellerF4Data", "Seller");

			});
			oJsonModel.refresh();
		},
		/**
		 * Method For close Seller Group Value Help Dialog.
		 * @public
		 */
		onValueHelpDialogClose: function (oEvent) {
			var sTokenProperty, oCustomData,oDialogConfig, aTokens, oSource = oEvent.getSource();
			oCustomData = oSource.data();
			aTokens = oEvent.getParameter("tokens");
			oDialogConfig = TimeMoveDialogConfig[oCustomData.f4name];
			let ATPOverviewModel = this.getOwnerComponent().getModel("ATPOverviewModel");
			ATPOverviewModel.setProperty("/moveAllocationHistory/busy", false);
			if(oCustomData.f4name === "siteF4"){
				sTokenProperty = this.viewModelPath + oDialogConfig.modelTokenPropertyToSite;
				ValueHelpDialogUtil.setTokensFromValueHelp(ATPOverviewModel,aTokens,sTokenProperty);
				//ATPOverviewModel.setProperty(oDialogConfig.modelTokenPropertyToSite, aTokens);
			}else if(oCustomData.f4name !== "sellerF4") {
				sTokenProperty = this.viewModelPath + oDialogConfig.modelTokenProperty;
				ValueHelpDialogUtil.setTokensFromValueHelp(ATPOverviewModel,aTokens,sTokenProperty);
				//ATPOverviewModel.setProperty(oDialogConfig.modelTokenProperty, aTokens);
			}
			this.oValueHelpDialog.close();
		},
		/**
		 * Event Handler for Seller valuehelp dialog Selection change
		 * @public
		 * @param {object} oEvent - Event Object
		 * @returns {boolean} flag
		 */
		onSellerSelectionChange: function (oEvent) {
			oEvent.preventDefault();
			return false;
		},
		/*
		 * Event handler of Clear all Selected Seller In F4
		 * @public
		 * @param {sap.ui.base.Event} [oEvent] the Event instance
		 */
		onClearAllSelection: function () {
			var sTokenProperty, sDataProperty, ATPOverviewModel = this.getOwnerComponent().getModel("ATPOverviewModel"), oDialogConfig = TimeMoveDialogConfig["sellerF4"];
			sTokenProperty = this.viewModelPath + oDialogConfig.modelTokenPropertyFromSeller;
			sDataProperty = this.viewModelPath + oDialogConfig.modelDataPropertyFromSeller;
			if(this.f4Name === "toSellerF4"){
				sTokenProperty = this.viewModelPath + oDialogConfig.modelTokenPropertyToSeller;
				sDataProperty = this.viewModelPath + oDialogConfig.modelDataPropertyToSeller;
			}
			ATPOverviewModel.setProperty(sTokenProperty, []);
			var oTable = this.oValueHelpDialog.getTable();
			oTable.expandToLevel(4);
			var aData = oTable.getBinding("rows").getModel().getProperty(sDataProperty);
			this.setSellerCheckProperty(aData);
			this.oValueHelpDialog.setTokens([]);
			ATPOverviewModel.refresh();
		},
		/*
		 * Method to Clear all Selected Sellers and Children data In F4
		 * @public
		 * @param {Array} [aData] array of records
		 */
		setSellerCheckProperty: function (aData) {
			jQuery.each(aData, function (index, oRow) {
				oRow.checked = false;
				if (oRow.hasOwnProperty("children")) {
					this.setSellerCheckProperty(oRow.children);
				}
			}.bind(this));
		},
		/**
		 * Event Handler for the checkbox update
		 * @public
		 * @param {object} oEvent - Event Object
		 */
		onLowlevelSelected: function (oEvent) {
			let sCheckBoxProperty="fromSellerLowLevelSelect", aATPOverviewModel = this.getOwnerComponent().getModel("ATPOverviewModel");
			
			if(this.f4Name === "toSellerF4"){
				sCheckBoxProperty = "toSellerLowLevelSelect";
			}
			aATPOverviewModel.setProperty("/moveAllocationHistory/"+ sCheckBoxProperty, oEvent.getSource().getSelected());
		},
		/**
		 * Method For close Value Help Dialog on Cancel button press.
		 * @public
		 * @param {Constructor} [oEvent] Cancel Button Press Event in F4
		 */
		onValueHelpCancelPress: function (oEvent) {
			var oSource = oEvent.getSource();
			oSource.close();
		},
		onGeneralTokenRemove: function (oEvent) {
			var sDataProperty, oCustomData = oEvent.getSource().data(), oDialogConfig = TimeMoveDialogConfig[oCustomData.f4name];
			sDataProperty = this.viewModelPath + oDialogConfig.modelDataProperty;
			ValueHelpDialogUtil.onTokenRemove(oEvent, oDialogConfig.entityKey, sDataProperty);
		},

		onGeneralValueHelpUpdateSelection: function (oEvent) {
			var sDataProperty, oCustomData = oEvent.getSource().data(), oDialogConfig = TimeMoveDialogConfig[oCustomData.f4name];
			sDataProperty = this.viewModelPath + oDialogConfig.modelDataProperty;
			ValueHelpDialogUtil.onValueHelpUpdateSelection(oEvent, oDialogConfig.entityKey, sDataProperty);
		},

		onGeneralValueHelpSelectionChange: function (oEvent) {
			var oCustomData = oEvent.getSource().data(), oDialogConfig = TimeMoveDialogConfig[oCustomData.f4name];
			ValueHelpDialogUtil.onValueHelpSelectionChange(oEvent, oDialogConfig.entityKey);
		},
		onDetailPageGoPress: function(){
			this.getView().getModel().resetChanges();
			this.byId("idHistoryMoveList").rebindTable();
		},
		onMoveDateChange: function(oEvent){
			var oSoure=oEvent.getSource(), aATPOverviewModel = this.getOwnerComponent().getModel("ATPOverviewModel");
			aATPOverviewModel.setProperty("/moveAllocationHistory/moveDate",DateUtils.getAdjustedDate(oSoure.getDateValue()));                         
		},
		onMoveTimeChange: function(oEvent){
			var oSource=oEvent.getSource(), sValue = oEvent.getParameter("value"), aATPOverviewModel = this.getOwnerComponent().getModel("ATPOverviewModel");
			sValue = oSource.getDateValue();
			if(sValue){
			var format1 = sap.ui.core.format.DateFormat.getDateInstance({
			pattern :  "PTHH'H'mm'M'ss'S'"
			});
			aATPOverviewModel.setProperty("/moveAllocationHistory/moveTime",format1.format(sValue));
			} else {
				aATPOverviewModel.setProperty("/moveAllocationHistory/moveTime",sValue);
			}
			
		},
		getTableBindingPath: function(){
			var oObject = {};
			switch(this.f4Name){
				case "toSiteF4":
					oObject.tablePath = "ATPOverviewModel>/moveAllocationHistory/toSiteF4Data";
					break;
				case "toSellerF4":
					oObject.tablePath = "ATPOverviewModel>/moveAllocationHistory/toSellerF4Data";
					oObject.parameters={
							arrayNames: ['children']
						};
					break;
				case "fromSellerF4":
					oObject.tablePath = "ATPOverviewModel>/moveAllocationHistory/fromSellerF4Data";
					oObject.parameters={
							arrayNames: ['children']
						};
					break;
				case "moveUserF4":
					oObject.tablePath = "ATPOverviewModel>/moveAllocationHistory/moveUserF4Data";
					break;
				case "sectionF4":
					oObject.tablePath = "ATPOverviewModel>/moveAllocationHistory/sectionF4Data";
					break;
				case "productGrpDetailF4":
					oObject.tablePath = "ATPOverviewModel>/moveAllocationHistory/productGrpDetailF4Data";
					break;
				case "productF4":
					oObject.tablePath = "ATPOverviewModel>/moveAllocationHistory/productF4Data";
					break;
				case "materialF4":
					oObject.tablePath = "ATPOverviewModel>/moveAllocationHistory/materialF4Data";
					break;
				case "fromSiteF4":
					oObject.tablePath = "ATPOverviewModel>/moveAllocationHistory/fromSiteF4Data";
					break;
				default:
					break;
					
			}
			return oObject;
		},
		getF4ConfigObjectName: function(){
			var sConfigName;
			if(this.f4Name.indexOf("Site") !== -1){
				sConfigName = "siteF4";
			} else if(this.f4Name.indexOf("Seller") !== -1){
				sConfigName = "sellerF4";
			} else if(this.f4Name.indexOf("moveUser") !== -1){
				sConfigName = "moveUserF4";
			} else if(this.f4Name.indexOf("section") !== -1){
				sConfigName = "sectionF4";
			} else if(this.f4Name.indexOf("productGrpDetail") !== -1){
				sConfigName = "productGrpDetailF4";
			} else if(this.f4Name.indexOf("product") !== -1){
				sConfigName = "productF4";
			} else if(this.f4Name.indexOf("material") !== -1){
				sConfigName = "materialF4";
			}
			return sConfigName;
			
		},
		/*
		 * Event handler used for open calendarweek
		 * @param {object} oEvent - Event Object
		 */
		onCalendarPress: function (oEvent) {
			var fragDialogId = this.createId("openweekCalendar"),oGrid, aPastData, aFutureData,
				fragItemId = this.createId("openweekCalendarItem"),
				sDataProperty,
				oCustomData = oEvent.getSource().data(),
				ATPOverviewModel = this.getOwnerComponent().getModel("ATPOverviewModel"),oTemplate,
				oDialogConfig = TimeMoveDialogConfig[oCustomData.f4name];
			this.f4Name = oCustomData.f4name;
			sDataProperty = this.viewModelPath + oDialogConfig.modelDataProperty;
			this._openWeekCalendar = ValueHelpDialogUtil._createFragment(fragDialogId, "com.samsung.aATPOverview.view.fragments.CalendarWeek", this);
			oGrid = this._openWeekCalendar.getContent()[2];
			oTemplate = ValueHelpDialogUtil._createFragment(fragItemId, "com.samsung.aATPOverview.view.fragments.CalendarWeekList", this);
			oGrid.bindAggregation("content", "ATPOverviewModel>" + sDataProperty, oTemplate);
			this.oView.addDependent(this._openWeekCalendar);
			this._openWeekCalendar.openBy(oEvent.getSource());
			var sYear, oStartDate, sWeek, iCurrentWeek = ATPOverviewModel.getProperty("/moveAllocationHistory/defaultData").CurrentWeek;
			sYear = iCurrentWeek.toString().slice(0, 4);
			sWeek = iCurrentWeek.toString().slice(4, 6);
			oStartDate = DateUtils.getDateOfISOWeek(parseInt(sWeek), parseInt(sYear));
			aPastData = this._setWeeksPastData(oStartDate.startDate);
			aFutureData = this._setWeeksFutureData(oStartDate.startDate);
			aFutureData.forEach(function(oItem){
				aPastData.unshift(oItem);
			});
			ATPOverviewModel.setProperty(sDataProperty, aPastData);
		},
		/**
		 * Method where the calendar weeks model got updated.
		 * @param {object} oDate - Date Object
		 */
		_setWeeksPastData: function (oDate) {
			var oStartDate = DateUtils.getAdjustedDate(oDate),
				oEndDate = DateUtils.getAdjustedDate(new Date(oStartDate));
			var iYear, aWeeks = [],
				oEmptyObject, iWeek, weekdate;

			for (var i = 1; i <= 6; i++) {
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
			return aWeeks;
		},
		
		_setWeeksFutureData: function (oDate) {
			var oStartDate = DateUtils.getAdjustedDate(oDate),
				oEndDate = DateUtils.getAdjustedDate(new Date(oStartDate));
				//oResourceModel = this.getResourceBundle(),
			var iYear, aWeeks = [],
				oEmptyObject, iWeek, weekdate;

			for (var i = 1; i <= 6; i++) {
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
				oStartDate.setDate(oStartDate.getDate() + 7);
				if(i !== 1){
				aWeeks.push(oEmptyObject);
				}
			}
			return aWeeks;
		},
		
		/*
		 *Method used to set calendar startweek and endweek data
		 * @{Param} oDate object Edm.date type 
		 */
		getIsoWeekdate: function (oStartDate) {
			var oStartingdate;
			//var oResourceModel = this.getOwnerComponent().getModel("i18n").getResourceBundle();
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
			var sSelWeek,oDialogConfig,
				iWeek = oEvent.getSource().data("week"),
				//oResourceModel = this.getResourceBundle(),
				iYear = oEvent.getSource().data("year");
			oDialogConfig = TimeMoveDialogConfig[this.f4Name];
			var ATPOverviewModel = this.getOwnerComponent().getModel("ATPOverviewModel");
			//ATPOverviewModel.setProperty("/moveAllocationHistory/sSelectedWeek", this.oResourceBundle.getText("calendarWeek", [iWeek, iYear]));
			ATPOverviewModel.setProperty(this.viewModelPath + oDialogConfig.buttonTextProperty, this.oResourceBundle.getText("calendarWeek", [iWeek, iYear]));
			if (iWeek < 10) {
				sSelWeek = String(iYear) + "0" + String(iWeek);
			} else {
				sSelWeek = String(iYear) + String(iWeek);
			}
			ATPOverviewModel.setProperty(this.viewModelPath + oDialogConfig.filterProperty, sSelWeek);
			this._openWeekCalendar.close();
			ATPOverviewModel.refresh();
		}

	});

});