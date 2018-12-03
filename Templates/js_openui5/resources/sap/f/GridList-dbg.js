/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2018 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define([
	"sap/m/ListBase",
	"sap/ui/base/ManagedObjectObserver",
	"sap/ui/layout/cssgrid/GridLayoutDelegate",
	"sap/ui/layout/cssgrid/GridItemLayoutData",
	"./GridListRenderer"
], function(
	ListBase,
	ManagedObjectObserver,
	GridLayoutDelegate,
	GridItemLayoutData,
	GridListRenderer
) {
	"use strict";

/**
 * Constructor for a new GridList.
 *
 * @param {string} [sId] ID for the new control, generated automatically if no ID is given
 * @param {object} [mSettings] Initial settings for the new control
 *
 * @class
 * Disclaimer: this control is in beta state - incompatible API changes may be done before its official public release. Use at your own discretion.
 *
 * @author SAP SE
 * @version 1.60.1
 *
 * @extends sap.m.ListBase
 *
 * @constructor
 * @private
 * @since 1.60
 * @alias sap.f.GridList
 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
 */
var GridList = ListBase.extend("sap.f.GridList", { metadata : {
	library: "sap.f",
	interfaces: ["sap.ui.layout.cssgrid.IGridConfigurable"],
	aggregations: {

		/**
		 * Defines a custom grid layout
		 */
		customLayout: { type: "sap.ui.layout.cssgrid.GridLayoutBase", multiple: false }
	}
}});

GridList.prototype.init = function () {
	ListBase.prototype.init.apply(this, arguments);

	this._oItemDelegate = {
		onAfterRendering: this._onAfterItemRendering
	};

	this._addGridLayoutDelegate();

	this._oGridObserver = new ManagedObjectObserver(GridList.prototype._onGridChange.bind(this));
	this._oGridObserver.observe(this, { aggregations: ["items"] });
};

GridList.prototype.exit = function () {
	this._removeGridLayoutDelegate();

	if (this._oGridObserver) {
		this._oGridObserver.disconnect();
		this._oGridObserver = null;
	}

	ListBase.prototype.exit.apply(this, arguments);
};

// Implement IGridConfigurable interface
GridList.prototype.getGridDomRefs = function () {
	return [this.getItemsContainerDomRef()];
};

// Implement IGridConfigurable interface
GridList.prototype.getGridLayoutConfiguration = GridList.prototype.getCustomLayout;

/**
 * Adds the GridLayoutDelegate
 *
 * @private
 */
GridList.prototype._addGridLayoutDelegate = function () {
	if (!this.oGridLayoutDelegate) {
		this.oGridLayoutDelegate = new GridLayoutDelegate();
		this.addEventDelegate(this.oGridLayoutDelegate, this);
	}
};

/**
 * Destroys the GridLayoutDelegate
 *
 * @private
 */
GridList.prototype._removeGridLayoutDelegate = function () {
	if (this.oGridLayoutDelegate) {
		this.removeEventDelegate(this.oGridLayoutDelegate);
		this.oGridLayoutDelegate.destroy();
		this.oGridLayoutDelegate = null;
	}
};

GridList.prototype._onGridChange = function (oChanges) {
	if (oChanges.name !== "items" || !oChanges.child) { return; }

	if (oChanges.mutation === "insert") {
		oChanges.child.addEventDelegate(this._oItemDelegate, oChanges.child);
	} else if (oChanges.mutation === "remove") {
		oChanges.child.removeEventDelegate(this._oItemDelegate, oChanges.child);
	}
};

/**
 * Item's onAfterRendering handler
 *
 * @private
 */
GridList.prototype._onAfterItemRendering = function () {
	GridItemLayoutData._setItemStyles(this);
};

/**
 * Handler for layout data change events.
 * Update the styles of the item which layoutData changed
 *
 * @private
 * @param {jQuery.Event} oEvent The event from a layoutDataChange
 */
GridList.prototype.onLayoutDataChange = function (oEvent) {
	GridItemLayoutData._setItemStyles(oEvent.srcControl);
};

return GridList;

});