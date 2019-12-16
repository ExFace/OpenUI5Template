/*!
 * OpenUI5
 * (c) Copyright 2009-2019 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define([
	"sap/ui/base/ManagedObject",
	"sap/ui/core/Fragment",
	"sap/ui/core/ValueState",
	"sap/ui/model/json/JSONModel",
	"sap/ui/rta/plugin/iframe/controller/SettingsDialogController"
], function (
	ManagedObject,
	Fragment,
	ValueState,
	JSONModel,
	SettingsDialogController
) {
	"use strict";

	var _oTextResources = sap.ui.getCore().getLibraryResourceBundle("sap.ui.rta");
	var _mText = {
		dialogTitle: _oTextResources.getText("IFRAME_SETTINGS_DIALOG_TITLE"),
		sectionTitle: _oTextResources.getText("IFRAME_SETTINGS_DIALOG_SECTION_TITLE"),
		newSectionLabel: _oTextResources.getText("IFRAME_SETTINGS_DIALOG_NEW_SECTION_LABEL"),
		nameLabel: _oTextResources.getText("IFRAME_SETTINGS_DIALOG_NAME_LABEL"),
		sizeTitle: _oTextResources.getText("IFRAME_SETTINGS_DIALOG_SIZE_TITLE"),
		widthLabel: _oTextResources.getText("IFRAME_SETTINGS_DIALOG_WIDTH_LABEL"),
		heigthLabel: _oTextResources.getText("IFRAME_SETTINGS_DIALOG_HEIGTH_LABEL"),
		sizeWarning: _oTextResources.getText("IFRAME_SETTINGS_DIALOG_SIZE_WARNING"),
		urlTitle: _oTextResources.getText("IFRAME_SETTINGS_DIALOG_URL_TITLE"),
		OKText: _oTextResources.getText("BTN_FREP_OK"),
		cancelText: _oTextResources.getText("BTN_FREP_CANCEL")
	};

	function _createJSONModel() {
		return new JSONModel({
			text: _mText,
			asNewSection: {
				selected: false
			},
			sectionName: {
				value: "",
				valueState: ValueState.None
			},
			frameWidth: {
				value: "",
				valueState: ValueState.None
			},
			frameWidthUnit: {
				selectedKey: ""
			},
			frameHeigth: {
				value: "",
				valueState: ValueState.None
			},
			frameHeigthUnit: {
				selectedKey: ""
			},
			frameUrl: {
				value: "",
				valueState: ValueState.None
			}
		});
	}

	function _createDialog() {
		this._oJSONModel = _createJSONModel();
		Fragment.load({
			name: "sap.ui.rta.view.SettingsDialog",
			controller: new SettingsDialogController(this._oJSONModel)
		}).then(function (oSettingsDialog) {
			this._oDialog = oSettingsDialog;
			this._oDialog.setModel(this._oJSONModel);
			_openDialog.call(this);
		}.bind(this));
	}

	function _openDialog() {
		this._oDialog.attachAfterOpen(function () {
			this.fireOpened();
		}.bind(this));
		this._oDialog.open();
	}

	/**
	 * Constructor for a new sap.ui.rta.plugin.iframe.SettingsDialog control.
	 *
	 * @class Context - Dialog for iFrame settings in Runtime Authoring
	 * @extends sap.ui.base.ManagedObject
	 * @author SAP SE
	 * @version 1.73.1
	 * @constructor
	 * @private
	 * @since 1.72
	 * @alias sap.ui.rta.plugin.iframe.SettingsDialog
	 */
	var SettingsDialog = ManagedObject.extend("sap.ui.rta.plugin.iframe.SettingsDialog", {
		metadata: {
			library: "sap.ui.rta",
			events: {
				opened: {}
			}
		}
	});

	SettingsDialog.prototype.exit = function () {
		this._oDialog.destroy();
	};

	/**
	 * Open the Settings Dialog
	 *
	 * @returns {Promise} empty promise
	 * @public
	 */
	SettingsDialog.prototype.open = function () {
		return new Promise(function (resolve, reject) {
			this._fnResolve = resolve;
			this._fnReject = reject;
			if (!this._oDialog) {
				_createDialog.call(this);
			} else {
				_openDialog.call(this);
			}
		}.bind(this));
	};

	return SettingsDialog;
}, /* bExport= */ false);