/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2018 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/core/mvc/View","sap/ui/core/Component"],function(V,C){"use strict";return{_getObjectWithGlobalId:function(o,t,n){var a=this,p,N,i,w=[];function c(){switch(t){case"View":o.viewName=o.name;delete o.name;if(n){return sap.ui.view(o);}else{return V.create(o);}break;case"Component":return C.create(o);default:}}function b(O){if(a._oCache){w.forEach(function(I){i[I]=O;});a.fireCreated({object:O,type:t,options:o});}return O;}if(o.async===undefined){o.async=true;}N=o.name;this._checkName(N,t);i=this._oCache[t.toLowerCase()][N];p=i&&i[o.id];if(p){return p;}if(this._oComponent){p=this._oComponent.runAsOwner(c);}else{p=c();}if(p instanceof Promise){p=p.then(b);}else{p.loaded().then(b);}if(!i){i=this._oCache[t.toLowerCase()][N]={};i[undefined]=p;w.push(undefined);}if(o.id!==undefined){i[o.id]=p;w.push(o.id);}return p;},_getViewWithGlobalId:function(o){if(o&&!o.name){o.name=o.viewName;}return this._getObjectWithGlobalId(o,"View",true);},_getComponentWithGlobalId:function(o){return this._getObjectWithGlobalId(o,"Component");}};});