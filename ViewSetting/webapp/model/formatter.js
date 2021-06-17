sap.ui.define([
		"sap/ui/core/format/DateFormat"
	],
	function (DateFormatter) {
		"use strict";

		return {
			/**
			 * Rounds the number unit value to 2 digits
			 * @public
			 * @param {string} sValue the number string to be rounded
			 * @returns {string} sValue with 2 digits rounded
			 * 
			 */
			toUpper: function (sValue) {
				if (!sValue) {
					return "";
				}
				return sValue.toUpperCase();
			},

			dateFormat: function (dateValue) {

				let oDateFormat = sap.ui.core.format.DateFormat.getDateInstance({
					pattern: "EEE, MMM d, yyyy"
				});
				
				return oDateFormat.format(new Date(dateValue), true);

			}

		};

	});