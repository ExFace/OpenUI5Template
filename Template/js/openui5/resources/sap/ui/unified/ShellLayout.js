/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2017 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global','sap/ui/Device','sap/ui/core/Control','sap/ui/core/Popup','sap/ui/core/theming/Parameters','./SplitContainer','./library','jquery.sap.dom','jquery.sap.script'],function(q,D,C,P,a,S,l){"use strict";var b=C.extend("sap.ui.unified.ShellLayout",{metadata:{library:"sap.ui.unified",properties:{showPane:{type:"boolean",group:"Appearance",defaultValue:false},headerHiding:{type:"boolean",group:"Appearance",defaultValue:false},headerVisible:{type:"boolean",group:"Appearance",defaultValue:true}},defaultAggregation:"content",aggregations:{content:{type:"sap.ui.core.Control",multiple:true,singularName:"content"},paneContent:{type:"sap.ui.core.Control",multiple:true,singularName:"paneContent"},header:{type:"sap.ui.core.Control",multiple:false},canvasSplitContainer:{type:"sap.ui.unified.SplitContainer",multiple:false,visibility:"hidden"},curtainSplitContainer:{type:"sap.ui.unified.SplitContainer",multiple:false,visibility:"hidden"}}}});b._SIDEPANE_WIDTH_PHONE=208;b._SIDEPANE_WIDTH_TABLET=208;b._SIDEPANE_WIDTH_DESKTOP=240;b._HEADER_ALWAYS_VISIBLE=true;b._HEADER_AUTO_CLOSE=true;b._HEADER_TOUCH_TRESHOLD=15;if(D.browser.chrome&&D.browser.version<36){b._HEADER_TOUCH_TRESHOLD=10;}b.prototype.init=function(){this._rtl=sap.ui.getCore().getConfiguration().getRTL();this._animation=sap.ui.getCore().getConfiguration().getAnimation();this._showHeader=true;this._showCurtain=false;this._iHeaderHidingDelay=3000;this._useStrongBG=false;this._cont=new S(this.getId()+"-container");this._cont._bRootContent=true;if(sap.ui.getCore().getConfiguration().getAccessibility()){var t=this;this._cont.addEventDelegate({onAfterRendering:function(){t._cont.$("canvas").attr("role","main");t._cont.$("pane").attr("role","complementary");}});}this.setAggregation("canvasSplitContainer",this._cont,true);this._curtCont=new S(this.getId()+"-curt-container");this._curtCont._bRootContent=true;this.setAggregation("curtainSplitContainer",this._curtCont,true);this._setSidePaneWidth();D.media.attachHandler(this._handleMediaChange,this,D.media.RANGESETS.SAP_STANDARD);D.resize.attachHandler(this._handleResizeChange,this);};b.prototype.exit=function(){D.media.detachHandler(this._handleMediaChange,this,D.media.RANGESETS.SAP_STANDARD);D.resize.detachHandler(this._handleResizeChange,this);delete this._cont;delete this._curtCont;};b.prototype.onAfterRendering=function(){var t=this;function h(B){var e=q.event.fix(B);if(q.sap.containsOrEquals(t.getDomRef("hdr"),e.target)){t._timedHideHeader(e.type==="focus");}}if(window.addEventListener&&!b._HEADER_ALWAYS_VISIBLE){var H=this.getDomRef("hdr");H.addEventListener("focus",h,true);H.addEventListener("blur",h,true);}this._refreshAfterRendering();};b.prototype.onThemeChanged=function(){this._refreshAfterRendering();};b.prototype.onfocusin=function(e){var i=this.getId();if(e.target.id===i+"-curt-focusDummyOut"){q.sap.focus(this.$("hdrcntnt").firstFocusableDomRef());}else if(e.target.id===i+"-main-focusDummyOut"){q.sap.focus(this.$("curtcntnt").firstFocusableDomRef());}};(function(){function _(s){if(s._startY===undefined||s._currY===undefined){return;}var y=s._currY-s._startY;if(Math.abs(y)>b._HEADER_TOUCH_TRESHOLD){s._doShowHeader(y>0);s._startY=s._currY;}}if(D.support.touch){b._HEADER_ALWAYS_VISIBLE=false;b.prototype.ontouchstart=function(e){this._startY=e.touches[0].pageY;if(this._startY>2*48){this._startY=undefined;}this._currY=this._startY;};b.prototype.ontouchend=function(e){_(this);this._startY=undefined;this._currY=undefined;};b.prototype.ontouchcancel=b.prototype.ontouchend;b.prototype.ontouchmove=function(e){this._currY=e.touches[0].pageY;_(this);};}})();b.prototype.setHeaderHiding=function(e){e=!!e;return this._mod(function(r){return this.setProperty("headerHiding",e,r);},function(){this._doShowHeader(!e?true:this._showHeader);});};b.prototype.setHeaderHidingDelay=function(d){this._iHeaderHidingDelay=d;return this;};b.prototype.getHeaderHidingDelay=function(){return this._iHeaderHidingDelay;};b.prototype.getShowPane=function(){return this._cont.getShowSecondaryContent();};b.prototype.setShowPane=function(s){this._cont.setShowSecondaryContent(s);this.setProperty("showPane",!!s,true);return this;};b.prototype.setShowCurtainPane=function(s){this._curtCont.setShowSecondaryContent(s);return this;};b.prototype.getShowCurtainPane=function(){return this._curtCont.getShowSecondaryContent();};b.prototype.setHeaderVisible=function(h){h=!!h;this.setProperty("headerVisible",h,true);this.$().toggleClass("sapUiUfdShellNoHead",!h);return this;};b.prototype.setShowCurtain=function(s){s=!!s;return this._mod(function(r){this._showCurtain=s;return this;},function(){this.$("main-focusDummyOut").attr("tabindex",s?0:-1);this.$().toggleClass("sapUiUfdShellCurtainHidden",!s).toggleClass("sapUiUfdShellCurtainVisible",s);if(s){var z=P.getNextZIndex();this.$("curt").css("z-index",z+1);this.$("hdr").css("z-index",z+3);this.$("brand").css("z-index",z+7);this.$().toggleClass("sapUiUfdShellCurtainClosed",false);}this._timedCurtainClosed(s);this._doShowHeader(true);});};b.prototype.getShowCurtain=function(){return this._showCurtain;};b.prototype.getContent=function(){return this._cont.getContent();};b.prototype.insertContent=function(c,i){this._cont.insertContent(c,i);return this;};b.prototype.addContent=function(c){this._cont.addContent(c);return this;};b.prototype.removeContent=function(i){return this._cont.removeContent(i);};b.prototype.removeAllContent=function(){return this._cont.removeAllContent();};b.prototype.destroyContent=function(){this._cont.destroyContent();return this;};b.prototype.indexOfContent=function(c){return this._cont.indexOfContent(c);};b.prototype.getPaneContent=function(){return this._cont.getSecondaryContent();};b.prototype.insertPaneContent=function(c,i){this._cont.insertSecondaryContent(c,i);return this;};b.prototype.addPaneContent=function(c){this._cont.addSecondaryContent(c);return this;};b.prototype.removePaneContent=function(i){return this._cont.removeSecondaryContent(i);};b.prototype.removeAllPaneContent=function(){return this._cont.removeAllSecondaryContent();};b.prototype.destroyPaneContent=function(){this._cont.destroySecondaryContent();return this;};b.prototype.indexOfPaneContent=function(c){return this._cont.indexOfSecondaryContent(c);};b.prototype.setHeader=function(h){this.setAggregation("header",h,true);h=this.getHeader();if(this.getDomRef()){if(!h){this.$("hdrcntnt").html("");}else{var r=sap.ui.getCore().createRenderManager();r.renderControl(h);r.flush(this.getDomRef("hdrcntnt"));r.destroy();}}return this;};b.prototype.destroyHeader=function(){this.destroyAggregation("header",true);this.$("hdrcntnt").html("");return this;};b.prototype.getCurtainContent=function(){return this._curtCont.getContent();};b.prototype.insertCurtainContent=function(c,i){this._curtCont.insertContent(c,i);return this;};b.prototype.addCurtainContent=function(c){this._curtCont.addContent(c);return this;};b.prototype.removeCurtainContent=function(i){return this._curtCont.removeContent(i);};b.prototype.removeAllCurtainContent=function(){return this._curtCont.removeAllContent();};b.prototype.destroyCurtainContent=function(){this._curtCont.destroyContent();return this;};b.prototype.indexOfCurtainContent=function(c){return this._curtCont.indexOfCurtainContent(c);};b.prototype.getCurtainPaneContent=function(){return this._curtCont.getSecondaryContent();};b.prototype.insertCurtainPaneContent=function(c,i){this._curtCont.insertSecondaryContent(c,i);return this;};b.prototype.addCurtainPaneContent=function(c){this._curtCont.addSecondaryContent(c);return this;};b.prototype.removeCurtainPaneContent=function(i){return this._curtCont.removeSecondaryContent(i);};b.prototype.removeAllCurtainPaneContent=function(){return this._curtCont.removeAllSecondaryContent();};b.prototype.destroyCurtainPaneContent=function(){this._curtCont.destroySecondaryContent();return this;};b.prototype.indexOfCurtainPaneContent=function(c){return this._curtCont.indexOfSecondaryContent(c);};b.prototype._setStrongBackground=function(u){this._useStrongBG=!!u;this.$("strgbg").toggleClass("sapUiStrongBackgroundColor",this._useStrongBG);};b.prototype._mod=function(m,d){var r=!!this.getDomRef();var c=m.apply(this,[r]);if(r&&d){if(d instanceof sap.ui.unified._ContentRenderer){d.render();}else{d.apply(this);}}return c;};b.prototype._doShowHeader=function(s){var w=this._showHeader;this._showHeader=this._isHeaderHidingActive()?!!s:true;this.$().toggleClass("sapUiUfdShellHeadHidden",!this._showHeader).toggleClass("sapUiUfdShellHeadVisible",this._showHeader);if(this._showHeader){this._timedHideHeader();}if(w!=this._showHeader&&this._isHeaderHidingActive()){q.sap.delayedCall(500,this,function(){try{var r=document.createEvent("UIEvents");r.initUIEvent("resize",true,false,window,0);window.dispatchEvent(r);}catch(e){q.sap.log.error(e);}});}};b.prototype._timedHideHeader=function(c){if(this._headerHidingTimer){q.sap.clearDelayedCall(this._headerHidingTimer);this._headerHidingTimer=null;}if(c||!b._HEADER_AUTO_CLOSE||!this._isHeaderHidingActive()||this._iHeaderHidingDelay<=0){return;}this._headerHidingTimer=q.sap.delayedCall(this._iHeaderHidingDelay,this,function(){if(this._isHeaderHidingActive()&&this._iHeaderHidingDelay>0&&!q.sap.containsOrEquals(this.getDomRef("hdr"),document.activeElement)){this._doShowHeader(false);}});};b.prototype._timedCurtainClosed=function(c){if(this._curtainClosedTimer){q.sap.clearDelayedCall(this._curtainClosedTimer);this._curtainClosedTimer=null;}if(c){return;}var d=parseInt(a.get("_sap_ui_unified_ShellLayout_AnimDuration"),10);if(!this._animation||(D.browser.internet_explorer&&D.browser.version<10)){d=0;}this._curtainClosedTimer=q.sap.delayedCall(d,this,function(){this._curtainClosedTimer=null;this.$("curt").css("z-index","");this.$("hdr").css("z-index","");this.$("brand").css("z-index","");this.$().toggleClass("sapUiUfdShellCurtainClosed",true);});};b.prototype._isHeaderHidingActive=function(){if(b._HEADER_ALWAYS_VISIBLE||this.getShowCurtain()||!this.getHeaderHiding()||sap.ui.unified._iNumberOfOpenedShellOverlays>0||!this.getHeaderVisible()){return false;}return true;};b.prototype._refreshCSSWorkaround=function(){if(!D.browser.webkit||!D.support.touch){return;}if(this._cssWorkaroundTimer){q.sap.clearDelayedCall(this._cssWorkaroundTimer);this._cssWorkaroundTimer=null;}this.$("css").remove();this._cssWorkaroundTimer=q.sap.delayedCall(10,this,function(){this._cssWorkaroundTimer=null;q.sap.log.debug("sap.ui.unified.ShellLayout: CSS Workaround applied.");q("head").append("<link type='text/css' rel='stylesheet' id='"+this.getId()+"-css' href='data:text/css;base64,LnNhcFVpVWZkU2hlbGxDaHJvbWVSZXBhaW50e291dGxpbmUtY29sb3I6aW5pdGlhbDt9'/>");this._cssWorkaroundTimer=q.sap.delayedCall(100,this,function(){this.$("css").remove();});});};b.prototype._setSidePaneWidth=function(r){if(!r){r=D.media.getCurrentRange(D.media.RANGESETS.SAP_STANDARD).name;}var w=b["_SIDEPANE_WIDTH_"+r.toUpperCase()]+"px";this._cont.setSecondaryContentSize(w);this._curtCont.setSecondaryContentSize(w);};b.prototype._handleMediaChange=function(p){if(!this.getDomRef()){return false;}this._setSidePaneWidth(p.name);};b.prototype._handleResizeChange=function(p){};b.prototype._refreshAfterRendering=function(){var d=this.getDomRef();if(!d){return false;}this._repaint(d);this._timedHideHeader();return true;};b.prototype._repaint=function(d){if(D.browser.webkit){var c=d.style.display;d.style.display="none";d.offsetHeight;d.style.display=c;this._refreshCSSWorkaround();}};b.prototype._getSearchWidth=function(){return-1;};return b;},true);
