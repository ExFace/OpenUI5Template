/*!
 * OpenUI5
 * (c) Copyright 2009-2019 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/base/ManagedObject","sap/ui/core/Fragment","sap/ui/core/ValueState","sap/ui/model/json/JSONModel","sap/ui/rta/plugin/iframe/controller/SettingsDialogController"],function(M,F,V,J,S){"use strict";var _=sap.ui.getCore().getLibraryResourceBundle("sap.ui.rta");var a={dialogTitle:_.getText("IFRAME_SETTINGS_DIALOG_TITLE"),sectionTitle:_.getText("IFRAME_SETTINGS_DIALOG_SECTION_TITLE"),newSectionLabel:_.getText("IFRAME_SETTINGS_DIALOG_NEW_SECTION_LABEL"),nameLabel:_.getText("IFRAME_SETTINGS_DIALOG_NAME_LABEL"),sizeTitle:_.getText("IFRAME_SETTINGS_DIALOG_SIZE_TITLE"),widthLabel:_.getText("IFRAME_SETTINGS_DIALOG_WIDTH_LABEL"),heigthLabel:_.getText("IFRAME_SETTINGS_DIALOG_HEIGTH_LABEL"),sizeWarning:_.getText("IFRAME_SETTINGS_DIALOG_SIZE_WARNING"),urlTitle:_.getText("IFRAME_SETTINGS_DIALOG_URL_TITLE"),OKText:_.getText("BTN_FREP_OK"),cancelText:_.getText("BTN_FREP_CANCEL")};function b(){return new J({text:a,asNewSection:{selected:false},sectionName:{value:"",valueState:V.None},frameWidth:{value:"",valueState:V.None},frameWidthUnit:{selectedKey:""},frameHeigth:{value:"",valueState:V.None},frameHeigthUnit:{selectedKey:""},frameUrl:{value:"",valueState:V.None}});}function c(){this._oJSONModel=b();F.load({name:"sap.ui.rta.view.SettingsDialog",controller:new S(this._oJSONModel)}).then(function(s){this._oDialog=s;this._oDialog.setModel(this._oJSONModel);d.call(this);}.bind(this));}function d(){this._oDialog.attachAfterOpen(function(){this.fireOpened();}.bind(this));this._oDialog.open();}var e=M.extend("sap.ui.rta.plugin.iframe.SettingsDialog",{metadata:{library:"sap.ui.rta",events:{opened:{}}}});e.prototype.exit=function(){this._oDialog.destroy();};e.prototype.open=function(){return new Promise(function(r,f){this._fnResolve=r;this._fnReject=f;if(!this._oDialog){c.call(this);}else{d.call(this);}}.bind(this));};return e;},false);