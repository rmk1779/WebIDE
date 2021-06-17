jQuery.sap.require("sap.ui.qunit.qunit-css");
jQuery.sap.require("sap.ui.thirdparty.qunit");
jQuery.sap.require("sap.ui.qunit.qunit-junit");
QUnit.config.autostart = false;

// We cannot provide stable mock data out of the template.
// If you introduce mock data, by adding .json files in your webapp/localService/mockdata folder you have to provide the following minimum data:
// * At least 3 Products in the list

sap.ui.require([
	"sap/ui/test/Opa5",
	"cf/CRUDfiori/test/integration/pages/Common",
	"sap/ui/test/opaQunit",
	"cf/CRUDfiori/test/integration/pages/App",
	"cf/CRUDfiori/test/integration/pages/Browser",
	"cf/CRUDfiori/test/integration/pages/Master",
	"cf/CRUDfiori/test/integration/pages/Detail",
	"cf/CRUDfiori/test/integration/pages/Create",
	"cf/CRUDfiori/test/integration/pages/NotFound"
], function (Opa5, Common) {
	"use strict";
	Opa5.extendConfig({
		arrangements: new Common(),
		viewNamespace: "cf.CRUDfiori.view."
	});

	sap.ui.require([
		"cf/CRUDfiori/test/integration/MasterJourney",
		"cf/CRUDfiori/test/integration/NavigationJourney",
		"cf/CRUDfiori/test/integration/NotFoundJourney",
		"cf/CRUDfiori/test/integration/BusyJourney",
		"cf/CRUDfiori/test/integration/FLPIntegrationJourney"
	], function () {
		QUnit.start();
	});
});