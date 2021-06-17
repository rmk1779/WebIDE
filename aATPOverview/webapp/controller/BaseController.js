sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/UIComponent",
	"com/samsung/aATPOverview/model/TimeMoveDialogConfig",
	"com/samsung/aATPOverview/util/ValueHelpDialogUtil",
	"sap/m/SearchField"
], function (Controller, UIComponent, TimeMoveDialogConfig, ValueHelpDialogUtil, SearchField) {
	"use strict";
	return Controller.extend("com.samsung.aATPOverview.controller.BaseController", {

		/**
		 * Convenience method for accessing the router.
		 * @public
		 * @returns {sap.ui.core.routing.Router} the router for this component
		 */
		getRouter: function () {
			return UIComponent.getRouterFor(this);
		},

		/**
		 * Convenience method for getting the view model by name.
		 * @public
		 * @param {string} [sName] the model name
		 * @returns {sap.ui.model.Model} the model instance
		 */
		getModel: function (sName) {
			return this.getView().getModel(sName);
		},

		/**
		 * Convenience method for setting the view model.
		 * @public
		 * @param {sap.ui.model.Model} oModel the model instance
		 * @param {string} sName the model name
		 * @returns {sap.ui.mvc.View} the view instance
		 */
		setModel: function (oModel, sName) {
			return this.getView().setModel(oModel, sName);
		},

		/**
		 * Getter for the resource bundle.
		 * @public
		 * @returns {sap.ui.model.resource.ResourceModel} the resourceModel of the component
		 */
		getResourceBundle: function () {
			return this.getOwnerComponent().getModel("i18n").getResourceBundle();
		},

		fetchCurrentWeek: function () {
			return new Promise(function (resolve) {
				this.getOwnerComponent().crud.whenFunctionImportCalled({
					path: "/ZFIIDPSD101",
					method: "GET"
				}).then(function (oData) {
					resolve(oData);
					this.getModel("ATPOverviewModel").setProperty("/moveAllocationHistory/defaultData", oData.data);
				}.bind(this), function () {

				});
			}.bind(this));
		},

		/**
		 * Common Event Handler for all the Value Help dialog launch
		 * @public
		 * @param {object} oEvent - Event Object
		 */
		f4ValueRequest: function (oEvent) {
			var oBasicSearch;
			let oCustomData = oEvent.getSource().data();
			let f4Name = oCustomData.f4name;
			let oDialogConfig = TimeMoveDialogConfig[f4Name],
				sF4TableBindingPath = this.getTableBindingPath(f4Name);

			this.oMultiInput = oEvent.getSource();
			this.oValueHelpDialog = ValueHelpDialogUtil._createFragment(oDialogConfig.fragmentId, oDialogConfig.fragmentPath, this);
			var oTreeTable = ValueHelpDialogUtil._createFragment(oDialogConfig.tableId, oDialogConfig.tablePath, this);
			if (oDialogConfig.isTreeFilter) {
				oTreeTable.bindRows({
					path: sF4TableBindingPath.tablePath,
					parameters: sF4TableBindingPath.parameters
				});
			} else {
				oTreeTable.bindRows({
					path: sF4TableBindingPath.tablePath
				});
			}
			switch (f4Name) {
			case "sectionF4":
			case "productGroupF4":
			case "productF4":
			case "sellerF4":
				oBasicSearch = new SearchField({
					search: ValueHelpDialogUtil.onBaseItemTreeSearch.bind(this, this.oValueHelpDialog, oDialogConfig.entityKey, oDialogConfig.entityDescriptionKey)
				});
				break;
			case "siteF4":
			case "moveUserF4":
				oBasicSearch = new SearchField({
					search: ValueHelpDialogUtil.onBaseItemTreeSearch.bind(this, this.oValueHelpDialog, oDialogConfig.entityKey)
				});
				break;
			default:
				break;
			}
			ValueHelpDialogUtil.openValueHelpDialog(this.getView(), this.oValueHelpDialog, this.oMultiInput, oTreeTable, oBasicSearch, f4Name);
		},

		getTableBindingPath: function (f4Name) {
			var oObject = {};
			switch (f4Name) {
			case "toSellerF4":
			case "fromSellerF4":
			case "sellerF4":
				oObject.tablePath = `ATPOverviewModel>${this.viewModelPath}/${f4Name}Data`;
				oObject.parameters = {
					arrayNames: ["children"]
				};
				break;
			case "toSiteF4":
			case "moveUserF4":
			case "sectionF4":
			case "productGrpDetailF4":
			case "productF4":
			case "materialF4":
			case "fromSiteF4":
			case "siteF4":
				oObject.tablePath = `ATPOverviewModel>/${f4Name}Data`;
				break;
			default:
				break;
			}
			return oObject;
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

		onValueHelpCancelPress: function (oEvent) {
			var oSource = oEvent.getSource();
			oSource.close();
		},

		/**
		 * Mathod used to fetch site Entity data for Site F4
		 */
		fetchTreeF4Data: function (entitySet, modelProperty, flatDataProperty) {
			var ATPOverviewModel;
			ATPOverviewModel = this.getOwnerComponent().getModel("ATPOverviewModel");
			this.getOwnerComponent().crud.whenRead({
				path: entitySet,
				busyControl: this.getView()
			}).then(function (response) {
				let oData = response.data;
				var oCopyData = jQuery.extend(true, {}, oData);
				var oTreeData = ValueHelpDialogUtil._flatToHeirarchy(oCopyData.results);
				ATPOverviewModel.setProperty(modelProperty, oTreeData);
				ATPOverviewModel.setProperty(flatDataProperty, oCopyData.results);
			}.bind(this), function (err) {
				//MessageToast.show("JSON Model not set");
			}.bind(this));
		},

		fetchFlatF4Data: function (entitySet, modelProperty) {
			var ATPOverviewModel;
			ATPOverviewModel = this.getOwnerComponent().getModel("ATPOverviewModel");
			this.getOwnerComponent().crud.whenRead({
				path: entitySet,
				busyControl: this.getView()
			}).then(function (response) {
				let oData = response.data;
				ATPOverviewModel.setProperty(modelProperty, oData.results);
			}.bind(this), function (err) {
				//MessageToast.show("JSON Model not set");
			}.bind(this));
		},

		onGeneralValueHelpSelectionChange: function (oEvent) {
			var oCustomData = oEvent.getSource().data(),
				oDialogConfig = TimeMoveDialogConfig[oCustomData.f4name];
			ValueHelpDialogUtil.onValueHelpSelectionChange(oEvent, oDialogConfig.entityKey);
		},

		onGeneralValueHelpUpdateSelection: function (oEvent) {
			var sDataProperty, oCustomData = oEvent.getSource().data(),
				oDialogConfig = TimeMoveDialogConfig[oCustomData.f4name];
			sDataProperty = oDialogConfig.modelDataProperty;
			ValueHelpDialogUtil.onValueHelpUpdateSelection(oEvent, oDialogConfig.entityKey, sDataProperty);
		},

		onGeneralTokenRemove: function (oEvent) {
			var sDataProperty, oCustomData = oEvent.getSource().data(),
				oDialogConfig = TimeMoveDialogConfig[oCustomData.f4name];
			sDataProperty = oDialogConfig.modelDataProperty;
			ValueHelpDialogUtil.onTokenRemove(oEvent, oDialogConfig.entityKey, sDataProperty);
		},
		/**
		 * Method For close Seller Group Value Help Dialog.
		 * @public
		 */
		onValueHelpDialogClose: function (oEvent) {
			let sTokenProperty, oCustomData, oDialogConfig, aTokens, oSource = oEvent.getSource();
			let ATPOverviewModel = this.getOwnerComponent().getModel("ATPOverviewModel");
			oCustomData = oSource.data();
			aTokens = oEvent.getParameter("tokens");
			oDialogConfig = TimeMoveDialogConfig[oCustomData.f4name];
			sTokenProperty = this.viewModelPath + oDialogConfig.modelTokenProperty;
			ValueHelpDialogUtil.setTokensFromValueHelp(ATPOverviewModel, aTokens, sTokenProperty);
			this.oValueHelpDialog.close();
		},

		onSectionTokenUpdate: function (oEvent) {
			let sTokenProperty, sDataProperty,
				oCustomData = oEvent.getSource().data(),
				f4Name = oCustomData.f4name,
				ATPOverviewModel = this.getOwnerComponent().getModel("ATPOverviewModel"),
				oDialogConfig = TimeMoveDialogConfig[f4Name];
			sTokenProperty = this.viewModelPath + oDialogConfig.modelTokenProperty;
			sDataProperty = oDialogConfig.modelDataProperty;
			ValueHelpDialogUtil.updateTokens(ATPOverviewModel, sTokenProperty, oEvent, true, sDataProperty, oDialogConfig.entityKey);
		},
		
		onSellerTokenUpdate: function (oEvent) {
			let sTokenProperty, sDataProperty,
				oCustomData = oEvent.getSource().data(),
				f4Name = oCustomData.f4name,
				ATPOverviewModel = this.getOwnerComponent().getModel("ATPOverviewModel"),
				oDialogConfig = TimeMoveDialogConfig[f4Name];
			sTokenProperty = this.viewModelPath + oDialogConfig.modelTokenProperty;
			sDataProperty = this.viewModelPath + oDialogConfig.modelDataProperty;
			ValueHelpDialogUtil.updateTokens(ATPOverviewModel, sTokenProperty, oEvent, true, sDataProperty, oDialogConfig.entityKey);
		},

		/**
		 * Method For close Value Help Dialog on Cancel button press.
		 * @public
		 * @param {Constructor} [oEvent] Cancel Button Press Event in F4
		 */
		onSellerValueHelpCancelPress: function (oEvent) {
			var oDialogConfig = TimeMoveDialogConfig.sellerF4,
				sTokenProperty = this.viewModelPath + oDialogConfig.modelTokenProperty,
				sDataProperty = this.viewModelPath + oDialogConfig.modelDataProperty,
				sBackupTokenProperty = this.viewModelPath + oDialogConfig.modelBackUpTokenProperty,
				sBackupDataProperty = this.viewModelPath + oDialogConfig.modelBackUpDataProperty,
				oATPOverviewModel = this.getOwnerComponent().getModel("ATPOverviewModel"),
				oSource = oEvent.getSource();
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
				sTokenProperty = this.viewModelPath + oDialogConfig.modelTokenProperty,
				sDataProperty = this.viewModelPath + oDialogConfig.modelDataProperty,
				sBackupTokenProperty = this.viewModelPath + oDialogConfig.modelBackUpTokenProperty,
				sBackupDataProperty = this.viewModelPath + oDialogConfig.modelBackUpDataProperty;

			ValueHelpDialogUtil.onBaseValueHelpUpdateSelection(oEvent, oDialogConfig.entityKey, this.viewModelPath + oDialogConfig.modelDataProperty,
				oDialogConfig.isTreeFilter);
			oATPOverviewModel.setProperty(sBackupTokenProperty, jQuery.extend(true, [], oATPOverviewModel.getProperty(sTokenProperty)));
			oATPOverviewModel.setProperty(sBackupDataProperty, jQuery.extend(true, [], oATPOverviewModel.getProperty(sDataProperty)));
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
			var sTokenProperty, sDataProperty, ATPOverviewModel = this.getOwnerComponent().getModel("ATPOverviewModel"),
				oDialogConfig = TimeMoveDialogConfig.sellerF4;
			sTokenProperty = this.viewModelPath + oDialogConfig.modelTokenProperty;
			sDataProperty = this.viewModelPath + oDialogConfig.modelDataProperty;
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
			let sCheckBoxProperty = "sellerLowLevelSelect",
				oDialogConfig = TimeMoveDialogConfig.sellerF4,
				sTokenProperty = this.viewModelPath + oDialogConfig.modelTokenProperty,
				rowSelection = [currentRow];
			let aSellerTokens = ATPOverviewDataModel.getProperty(sTokenProperty) || [];
			let bLowerLevel = ATPOverviewDataModel.getProperty(this.viewModelPath + "/" + sCheckBoxProperty);
			let sapTokens = [];

			if (bLowerLevel) {
				ValueHelpDialogUtil.fnUpdateChildSelection(oBinding, oContext, "/checked", oEvent.getParameter("selected"), rowSelection);
			}

			rowSelection.forEach(function (oRow) {
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
			
			sapTokens = aSellerTokens.map(function (item) {
				return new sap.m.Token({
					key: item.key,
					text: item.text
				});
			});
			oDialog.setTokens([]);
			oDialog.setTokens(sapTokens);
			ATPOverviewDataModel.setProperty(sTokenProperty, aSellerTokens);
			ATPOverviewDataModel.refresh();
		}

	});
});