sap.ui.define(["com/sap/atp/reuselib/utils/DateUtils",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"../model/formatter"
], function (DateUtils, Filter, FilterOperator, formatter) {
	"use strict";
	return {
		formatter: formatter,
		formWeekFilters: function (oI18nResourceModel, oATPOverviewModel, iCurrentWeek, SFilterValue, sSelectedFromWeek) {
			var aFilters = [],
				sFromWeek, oWeekFilter, sStartDate, sPastSixWeeksDate, sPastSixWeek, sYear = iCurrentWeek.toString().slice(0, 4),
				sWeek = iCurrentWeek.toString().slice(4, 6);
			sFromWeek = sSelectedFromWeek;
			if (!sSelectedFromWeek) {
				sStartDate = DateUtils.getDateOfISOWeek(parseInt(sWeek), parseInt(sYear));
				sPastSixWeeksDate = new Date(sStartDate.startDate.setDate(sStartDate.startDate.getDate() - 42));
				sPastSixWeek = DateUtils.getISOWeekByDate(sPastSixWeeksDate);
				//oATPOverViewModel = this.getModel("ATPOverviewModel");
				//oResourceModel = this.getResourceBundle();
				if (sPastSixWeek < 10) {
					sFromWeek = String(sYear) + "0" + String(sPastSixWeek);
				} else {
					sFromWeek = String(sYear) + String(sPastSixWeek);
				}
			}
			oATPOverviewModel.setProperty("/moveAllocationHistory/fromWeek", oI18nResourceModel.getText("calendarWeek", [sPastSixWeek, sYear]));
			oATPOverviewModel.setProperty("/moveAllocationHistory/startWeek", sFromWeek);
			oWeekFilter = new sap.ui.model.Filter("log_week", sap.ui.model.FilterOperator.BT, sFromWeek, String(iCurrentWeek));
			if (SFilterValue && SFilterValue.length !== 0) {
				for (var i in SFilterValue) {
					aFilters.push(new Filter("product_group", FilterOperator.EQ, SFilterValue[i]));
				}
			}
			aFilters.push(oWeekFilter);
			return aFilters;
		},

		/**
		 * Convenience Method for Creating Fragments.
		 * @public
		 * @param {String} [sFragmentID] Id of Fragment
		 * @param {String} [sFragmentName] name of Fragment 
		 * @returns {sap.ui.xmlfragment} the fragment for this view
		 */
		_createFragment: function (sFragmentID, sFragmentName, oFragmentController) {
			jQuery.sap.assert(sFragmentName, "Trying to instantiate fragment but fragmentName is not provided.");
			var oFragment = sap.ui.xmlfragment(sFragmentID, sFragmentName, oFragmentController);
			return oFragment;
		},

		/**
		 * Mathod used to Update tokens
		 * @param {Object} [sTokenProperty] 
		 * @param {Constructor} [oEvent]
		 */
		updateTokens: function (ATPOverviewModel, sTokenProperty, oEvent, bTree, sDataPoperty, sCompareProperty) {
			var sToken = "",
				oParams = oEvent.getParameters(),
				//oJsonModel = this.getOwnerComponent().getModel(this.viewModelName),
				aTokens = ATPOverviewModel.getProperty(sTokenProperty);

			if (oParams.type === "removed") {
				if (oParams.removedTokens.length) {
					oParams.removedTokens.forEach(function (oToken) {
						sToken = oToken.getKey();
					});
					if (bTree) {
						var aF4Data = ATPOverviewModel.getProperty(sDataPoperty);
						let removedRow = this.searchTokenInTreeData(aF4Data, sToken, sCompareProperty);
						if (removedRow) {
							removedRow.checked = false;
						}
					}
				}
			} else if (oParams.type === "added") {
				if (oParams.addedTokens.length) {
					oParams.addedTokens.forEach(function (oToken) {
						sToken = oToken.getKey();
					});
				}
			}
			aTokens.forEach(function (item, index) {
				if (sToken === item.key) {
					aTokens.splice(index, 1);
				}
			});
			return sToken;
		},
		/*
		 * Method for Setting Tree selection based on selected tokens.
		 * @private
		 * @param {String} [sToken] 
		 * @param {String} [sActionType]
		 * @param {String} [sSuggestionsProperty] 
		 * @param {String} [sF4Property] 
		 * @param {String} [sComparedProperty] 
		 */
		_setTreeSelection: function (ATPOverviewModel, sToken, sActionType, sSuggestionsProperty, sF4Property, sComparedProperty) {
			var aSelectedF4Data, aBindedData, oTreeData;
			//ATPOverviewModel = this.getOwnerComponent().getModel("ATPOverviewModel");
			aBindedData = ATPOverviewModel.getProperty(sSuggestionsProperty);
			aSelectedF4Data = jQuery.extend(true, [], aBindedData);
			aSelectedF4Data.forEach(function (oItem, iIndex) {
				if (sToken && sToken === oItem[sComparedProperty]) {
					if (sActionType === "removed") {
						ATPOverviewModel.setProperty(sSuggestionsProperty + "/" + iIndex + "/bSelected", false);
						//oItem.bSelected = false;
					} else {
						ATPOverviewModel.setProperty(sSuggestionsProperty + "/" + iIndex + "/bSelected", true);
						//oItem.bSelected = true;
					}
				}
			});
			oTreeData = this._flatToHeirarchy(aBindedData);
			ATPOverviewModel.setProperty(sF4Property, oTreeData);
		},

		/**
		 * Mathod used for updating selection of child nodes in tree table
		 * @param {String} [oBinding]
		 * @param {String} [oContext]
		 * @param {String} [sPropName]
		 * @param {Boolean} [bChecked]
		 * @param {Array} [rowSelection]
		 */
		fnUpdateChildSelection: function (oBinding, oContext, sPropName, bChecked, rowSelection) {
			if (oBinding.hasChildren(oContext)) {
				var aChildContexts = oBinding.getNodeContexts(oContext);
				jQuery.each(aChildContexts, function (iIndex, oChildContext) {
					let oRow = oChildContext.getModel().getProperty(oChildContext.getPath());
					oChildContext.getModel().setProperty(oChildContext.getPath() + sPropName, bChecked, oChildContext);
					rowSelection.push(oRow);
					this.fnUpdateChildSelection(oBinding, oChildContext, sPropName, bChecked, rowSelection);
				}.bind(this));
			}
		},
		/**
		 * Method for Value Help Dialog token Selection update.
		 * Method will update the token selection based on the Selected F4
		 * @public
		 * @param {constructor} [oEvent] event of token Remove
		 * @param {String} [sKey] Key value of Selected F4
		 * @param {String} [sF4Collection] Binding Property for selected f4
		 * @param {Bollean} [bTree] boolean value to check the table is tree or not
		 */
		onBaseValueHelpUpdateSelection: function (oEvent, sKey, sF4Collection, bTree) {
			var oTable = oEvent.getSource().getTable();
			if (bTree) {
				oTable.expandToLevel(4);
			}
			jQuery.each(oTable.getBinding("rows").getModel().getProperty(sF4Collection), function (index, oRow) {
				if (oEvent.getParameter("tokenKeys").indexOf(oRow[sKey]) !== -1) {
					oTable.addSelectionInterval(index, index);
				}
			});
		},

		/**
		 * Mathod used to open Value Help Dialog
		 * @param {Object} [oTreeTable] 
		 * @param {Object} [oBasicSearch]
		 */
		openValueHelpDialog: function (oView, oValueHelpDialog, oMultiInput, oTreeTable, oBasicSearch) {
			oValueHelpDialog.setTable(oTreeTable);
			oView.addDependent(oValueHelpDialog);
			if (oMultiInput.getTokens) {
				oValueHelpDialog.setTokens(oMultiInput.getTokens());
			}
			oValueHelpDialog.getFilterBar().setBasicSearch(oBasicSearch);
			oValueHelpDialog.open();
			oValueHelpDialog.update();
		},
		/**
		 * Mathod used to Search a value for Product Group data in F4
		 * @param {Constructor} [oEvent]
		 */
		onBaseItemTreeSearch: function (oValueHelpDialog, sFilterPath1, sFilterPath2) {
			var sValue = oValueHelpDialog.getFilterBar().getBasicSearchValue();
			var aFilters = [];
			if (sFilterPath2 && typeof (sFilterPath2) === "string") {
				aFilters.push(new Filter({
					filters: [
						new Filter({
							path: sFilterPath1,
							operator: FilterOperator.Contains,
							value1: sValue
						}),
						new Filter({
							path: sFilterPath2,
							operator: FilterOperator.Contains,
							value1: sValue
						})
					],
					and: false
				}));
			} else {
				aFilters.push(new Filter({
					filters: [
						new Filter({
							path: sFilterPath1,
							operator: FilterOperator.Contains,
							value1: sValue
						})
					],
					and: false
				}));
			}
			var oMaterialTable = oValueHelpDialog.getTable();
			var oBinding = oMaterialTable.getBinding("rows");
			oBinding.filter(new Filter({
				filters: aFilters
			}));
		},

		/*
		 * Method for Creating Hierarchy Structure from Flat Data.
		 * @private
		 * @param {Array} [oData] array of Data need to convert
		 */
		_flatToHeirarchy: function (oData) {
			// flatten to object with string keys that can be easily referenced later
			var oCopiedData = jQuery.extend(true, [], oData);
			var oFlatData = {};
			for (var i = 0; i < oCopiedData.length; i++) {
				delete oCopiedData[i].__metadata;
				var key = "id" + oCopiedData[i].NodeId;
				oFlatData[key] = oCopiedData[i];
			}
			// add child container array to each node
			for (i in oFlatData) {
				oFlatData[i].children = []; // add children container
			}
			// populate the child container arrays
			for (i in oFlatData) {
				var parentkey = "id" + oFlatData[i].ParentNodeId;
				if (oFlatData[parentkey]) {
					oFlatData[parentkey].children.push(oFlatData[i]);
				}
			}
			// find the root nodes (no parent found) and create the hierarchy tree from them
			var aRoot = [];
			for (i in oFlatData) {
				parentkey = "id" + oFlatData[i].ParentNodeId;
				if (!oFlatData[parentkey]) {
					aRoot.push(oFlatData[i]);
				}
			}
			return aRoot;
		},

		/**
		 * Mathod used to Search token in Tree Data
		 * @param {Array} [oData] array of Data
		 * @param {String} [sTokenKey] key of token 
		 */
		searchTokenInTreeData: function (aData, sTokenKey, sCompareProperty) {
			if (aData && aData[sCompareProperty] === sTokenKey) {
				return aData;
			} else if (aData.length) {
				let result = null;
				for (let i = 0; i < aData.length; i++) {
					result = this.searchTokenInTreeData(aData[i], sTokenKey, sCompareProperty);
					if (result) {
						return result;
					}
				}
			} else if (aData.children && aData.children.length) {
				let result = null;
				for (let i = 0; i < aData.children.length; i++) {
					result = this.searchTokenInTreeData(aData.children[i], sTokenKey, sCompareProperty);
					if (result) {
						return result;
					}
				}
			}
			return null;
		},

		// /**
		//  * Method To Remove Token from Selected Token
		//  * @public
		//  * @param {array} aSelToken - array of Selected Tokens
		//  * @param {array} aToken - array of All Tokens
		//  */
		// onTokenRemove: function (aSelToken, aToken, that) {
		// 	var tokenKeys = aSelToken,
		// 		oATPOverviewModel = that.oComponent.getModel("ATPOverviewModel");
		// 	tokenKeys.forEach(function (tokenKey) {
		// 		var id;

		// 		for (id = aToken.length - 1; id >= 0; id--) {
		// 			if (aToken[id].key === tokenKey) {
		// 				aToken.splice(id, 1);
		// 			}
		// 		}
		// 	});
		// 	oATPOverviewModel.refresh();
		// },

		onTokenRemove: function (oEvent, sKey, sF4Collection) {
			var oTable = oEvent.getSource().getTable();
			jQuery.each(oTable.getBinding("rows").getModel().getProperty(sF4Collection), function (index, oRow) {
				if (oEvent.getParameter("tokenKeys").indexOf(oRow[sKey]) !== -1) {
					oTable.removeSelectionInterval(index, index);
				}
			});
		},

		onValueHelpUpdateSelection: function (oEvent, sKey, sF4Collection, bTree) {
			var oTable = oEvent.getSource().getTable();
			if (bTree) {
				oTable.expandToLevel(4);
			}
			jQuery.each(oTable.getBinding("rows").getModel().getProperty(sF4Collection), function (index, oRow) {
				if (oEvent.getParameter("tokenKeys").indexOf(oRow[sKey]) !== -1) {
					oTable.addSelectionInterval(index, index);
				}
			});
		},

		onValueHelpSelectionChange: function (oEvent, sKey, sDescription) {
			var oTable = oEvent.getSource().getTable();
			var aUpdateTokens = oEvent.getParameter("updateTokens");
			var aRow = oEvent.getParameter("tableSelectionParams").rowIndices.length === 0 ? [oEvent.getParameter("tableSelectionParams").rowContext
					.getObject()
				] :
				jQuery.map(oEvent.getParameter("tableSelectionParams").rowIndices, function (index) {
					return oTable.getContextByIndex(index).getObject();
				});
			jQuery.each(aRow, function (index, oRow) {
				aUpdateTokens.push({
					sKey: oRow[sKey],
					oRow: this.formatter.tokenTextFormatter(oRow[sKey], oRow[sDescription]),
					bSelected: oTable.getSelectedIndices().indexOf(oEvent.getParameter("tableSelectionParams").rowIndex) !== -1
				});
			}.bind(this));
		},

		setTokensFromValueHelp: function (ATPOverviewModel, aTokens, aTokenProperty) {
			var allTokens = [];
			aTokens.forEach(function (item) {
				var oEmptyObject = {
					"key": item.getProperty("key"),
					"text": item.getProperty("text")
				};
				allTokens.push(oEmptyObject);
			});
			ATPOverviewModel.setProperty(aTokenProperty, allTokens);
		}
	};
});