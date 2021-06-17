sap.ui.define([
	"sap/m/Text"
], function (Text) {
	"use strict";
	return {
		
		/**
		 * Defines a value state based on the price
		 *
		 * @public
		 * @param {number} iPrice the price of a post
		 * @returns {string} sValue the state for the price
		 */
		iconState: function (iCount) {
			if ( iCount !== "00" || iCount !== "" || iCount !== null) {
				return "Reject";
			}
			else {
				return "Transparent";
			}
		}
	};
});