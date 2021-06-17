sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"i2d/ps/projectbillingrequests1/ext/model/formatter"
], function (Controller, formatter) {
	"use strict";

	return Controller.extend("i2d.ps.projectbillingrequests1.ext.controller.headerExt", {
		formatter: formatter
	});

});