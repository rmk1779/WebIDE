sap.ui.define([], function () {
	"use strict";

	return {
		materialF4: {
			fragmentId: "idMaterialValueHelpDialog",
			fragmentPath: "com.samsung.aATPOverview.view.fragments.MaterialValueHelpDialog",
			tableId: "idMaterialTable",
			tablePath: "com.samsung.aATPOverview.view.fragments.MaterialTable",
			entityKey: "Item",
			entityDescriptionKey: "Maktx",
			modelDataProperty: "/materialF4Data",
			modelTokenProperty: "/materialTokens",
			isTreeFilter: false
		},
		siteF4: {
			fragmentId: "idSiteValueHelpDialog",
			fragmentPath: "com.samsung.aATPOverview.view.fragments.SiteValueHelpDialog",
			tableId: "idSiteTreeTable",
			tablePath: "com.samsung.aATPOverview.view.fragments.SiteTable",
			entityKey: "Site",
			entityDescriptionKey: "Site",
			modelDataProperty: "/siteF4Data",
			modelTokenProperty: "/siteTokens",
			modelDataPropertyToSite: "/toSiteF4Data",
			modelDataPropertyFromSite: "/fromSiteF4Data",
			modelTokenPropertyToSite: "/toSiteTokens",
			modelTokenPropertyFromSite: "/fromSiteTokens",
			isTreeFilter: false
		},
		productGroupF4: {
			fragmentId: "idProductGroupValueHelpDialog",
			fragmentPath: "com.samsung.aATPOverview.view.fragments.ProductGroupValueHelpDialog",
			tableId: "idProductGroupTreeTable",
			tablePath: "com.samsung.aATPOverview.view.fragments.ProductGroupTreeTable",
			entityKey: "Product",
			entityDescriptionKey: "Product",
			modelDataProperty: "productGroupF4Data",
			modelTokenProperty: "/productGroupTokens",
			isTreeFilter: true
		},
		plantF4: {
			fragmentId: "idPlantValueHelpDialog",
			fragmentPath: "com.samsung.aATPOverview.view.fragments.PlantValueHelpDialog",
			tableId: "idPlantTreeTable",
			tablePath: "com.samsung.aATPOverview.view.fragments.PlantTreeTable",
			entityKey: "werks",
			entityDescriptionKey: "werks",
			modelDataProperty: "/plantF4Data",
			modelTokenProperty: "/plantTokens",
			isTreeFilter: false
		},
		sellerF4: {
			fragmentId: "idSellerValueHelpDialog",
			fragmentPath: "com.samsung.aATPOverview.view.fragments.SellerValueHelpDialog",
			tableId: "idSellerTreeTable",
			tablePath: "com.samsung.aATPOverview.view.fragments.SellerTreeTable",
			entityKey: "Seller",
			entityDescriptionKey: "SellerName",
			modelDataProperty: "/sellerF4FlatData",
			modelDataPropertyToSeller: "/toSellerF4Data",
			modelDataPropertyFromSeller: "/fromSellerF4Data",
			modelTokenProperty: "/sellerTokens",
			modelTokenPropertyToSeller: "/toSellerTokens",
			modelTokenPropertyFromSeller: "/fromSellerTokens",
			modelBackUpTokenPropertyToSeller: "/backUpToSellerTokens",
			modelBackUpTokenPropertyFromSeller: "/backUpFromSellerTokens",
			modelBackUpDataPropertyFromSeller: "/backUpFromSellerF4Data",
			modelBackUpDataPropertyToSeller: "/backUpToSellerF4Data",
			modelBackUpTokenProperty: "/backUpSellerTokens",
			modelBackUpDataProperty: "/backUpSellerF4Data",
			isTreeFilter: true
		},
		moveUserF4: {
			fragmentId: "idMoveUserValueHelpDialog",
			fragmentPath: "com.samsung.aATPOverview.view.fragments.MoveUserValueHelpDialog",
			tableId: "idSellerTreeTable",
			tablePath: "com.samsung.aATPOverview.view.fragments.MoveUserTable",
			entityKey: "bname",
			entityDescriptionKey: "bname",
			modelDataProperty: "/moveUserF4Data",
			modelTokenProperty: "/moveUserTokens",
			isTreeFilter: false
		},
		sectionF4: {
			fragmentId: "idSectionValueHelpDialog",
			fragmentPath: "com.samsung.aATPOverview.view.fragments.SectionValueHelpDialog",
			tableId: "idSectionTable",
			tablePath: "com.samsung.aATPOverview.view.fragments.SectionTable",
			entityKey: "Section",
			entityDescriptionKey: "Section",
			modelDataProperty: "/sectionF4Data",
			modelTokenProperty: "/sectionTokens",
			isTreeFilter: false
		},
		productGrpDetailF4: {
			fragmentId: "idProductGrpDetailValueHelpDialog",
			fragmentPath: "com.samsung.aATPOverview.view.fragments.ProductGrpDetailValueHelpDialog",
			tableId: "idProductGrpDetailTable",
			tablePath: "com.samsung.aATPOverview.view.fragments.ProductGrpTable",
			entityKey: "ProductGrp",
			entityDescriptionKey: "ProductGrp",
			modelDataProperty: "/productGrpDetailF4Data",
			modelTokenProperty: "/productGrpDetailTokens",
			isTreeFilter: false
		},
		productF4: {
			fragmentId: "idProductValueHelpDialog",
			fragmentPath: "com.samsung.aATPOverview.view.fragments.ProductValueHelpDialog",
			tableId: "idProductGrpDetailTable",
			tablePath: "com.samsung.aATPOverview.view.fragments.ProductTable",
			entityKey: "Product",
			entityDescriptionKey: "Product",
			modelDataProperty: "/productF4Data",
			modelTokenProperty: "/productTokens",
			isTreeFilter: false
		},
		toWeekF4: {
			modelDataProperty: "/toWeeks",
			buttonTextProperty: "/toWeekButtonText",
			filterProperty: "/toWeekValue"
		},
		fromWeekF4: {
			modelDataProperty: "/fromWeeks",
			buttonTextProperty: "/fromWeekButtonText",
			filterProperty: "/fromWeekValue"
		},
		moveWeekF4: {
			modelDataProperty: "/moveWeeks",
			buttonTextProperty: "/moveWeekButtonText",
			filterProperty: "/moveWeekValue"
		}
	};

});