sap.ui.define([
	"./BaseController",
	"com/sap/atp/reuselib/SmartTableBindingUpdate",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
], function (Controller, SmartTableBinding, Filter, FilterOperator) {
	"use strict";

	return Controller.extend("com.samsung.aATPOverview.controller.AllocationVsConsumptionDetail", {
		viewModelPath: "/allocationVsConsumption",
		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf com.samsung.aATPOverview.view.AllocationVsConsumptionDetail
		 */
		onInit: function () {
			this.oRouter = this.getRouter();
			this.oRouter.getRoute("AllocationVsConsumptionDetail").attachPatternMatched(this.onRouteMatched, this);
			this.oRouter.attachRouteMatched(this.onRouteMatched, this);
			let ATPOverviewModel = this.getOwnerComponent().getModel("ATPOverviewModel");
			ATPOverviewModel.setProperty(this.viewModelPath, {});
		},

		onRouteMatched: function (oEvent) {
			var sRouteName = oEvent.getParameter("name");
			if (sRouteName === "AllocationVsConsumptionDetail") {
				setTimeout(function () {
					this.byId("idAllocationConsumptionList").rebindTable();
					this.initializeFilters();
				}.bind(this), 0);
			}
		},

		addFiltersFromList: function (aList, filterProperty, oUpdate) {
			if (aList && aList.length > 0) {
				aList.forEach(function (token) {
					if (token.key) {
						oUpdate.addFilter(filterProperty, FilterOperator.EQ, token.key);
					}
				});
			}
		},

		onDetailPageGoPress: function () {
			this.byId("idAllocationConsumptionList").rebindTable();
		},
		onBeforeRebindTable: function (oEvent) {
			let oUpdate = new SmartTableBinding(oEvent.getParameter("bindingParams")),
				oModel = this.getOwnerComponent().getModel("ATPOverviewModel"),
				tooltip = "Filters: ";
			//var sCurrentWeek = oModel.getProperty("/defaultData").CurrentWeek ;
			var sSelectedLogWeek = oModel.getProperty(`${this.viewModelPath}/selectedLogWeek`);
			var allProducts = oModel.getProperty(`${this.viewModelPath}/productTokens`) || [];
			var selectedSites = oModel.getProperty(`${this.viewModelPath}/siteTokens`) || [];
			var selectedSellers = oModel.getProperty(`${this.viewModelPath}/sellerTokens`) || [];
			var selectedMaterials = oModel.getProperty(`${this.viewModelPath}/materialTokens`) || [];
			var selectedSections = oModel.getProperty(`${this.viewModelPath}/sectionTokens`) || [];
			var selectedProductGroups = oModel.getProperty(`${this.viewModelPath}/productGrpDetailTokens`) || [];

			var oTable = oEvent.getSource();
			if (!oTable.getTable()) {
				oUpdate.prevent();
			}

			if (sSelectedLogWeek) {
				oUpdate.addFilter("log_week", FilterOperator.EQ, sSelectedLogWeek);
				tooltip += ", Week: " + sSelectedLogWeek;
			}
			this.addFiltersFromList(allProducts, "product", oUpdate);
			oUpdate.endFilterOr();

			this.addFiltersFromList(selectedSites, "site", oUpdate);
			oUpdate.endFilterOr();

			this.addFiltersFromList(selectedSellers, "seller", oUpdate);
			oUpdate.endFilterOr();

			this.addFiltersFromList(selectedProductGroups, "product_grp", oUpdate);
			oUpdate.endFilterOr();

			this.addFiltersFromList(selectedSections, "zsection", oUpdate);
			oUpdate.endFilterOr();

			this.addFiltersFromList(selectedMaterials, "material", oUpdate);

			oUpdate.endFilterAnd();
			this.byId("idTableToolbar").setText(tooltip);
		},

		initializeFilters: function () {
			this.fetchTreeF4Data("/ZEIDPSD103_SET", this.viewModelPath + "/sellerF4Data", this.viewModelPath + "/sellerF4FlatData");
			this.fetchFlatF4Data("/ZEIDPSD102_SET", "/materialF4Data");
			this.fetchFlatF4Data("/ZEIDPSD109_SET", "/siteF4Data");
			this.fetchFlatF4Data("/ZEIDPSD110_SET", "/productGrpDetailF4Data");
			this.fetchFlatF4Data("/ZEIDPSD108_SET", "/sectionF4Data");
			this.fetchFlatF4Data("/ZEIDPSD111_SET", "/productF4Data");
		}

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf com.samsung.aATPOverview.view.AllocationVsConsumptionDetail
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf com.samsung.aATPOverview.view.AllocationVsConsumptionDetail
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf com.samsung.aATPOverview.view.AllocationVsConsumptionDetail
		 */
		//	onExit: function() {
		//
		//	}

	});

});