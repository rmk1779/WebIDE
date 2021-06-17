sap.ui.define([
	"sap/com/csc-osr_taxportal_idaform/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/com/csc-osr_taxportal_idaform/commons/validation",
	"sap/com/csc-osr_taxportal_idaform/commons/dataModels",
	"sap/ui/model/Filter"
], function (BaseController, JSONModel, oValidations, dataModels, Filter) {
	"use strict";
	var sUserType;

	return BaseController.extend("sap.com.csc-osr_taxportal_idaform.controller.idaform", {

		onInit: function () {
			var oModel = this.getOwnerComponent().getModel("idaformModel");
			oModel.setSizeLimit(1000);
			var Router = sap.ui.core.UIComponent.getRouterFor(this);
			Router.getRoute("idaform").attachPatternMatched(this._onRouteMatched, this);
			this.ResourceBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
			// this.IdaDataModel = new sap.ui.model.json.JSONModel();
			// // this.getView().setModel(this.IdaDataModel, "IdaDataModel");
			this._wizard = this.getView().byId("IdIdaformMainWizard");
			this._oNavContainer = this.byId("wizardNavContainer");
			this._oWizardContentPage = this.byId("idIDAformPage");

			this._oWizardReviewPage = sap.ui.xmlfragment("sap.com.csc-osr_taxportal_idaform.view.idaform.review", this);
			this._oNavContainer.addPage(this._oWizardReviewPage);
			this._initIdaFormModel();

		},
		_onRouteMatched: function () {
			dataModels._getAllCountries(this);
			// dataModels._getFormBundles(this);
			// this.getView().setModel(new JSONModel(), "idaformModel");
			this.getView().getModel("idaformModel").setProperty("/isFormWizardMode", true);
			this.getView().getModel("idaformModel").setProperty("/bIsNextButton", true);
			this.getView().getModel("idaformModel").setProperty("/IsReviewButton", false);
			this.getView().getModel("idaformModel").setProperty("/bIsSubmitButton", false);
			var sDate = new Date().toLocaleDateString();
			this.getView().getModel("idaformModel").setProperty("/Date", sDate);
			// var sWizardStep = this.getView().getModel("idaformModel").getProperty("/isFormWizardStep");
		},
		_navBackToStep: function (nStepIndex) {
			var oStep = this._wizard.getSteps()[nStepIndex];
			var fnAfterNavigate = function () {
				this._wizard.goToStep(oStep);
				this._oNavContainer.detachAfterNavigate(fnAfterNavigate);
			}.bind(this);
			this._oNavContainer.attachAfterNavigate(fnAfterNavigate);
			this._oNavContainer.to(this._oWizardContentPage);
		},
		_initIdaFormModel: function () {
			var idaModel = {
				"identification": {
					"transferorID": ""
				},
				"Details": {
					"uniqueTransferorCode": "",
					"transferorName": "",
					"dateOfBirth": "",
					"Nationality": "",
					"CountryOfTaxResidence": "",
					"CountryOfIncorporation": "",
					"CountryOfResidenceForTaxPurposes": "",
					"PassportNumber": "",
					"CountryOfIssue": "",
					"VisaNumber": "",
					"VisaExpiryDate": "",
					"VisaSubclass": "",
					"OverseasIdentifier": "",
					"OverseasRegistrationNumber": "",
					"ForeignInvestmentReviewBoardApplicationNumber": "",
					"OtherOverseasIdentifier": ""
				},
				"Declaration": {
					"name": "",
					"contactNumber": "",
					"emailAddress": "",
					"checkBox": ""
				}
			};
			this.getOwnerComponent().getModel("idaformModel").setProperty("/idaModel", idaModel);
		},
		handleWizardNext: function () {
			var bIsValidStep = true;
			var oView = this.getView();
			// var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			switch (this._wizard.getProgress()) {
			case 1:
				bIsValidStep = this.validateIdentificationStep();
				break;
			case 2:
				bIsValidStep = this.validateIdentificationStep() && this.validateDetails();
				break;
			case 3:
				bIsValidStep = this.validateIdentificationStep() && this.validateDetails() && this.validateDeclaration();
				break;
			default:
			}

			if (bIsValidStep) {
				if (this._wizard.getProgress() === 1) {
					oView.byId("idIdaformIdentificationFooter").setVisible(false);
					this._getFormBundles(this);
				} else if (this._wizard.getProgress() === 2) {
					oView.byId("idIdaformDetailsFooter").setVisible(false);
					this.getView().getModel("idaformModel").setProperty("/bIsNextButton", false);
					this.getView().getModel("idaformModel").setProperty("/IsReviewButton", true);
				} else if (this._wizard.getProgress() === 3) {
					this._oNavContainer.to(this._oWizardReviewPage);
					this.getView().getModel("idaformModel").setProperty("/isFormWizardMode", false);
					this.getView().getModel("idaformModel").setProperty("/bIsNextButton", false);
					this.getView().getModel("idaformModel").setProperty("/IsReviewButton", false);
					this.getView().getModel("idaformModel").setProperty("/bIsSubmitButton", true);
					this.getView().getModel("idaformModel").refresh(true);
					this.getView().getModel("idaformModel").updateBindings(true);
				}
				this._wizard.nextStep();
			}
			this.getView().getModel("idaformModel").refresh(true);
			this.getView().getModel("idaformModel").updateBindings(true);

			var getTransferorTyp = async() => {
				try {
					var sTransferorTypeA = await this._getTransferorDetails();

					if (sTranferorID === "") {
						this.getView().byId("idTranferorID").focus();
						this.getView().byId("idTranferorID").setValueState("Error");
						this.getView().byId("idTranferorID").setValueStateText(this.ResourceBundle.getText("Validation.MandatoryErr"));
						bIsValidStep = false;
					} else {
						this.getView().byId("idTranferorID").setValueState("None");

						var sTransferorType = this.getView().getModel("idaformModel").getProperty("/TransferorType");
						if (sTransferorType && Number(sTransferorType) === 0) {
							bIsValidStep = false;
						} else if (sTransferorType && Number(sTransferorType) === 1) {
							this._getIndividualIdaForm();
						} else if (sTransferorType && Number(sTransferorType) === 2) {
							this._getCompanyIdaForm();
						}
					}

					return bIsValidStep;

				} catch (error) {
					console.log(error);
				}

			};
			getTransferorTyp();
			// test();

		},
		// _onValidate : function(){
		// 	var bIsValidStep = true;
		// 		if (sTranferorID === "") {
		// 		this.getView().byId("idTranferorID").focus();
		// 		this.getView().byId("idTranferorID").setValueState("Error");
		// 		this.getView().byId("idTranferorID").setValueStateText(this.ResourceBundle.getText("Validation.MandatoryErr"));
		// 		bIsValidStep = false;
		// 	} else {
		// 		this.getView().byId("idTranferorID").setValueState("None");

		// 		var sTransferorType = this.getView().getModel("idaformModel").getProperty("/TransferorType");
		// 		if (sTransferorType && Number(sTransferorType) === 0) {
		// 			bIsValidStep = false;
		// 		} else if (sTransferorType && Number(sTransferorType) === 1) {
		// 			this._getIndividualIdaForm();
		// 		} else if (sTransferorType && Number(sTransferorType) === 2) {
		// 			this._getCompanyIdaForm();
		// 		}
		// 	}
		// 	return  bIsValidStep
		// },
		onliveChangeValidateTranferorID: function (oEvent) {
			var sTranferorID = oEvent.getSource().getValue();
			if (!sTranferorID) {
				oEvent.getSource().setValueState("Error");
				oEvent.getSource().setValueStateText(this.ResourceBundle.getText("Validation.MandatoryErr"));
			} else {
				oEvent.getSource().setValueState("None");
			}
		},
		_getIndividualIdaForm: function () {
			sUserType = "Individual";
			this.getView().getModel("idaformModel").setProperty("/isCompanyFieldVisible", false);

		},

		_getCompanyIdaForm: function () {
			sUserType = "Company";
			this.getView().getModel("idaformModel").setProperty("/isIndividualFieldVisible", false);

		},

		validateDetails: function () {
			var bIsValidStep = true;

			if (sUserType === "Individual") {
				this._onValidateIndividualsIdaForm();
				bIsValidStep = this._onValidateIndividualsIdaForm();
			} else if (sUserType === "Company") {
				this._onValidateCompaniesdaForm();
				bIsValidStep = this._onValidateCompaniesdaForm();
			}

			// if ($(".sapMInputBaseContentWrapperError")) {
			// 	$(".sapMInputBaseContentWrapperError").first().children().focus();
			// }
			return bIsValidStep;
		},

		_onValidateIndividualsIdaForm: function () {
			var bIsValidStep = true,
				sDOB = this.getView().byId("idDateOfBirth").getValue(),
				sNationality = this.getView().byId("idNationality")._getSelectedItemText(),
				sCountryOfResidence = this.getView().byId("idResidence")._getSelectedItemText(),
				sVisaExpiryDate = this.getView().byId("idExpDate").getValue();
			// sPassportNumber = this.getView().byId("idPassportNumber").getValue(),
			// sCountryOfIssue = this.getView().byId("idCountryOfIssue")._getSelectedItemText(),
			// sVisaNumber = this.getView().byId("idVisaNumber").getValue(),
			// sVisaSubclass = this.getView().byId("idVisaSubClass").getValue(),
			// sOverseasIdentifier = this.getView().byId("idOverceaseIdentifier").getValue(),
			// sReviewBoardAppNo = this.getView().byId("idForeign.investment.review.board.applicNumber").getValue(),
			// sOtherOverseasIdentifier = this.getView().byId("idOther.overcease.identifier").getValue();

			if (sDOB === "") {
				this.getView().byId("idDateOfBirth").focus();
				this.getView().byId("idDateOfBirth").setValueState("Error");
				this.getView().byId("idDateOfBirth").setValueStateText(this.ResourceBundle.getText("Validation.MandatoryErr"));
				bIsValidStep = false;
			} else {
				var oDate = this.getView().byId("idDateOfBirth")._getSelectedDate();
				var bDay = oDate.getDay();
				var bMonth = oDate.getMonth();
				var bYear = oDate.getFullYear();
				var age = 13;
				var setDate = new Date(bYear + age, bMonth - 1, bDay);
				var currDate = new Date();

				if (currDate <= setDate) {
					this.getView().byId("idDateOfBirth").focus();
					this.getView().byId("idDateOfBirth").setValueState("Error");
					this.getView().byId("idDateOfBirth").setValueStateText(this.ResourceBundle.getText("dateOfBirthValidation"));
					bIsValidStep = false;
				} else {
					this.getView().byId("idDateOfBirth").setValueState("None");
					this.getView().getModel("idaformModel").setProperty("/idaModel/Details/dateOfBirth", this.getView().byId("idDateOfBirth")._getSelectedDate());
				}
			}

			if (sNationality === "") {
				this.getView().byId("idNationality").focus();
				this.getView().byId("idNationality").setValueState("Error");
				this.getView().byId("idNationality").setValueStateText(this.ResourceBundle.getText("Validation.MandatoryErr"));
				bIsValidStep = false;
			} else {
				this.getView().byId("idNationality").setValueState("None");
			}

			if (sCountryOfResidence === "") {
				this.getView().byId("idResidence").focus();
				this.getView().byId("idResidence").setValueState("Error");
				this.getView().byId("idResidence").setValueStateText(this.ResourceBundle.getText("Validation.MandatoryErr"));
				bIsValidStep = false;
			} else {
				this.getView().byId("idResidence").setValueState("None");
			}

			if (sVisaExpiryDate !== "") {
				this.getView().getModel("idaformModel").setProperty("/idaModel/Details/VisaExpiryDate", this.getView().byId("idExpDate")._getSelectedDate());
			}
			// if (sPassportNumber === "") {
			// 	this.getView().byId("idPassportNumber").focus();
			// 	this.getView().byId("idPassportNumber").setValueState("Error");
			// 	this.getView().byId("idPassportNumber").setValueStateText(this.ResourceBundle.getText("Validation.MandatoryErr"));
			// 	bIsValidStep = false;
			// } else {
			// 	this.getView().byId("idPassportNumber").setValueState("None");
			// }

			// if (sCountryOfIssue === "") {
			// 	this.getView().byId("idCountryOfIssue").focus();
			// 	this.getView().byId("idCountryOfIssue").setValueState("Error");
			// 	this.getView().byId("idCountryOfIssue").setValueStateText(this.ResourceBundle.getText("Validation.MandatoryErr"));
			// 	bIsValidStep = false;
			// } else {
			// 	this.getView().byId("idCountryOfIssue").setValueState("None");
			// }

			// if (sVisaNumber === "") {
			// 	this.getView().byId("idVisaNumber").focus();
			// 	this.getView().byId("idVisaNumber").setValueState("Error");
			// 	this.getView().byId("idVisaNumber").setValueStateText(this.ResourceBundle.getText("Validation.MandatoryErr"));
			// 	bIsValidStep = false;
			// } else {
			// 	this.getView().byId("idVisaNumber").setValueState("None");
			// }

			// if (sVisaSubclass === "") {
			// 	this.getView().byId("idVisaSubClass").focus();
			// 	this.getView().byId("idVisaSubClass").setValueState("Error");
			// 	this.getView().byId("idVisaSubClass").setValueStateText(this.ResourceBundle.getText("Validation.MandatoryErr"));
			// 	bIsValidStep = false;
			// } else {
			// 	this.getView().byId("idVisaSubClass").setValueState("None");
			// }

			// if (sOverseasIdentifier === "") {
			// 	this.getView().byId("idOverceaseIdentifier").focus();
			// 	this.getView().byId("idOverceaseIdentifier").setValueState("Error");
			// 	this.getView().byId("idOverceaseIdentifier").setValueStateText(this.ResourceBundle.getText("Validation.MandatoryErr"));
			// 	bIsValidStep = false;
			// } else {
			// 	this.getView().byId("idOverceaseIdentifier").setValueState("None");
			// }

			// if (sReviewBoardAppNo === "") {
			// 	this.getView().byId("idForeign.investment.review.board.applicNumber").focus();
			// 	this.getView().byId("idForeign.investment.review.board.applicNumber").setValueState("Error");
			// 	this.getView().byId("idForeign.investment.review.board.applicNumber").setValueStateText(this.ResourceBundle.getText(
			// 		"Validation.MandatoryErr"));
			// 	bIsValidStep = false;
			// } else {
			// 	this.getView().byId("idForeign.investment.review.board.applicNumber").setValueState("Error");
			// }

			// if (sOtherOverseasIdentifier === "") {
			// 	this.getView().byId("idOther.overcease.identifier").focus();
			// 	this.getView().byId("idOther.overcease.identifier").setValueState("Error");
			// 	this.getView().byId("idOther.overcease.identifier").setValueStateText(this.ResourceBundle.getText("Validation.MandatoryErr"));
			// 	bIsValidStep = false;
			// } else {
			// 	this.getView().byId("idOther.overcease.identifier").setValueState("None");
			// }
			return bIsValidStep;
		},
		_onValidateCompaniesdaForm: function () {
			var bIsValidStep = true,
				sCountryOfResidenceForTaxPurposes = this.getView().byId("idCountryOfResidenceForTaxPurposes")._getSelectedItemText(),
				sCountryOfIncorporation = this.getView().byId("idCountryOfIncorporation")._getSelectedItemText();
			// sOverseasRegistrationNumber = this.getView().byId("idOverseasRegistrationNumber").getValue(),
			// sOtherOverceaseIdentifier = this.getView().byId("idOther.overcease.identifier").getValue();

			if (sCountryOfResidenceForTaxPurposes.length === 0) {
				this.getView().byId("idCountryOfResidenceForTaxPurposes").focus();
				this.getView().byId("idCountryOfResidenceForTaxPurposes").setValueState("Error");
				this.getView().byId("idCountryOfResidenceForTaxPurposes").setValueStateText(this.ResourceBundle.getText("Validation.MandatoryErr"));
				bIsValidStep = false;
			} else {
				this.getView().byId("idCountryOfResidenceForTaxPurposes").setValueState("None");
			}

			if (sCountryOfIncorporation === "") {
				this.getView().byId("idCountryOfIncorporation").focus();
				this.getView().byId("idCountryOfIncorporation").setValueState("Error");
				this.getView().byId("idCountryOfIncorporation").setValueStateText(this.ResourceBundle.getText("Validation.MandatoryErr"));
				bIsValidStep = false;
			} else {
				this.getView().byId("idCountryOfIncorporation").setValueState("None");
			}

			// if (sOtherOverceaseIdentifier === "") {
			// 	this.getView().byId("idOther.overcease.identifier").focus();
			// 	this.getView().byId("idOther.overcease.identifier").setValueState("Error");
			// 	this.getView().byId("idOther.overcease.identifier").setValueStateText(this.ResourceBundle.getText("Validation.MandatoryErr"));
			// 	bIsValidStep = false;
			// } else {
			// 	this.getView().byId("idOther.overcease.identifier").setValueState("None");
			// }

			return bIsValidStep;
		},

		validateDeclaration: function () {
			var bIsValidStep = true,
				sName = this.getView().byId("idName").getValue(),
				sPhone = this.getView().byId("idPhone").getValue(),
				bConfirmation = this.getView().byId("idConfirmation").getSelected();

			if (sName === "") {
				this.getView().byId("idName").focus();
				this.getView().byId("idName").setValueState("Error");
				this.getView().byId("idName").setValueStateText(this.ResourceBundle.getText("Validation.MandatoryErr"));
				bIsValidStep = false;
			} else {
				this.getView().byId("idName").setValueState("None");
				this.getView().byId("idName").setValueStateText(" ");
			}

			if (sPhone === "") {
				this.getView().byId("idPhone").setValueState("None");
				// this.getView().byId("idPhone").setValueStateText(this.ResourceBundle.getText("Validation.MandatoryErr"));
				bIsValidStep = false;
			} else {
				this.validateContactNumber();
				var bIsValidMobNo = this.validateContactNumber();
				if (!bIsValidMobNo) {
					bIsValidStep = false;
				} else {
					bIsValidStep = true;
				}
				// (!this.validateContactNumber()) ? bIsValidStep = false : bIsValidStep = true;
			}
			if (bConfirmation === false) {
				this.getView().byId("idConfirmation").focus();
				this.getView().byId("idConfirmation").setValueState("Error");
				bIsValidStep = false;
			} else {
				this.getView().byId("idConfirmation").setValueState("None");
			}
			var mailregex =
				/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
			var sEmail = this.getView().byId("idemail").getValue();
			if (sEmail === "") {
				this.getView().byId("idemail").setValueState("Error");
				this.getView().byId("idPhone").setValueStateText(this.ResourceBundle.getText("Validation.MandatoryErr"));
			} else {
				this.getView().byId("idemail").setValueState("None");
				if (!mailregex.test(sEmail)) {
					this.getView().byId("idemail").setValueState("Error");
					this.getView().byId("idemail").setValueStateText(this.ResourceBundle.getText("INVAILD_EMAIL"));
					// this.getView().byId("idemail").focus();
					bIsValidStep = false;
				}
			}

			// if ($(".sapMInputBaseContentWrapperError")) {
			// 	$(".sapMInputBaseContentWrapperError").first().children().focus();
			// }
			return bIsValidStep;
		},
		onReviewBack: function () {
			this._navBackToStep(0);
			this.getView().getModel("idaformModel").setProperty("/isFormWizardMode", true);
			this.getView().getModel("idaformModel").setProperty("/bIsNextButton", true);
			this.getView().getModel("idaformModel").setProperty("/bIsSubmitButton", false);
		},
		navBackToIdentification: function () {
			this._navBackToStep(0);
			this.getView().getModel("idaformModel").setProperty("/isFormWizardMode", true);
			this.getView().getModel("idaformModel").setProperty("/bIsNextButton", true);
			this.getView().getModel("idaformModel").setProperty("/bIsSubmitButton", false);
		},
		navBackToDetails: function () {
			this._navBackToStep(1);
			this.getView().getModel("idaformModel").setProperty("/isFormWizardMode", true);
			this.getView().getModel("idaformModel").setProperty("/bIsNextButton", true);
			this.getView().getModel("idaformModel").setProperty("/bIsSubmitButton", false);
		},
		navBackToDeclaration: function () {
			this._navBackToStep(3);
			this.getView().getModel("idaformModel").setProperty("/isFormWizardMode", true);
			this.getView().getModel("idaformModel").setProperty("/bIsNextButton", true);
			this.getView().getModel("idaformModel").setProperty("/bIsSubmitButton", false);
		},
		handleWizardExit: function () {
			this.getOwnerComponent().openErrorDialog(this.ResourceBundle.getText("idaform.DiscardMsg"));
		},
		onConfirmInformation: function () {
			var bConfirmation = this.getView().byId("idConfirmation").getSelected();
			if (bConfirmation === false) {
				this.getView().byId("idConfirmation").focus();
				this.getView().byId("idConfirmation").setValueState("Error");
			} else {
				this.getView().byId("idConfirmation").setValueState("None");
			}
		},
		validateSubmitEnquiryEmail: function (oEvent) {
			if (!oEvent.getSource().getValue()) {
				oEvent.getSource().setValueState("Error");
				oEvent.getSource().setValueStateText(this.getResourceBundle().getText("MANDATORY_MISSING"));
			} else {
				oEvent.getSource().setValueState("None");
				oEvent.getSource().setValueStateText("");
			}
			if (oEvent.getSource().getValue().length >= 0) {
				oValidations.validateEmail(oEvent, this.ResourceBundle);
			} else {
				oEvent.getSource().setValueState("None");
			}
		},
		validateContactNumber: function () {
			var phoneRegex = /^[0-9\s]*$/;
			var phoneInput = this.getView().byId("idPhone");
			var phoneNum = phoneInput.getValue();
			if (!phoneNum) {
				phoneInput.setValueState("Error");
				phoneInput.focus();
				return false;
			} else {
				if (!phoneRegex.test(phoneNum)) {
					phoneInput.setValueState("Error");
					phoneInput.setValueStateText(this.ResourceBundle.getText("INVALID_PHONE"));
					phoneInput.focus();
					return false;
				} else {
					phoneInput.setValueState("None");
					phoneInput.setValueStateText("");
					return true;
				}
			}
		},
		onvalidateDOB: function (oEvent) {
			var oInput = oEvent.getSource();
			var sId = oInput.sId;
			var d = oInput.getDateValue();
			if (!(d instanceof Date && !isNaN(d) && this._isDOBValueByIdValid(sId))) {
				oInput.setValueState("Error");
				oInput.setValueStateText(this.ResourceBundle.getText("ENTER_VALID_DATE"));
				oInput.focus();
				return;
			}
			var oDate = this.getView().byId("idDateOfBirth")._getSelectedDate();
			var bDay = oDate.getDay();
			var bMonth = oDate.getMonth();
			var bYear = oDate.getFullYear();
			var age = 13;
			var setDate = new Date(bYear + age, bMonth - 1, bDay);
			var currDate = new Date();
			if (currDate <= setDate) {
				this.getView().byId("idDateOfBirth").focus();
				oInput.setValueState("Error");
				oInput.setValueStateText(this.ResourceBundle.getText("dateOfBirthValidation"));
				return;
			}
			oEvent.getSource().setValueState("None");
		},
		_isDOBValueByIdValid: function (sId) {
			var oInput = this.getView().byId(sId);
			oInput = oInput ? oInput : sap.ui.getCore().byId(sId);
			var d = oInput.getValue();
			var oDateValue = new Date(d);
			if (!(oDateValue instanceof Date && !isNaN(oDateValue))) {
				oInput.focus();
				return false;
			}
			return true;
		},

		onvalidateDate: function (oEvent) {
			var oInput = oEvent.getSource();
			var sId = oInput.sId;
			var d = oInput.getDateValue();
			if (!(d instanceof Date && !isNaN(d) && this._isDateValueByIdValid(sId))) {
				oInput.setValueState("Error");
				oInput.setValueStateText(this.ResourceBundle.getText("ENTER_VALID_DATE"));
				oInput.focus();
				return;
			}
			oEvent.getSource().setValueState("None");
		},
		_isDateValueByIdValid: function (sId) {
			var oInput = this.getView().byId(sId);
			oInput = oInput ? oInput : sap.ui.getCore().byId(sId);
			var d = oInput.getValue();
			var oDateValue = new Date(d);
			if (!(oDateValue instanceof Date && !isNaN(oDateValue))) {
				oInput.focus();
				return false;
			}
			return true;
		},

		onValidateCombobox: function (oEvent) {
			var data = oEvent.getSource();
			if (data._getSelectedItemText().length === 0) {
				data.focus();
				data.setValueState("Error");
				data.setValueStateText(this.ResourceBundle.getText("Validation.MandatoryErr"));
			} else {
				data.setValueState("None");
			}

		},
		onchangeInput: function (oEvent) {
			var data = oEvent.getSource();
			if (data.getValue() === "") {
				data.focus();
				data.setValueState("Error");
				data.setValueStateText(this.ResourceBundle.getText("Validation.MandatoryErr"));
			} else {
				data.setValueState("None");
			}
		},
		onSubmit: function () {
			var oPayload = dataModels._createSubmitPayload(this);

			var dataModel = this.getOwnerComponent().getModel("GlobalDataModel");
			this.getView().byId("idIDAformPage").setBusy(true);

			dataModel.update("/FormBundles('')", oPayload, {
				success: function (data) {
					this.getView().byId("idIDAformPage").setBusy(false);
					this.getOwnerComponent().openSuccessDialog(this.ResourceBundle.getText("idaform.SuccessMsg"));
				}.bind(this),
				error: function (oError) {
					this.setError(oError);
					this.getView().byId("idIDAformPage").setBusy(false);
				}.bind(this)
			});
		},

		_getTransferorDetails: function () {
			var dataModel = this.getOwnerComponent().getModel("DutysDataModel");
			this.getView().byId("idIDAformPage").setBusy(true);
			// var sTransferorId = "1000500071378RZET";
			var sTransferorId = this.getView().byId("idTranferorID").getValue();
			var oFilter = new Filter("TransferorId", "EQ", sTransferorId);
			dataModel.read("/TransferorDetailSet", {
				// async: true,
				filters: [oFilter],
				// return new Promise((resolve, reject) => {
				// 		 resolve($.proxy(this._onODatacallSucccess, this)),
				// 		 reject( $.proxy(this._onODatacallFailure, this))
				// 	})
				success: $.proxy(this._onODatacallSucccess, this),

				error: $.proxy(this._onODatacallFailure, this)
			});
		},
		_onODatacallSucccess: function (data) {
			var idaModel = this.getOwnerComponent().getModel("idaformModel");
			this.getOwnerComponent().getModel("idaformModel").setProperty("/TransferorDetails", data.results);
			this.getView().byId("idIDAformPage").setBusy(false);
			idaModel.setProperty("/idaModel/Details/transferorName", data.results[0].Name);
			idaModel.setProperty("/idaModel/Details/uniqueTransferorCode", data.results[0].TransferorId);
			idaModel.setProperty("/idaModel/Details/FormBundleID", data.results[0].FormbundleNum);
			idaModel.setProperty("/TransferorType", data.results[0].Type);
			idaModel.setProperty("/bIsValidStep", true);

			var sTransferorType = this.getView().getModel("idaformModel").getProperty("/TransferorType");
			if (Number(sTransferorType) === 0) {
				this.getView().byId("idTranferorID").focus();
				this.getView().byId("idTranferorID").setValueState("Error");
				this.getView().byId("idTranferorID").setValueStateText(this.ResourceBundle.getText("Invalid.TransferorID"));
				idaModel.setProperty("/bIsValidStep", false);
			}
			if (idaModel.getProperty("/bIsValidStep")) {
				this._getFormBundles();
				// this.validateIdentificationStep();
			}
		},

		_onODatacallFailure: function (oError) {
			this.getView().byId("idIDAformPage").setBusy(false);
			this.setError(oError);
		},

		_getFormBundles: function () {
			var FormBundleID = this.getOwnerComponent().getModel("idaformModel").getProperty("/TransferorDetails/0/FormbundleNum");
			var dataModel = this.getOwnerComponent().getModel("DutysDataModel");
			// var FormBundleID = "500071345";
			dataModel.read("/FormBundles(FormBundleID='" + FormBundleID + "')", {
				urlParameters: {
					"$expand": "ToTdIdentification,ToTdDocument,ToTdDocTransferee,ToTdDocTransferor,ToTdDocBeneficiaries,ToTdDocInformation,ToTdDocLot,ToTdDocTenure,ToTdDocTrustee,ToTdDocVehicle,ToTdDocTrusteeOr,ToTdTransaction,ToTdLiabilities,ToTdLiabilitiesUti,ToTdIdaTransferor,ToTdIdaTrustee"
						// "$expand": "ToDutyRegContact,ToDutyRegDeclaration,ToDutyRegIdPartnership,ToDutyRegIdTrustee,ToDutyRegIdentification,ToIdIdentification,ToIdReturnDet,ToInsuranceDutyRegBusiness,ToTdDocBeneficiaries,ToTdDocInformation,ToTdDocLot,ToTdDocTenure,ToTdDocTransferee,ToTdDocTransferor,ToTdDocTrustee,ToTdDocTrusteeOr,ToTdDocVehicle,ToTdDocument,ToTdIdaTransferor,ToTdIdaTrustee,ToTdIdentification,ToTdLiabilities,ToTdLiabilitiesUti,ToTdTransaction,ToTeReturn,ToTranferDutyRegBusiness"
				},
				success: function (oData) {
					this.getOwnerComponent().getModel("idaformModel").setProperty("/duty", oData);
					this.getView().byId("idIDAformPage").setBusy(false);
				}.bind(this),
				error: function (oError) {
					this.setError(oError);
					this.getView().byId("idIDAformPage").setBusy(false);
				}.bind(this)
			});
		}

	});

});