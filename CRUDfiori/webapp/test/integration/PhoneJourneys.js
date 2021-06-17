jQuery.sap.require("sap.ui.qunit.qunit-css");
jQuery.sap.require("sap.ui.thirdparty.qunit");
jQuery.sap.require("sap.ui.qunit.qunit-junit");
QUnit.config.autostart = false;

sap.ui.require([
	"sap/ui/test/Opa5",
	"cf/CRUDfiori/test/integration/pages/Common",
	"sap/ui/test/opaQunit",
	"cf/CRUDfiori/test/integration/pages/App",
	"cf/CRUDfiori/test/integration/pages/Browser",
	"cf/CRUDfiori/test/integration/pages/Master",
	"cf/CRUDfiori/test/integration/pages/Detail",
	"cf/CRUDfiori/test/integration/pages/NotFound"
], function (Opa5, Common) {
	"use strict";
	Opa5.extendConfig({
		arrangements: new Common(),
		viewNamespace: "cf.CRUDfiori.view."
	});

	sap.ui.require([
		"cf/CRUDfiori/test/integration/NavigationJourneyPhone",
		"cf/CRUDfiori/test/integration/NotFoundJourneyPhone",
		"cf/CRUDfiori/test/integration/BusyJourneyPhone"
	], function () {
		QUnit.start();
	});
});