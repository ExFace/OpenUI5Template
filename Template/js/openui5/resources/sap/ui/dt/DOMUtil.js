/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2017 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global'],function(q){"use strict";var D={};D.getSize=function(d){var c=d.getBoundingClientRect();return{width:c.width,height:c.height};};D.getOffsetFromParent=function(p,P,s,a){var o={left:p.left,top:p.top};if(P){o.left-=(P.left-(a?a:0));o.top-=(P.top-(s?s:0));}return o;};D.getZIndex=function(d){var z;var e=q(d);if(e.length){z=e.zIndex()||e.css("z-index");}return z;};D.hasVerticalScrollBar=function(d){var $=q(d);var o=$.css("overflow-y")==="auto"||$.css("overflow-y")==="scroll";return o&&$.get(0).scrollHeight>$.height();};D.hasHorizontalScrollBar=function(d){var $=q(d);var o=$.css("overflow-x")==="auto"||$.css("overflow-x")==="scroll";return o&&$.get(0).scrollWidth>$.width();};D.hasScrollBar=function(d){return D.hasVerticalScrollBar(d)||D.hasHorizontalScrollBar(d);};D.getScrollbarWidth=function(){if(typeof D.getScrollbarWidth._cache==='undefined'){var o=q('<div/>').css({position:'absolute',top:'-9999px',left:'-9999px',width:'100px'}).appendTo('body');var w=o.width();o.css('overflow','scroll');var i=q('<div/>').css('width','100%').appendTo(o);var W=i.width();o.remove();D.getScrollbarWidth._cache=w-W;}return D.getScrollbarWidth._cache;};D.getOverflows=function(d){var o;var e=q(d);if(e.length){o={};o.overflowX=e.css("overflow-x");o.overflowY=e.css("overflow-y");}return o;};D.getGeometry=function(d,u){if(d){var o=q(d).offset();if(u){o.left=o.left-q(window).scrollLeft();o.top=o.top-q(window).scrollTop();}return{domRef:d,size:this.getSize(d),position:o,visible:this.isVisible(d)};}};D.syncScroll=function(s,t){var $=q(t);var T=$.scrollTop();var o=$.scrollLeft();var a=q(s);var S=a.scrollTop();var b=a.scrollLeft();if(S!==T){$.scrollTop(S);}if(b!==o){$.scrollLeft(b);}};D.getDomRefForCSSSelector=function(d,c){if(c&&d){var $=q(d);if(c===":sap-domref"){return $;}if(c.indexOf(":sap-domref")>-1){return $.find(c.replace(/:sap-domref/g,""));}return $.find(c);}else{return q();}};D.isVisible=function(d){return d?d.offsetWidth>0||d.offsetHeight>0:false;};D.getEscapedString=function(s){return s.replace(/([;&,\.\+\*\~':"\!\^#$%@\[\]\(\)=>\|])/g,'\\$1');};D.setDraggable=function(e,v){e=q(e);e.attr("draggable",v);};D._copyStylesTo=function(s,d){var S="";var a="";var l=s.length;for(var i=0;i<l;i++){a=s[i];S=S+a+":"+s.getPropertyValue(a)+";";}d.style.cssText=S;};D._copyPseudoElement=function(p,s,d){var S=window.getComputedStyle(s,p);var c=S.getPropertyValue("content");if(c&&c!=="none"){c=q.trim(c);if(c.indexOf("attr(")===0){c=c.replace("attr(","");if(c.length){c=c.substring(0,c.length-1);}c=s.getAttribute(c);}if(c===null||c===undefined){c="";}var a=q("<span></span>");if(p===":after"){a.appendTo(d);}else{a.prependTo(d);}a.text(c.replace(/\"/g,""));D._copyStylesTo(S,a.get(0));a.css("display","inline");}};D.copyComputedStyle=function(s,d){s=q(s).get(0);d=q(d).get(0);var S=window.getComputedStyle(s);if(S.getPropertyValue("display")=="none"){d.style.display="none";return;}D._copyStylesTo(S,d);this._copyPseudoElement(":after",s,d);this._copyPseudoElement(":before",s,d);};D.copyComputedStyles=function(s,d){s=q(s).get(0);d=q(d).get(0);for(var i=0;i<s.children.length;i++){this.copyComputedStyles(s.children[i],d.children[i]);}q(d).removeClass();q(d).attr("id","");q(d).attr("role","");q(d).attr("data-sap-ui","");q(d).attr("for","");q(d).attr("tabIndex",-1);this.copyComputedStyle(s,d);};D.cloneDOMAndStyles=function(n,t){n=q(n).get(0);var c=n.cloneNode(true);this.copyComputedStyles(n,c);q(t).append(c);};D.insertStyles=function(s){var S=document.createElement('style');S.type='text/css';if(S.styleSheet){S.styleSheet.cssText=s;}else{S.appendChild(document.createTextNode(s));}q('#overlay-container').prepend(S);};return D;},true);
