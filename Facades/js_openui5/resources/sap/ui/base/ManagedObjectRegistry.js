/*!
 * OpenUI5
 * (c) Copyright 2009-2019 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/base/ManagedObject","sap/base/Log","sap/base/assert"],function(M,L,a){"use strict";function b(F,o){if(typeof F!=='function'||!(F.prototype instanceof M)){throw new TypeError("ManagedObjectRegistry mixin can only be applied to subclasses of sap.ui.base.ManagedObject");}o=o||{};var O=o.onDuplicate||function(s,c,n){var S=F.getMetadata().getStereotype();L.error("adding object \""+S+"\" with duplicate id '"+s+"'");throw new Error("Error: adding object \""+S+"\" with duplicate id '"+s+"'");};var f=o.onDeregister||null;var i=Object.create(null);var I=0;F.prototype.register=function register(){var s=this.getId(),c=i[s];if(c&&c!==this){O(s,c,this);I--;}i[s]=this;I++;};F.prototype.deregister=function deregister(){if(i[this.sId]){if(f){f(this.sId);}delete i[this.sId];I--;}};F["registry"]=Object.freeze({get size(){return I;},all:function(){var r=Object.create(null);return Object.assign(r,i);},get:function(c){a(c==null||typeof c==="string","id must be a string when defined");return c==null?undefined:i[c];},forEach:function(c,t){if(typeof c!=="function"){throw new TypeError(c+" is not a function");}if(t!=null){c=c.bind(t);}for(var d in i){c(i[d],d);}},filter:function(c,t){if(typeof c!=="function"){throw new TypeError(c+" is not a function");}if(t!=null){c=c.bind(t);}var r=[],d;for(d in i){if(c(i[d],d)){r.push(i[d]);}}return r;}});}return{apply:b};});