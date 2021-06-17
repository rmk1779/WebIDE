sap.ui.define([], function () {
	"use strict";

	return {
		"moveAllocationHistory": {
			"vizInitialProperties": {
				plotArea: {
					dataLabel: {
						visible: true,
						showTotal: true
					}
				},
				categoryAxis: {
					title: {
						visible: true,
						text: ""
					}
				},
				title: {
					visible: false
				},
				legendGroup: {
					layout: {
						position: "bottom"
					},
					linesOfWrap: 5
				},
				valueAxis: {
					title: {
						visible: true,
						text: ""
					}
				}
			},
			"dataSet": {
				data: {
					path: "/ZCCIDPSD1_PRDCTGRP_WKLY_HSTRY"
				}
			},
			"measures": [{
				name: "Seller Move",
				value: "{seller_qty}"
			}, {
				name: "Logical Site Move",
				value: "{site_qty}"
			}, {
				name: "Time Move",
				value: "{time_qty}"
			}]
		},

		"moveAllocationConsumption": {
			"vizInitialProperties": {
				plotArea: {
					dataLabel: {
						visible: true,
						showTotal: true
					}
				},
				categoryAxis: {
					title: {
						visible: true,
						text: ""
					}
				},
				title: {
					visible: false
				},
				legendGroup: {
					layout: {
						position: "bottom"
					},
					linesOfWrap: 5
				},
				valueAxis: {
					title: {
						visible: true,
						text: ""
					}
				}
			},
			"data": {
				path: "/ZCCIDPSD1_ALLOC_CONSUME_HSTRY"
			},
			"measures": [{
				name: "Allocation",
				value: "{allocation}"
			}, {
				name: "Consumption",
				value: "{consumption}"
			}]
		}

	};
});