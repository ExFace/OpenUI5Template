/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2018 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['sap/base/util/equal'],function(e){"use strict";var a=function(o,n,c,u){c=c||function(v,V){return e(v,V);};var O=[];var N=[];var m=[];for(var i=0;i<n.length;i++){var b=n[i];var f=0;var t;if(u&&c(o[i],b)){f=1;t=i;}else{for(var j=0;j<o.length;j++){if(c(o[j],b)){f++;t=j;if(u||f>1){break;}}}}if(f==1){var M={oldIndex:t,newIndex:i};if(m[t]){delete O[t];delete N[m[t].newIndex];}else{N[i]={data:n[i],row:t};O[t]={data:o[t],row:i};m[t]=M;}}}for(var i=0;i<n.length-1;i++){if(N[i]&&!N[i+1]&&N[i].row+1<o.length&&!O[N[i].row+1]&&c(o[N[i].row+1],n[i+1])){N[i+1]={data:n[i+1],row:N[i].row+1};O[N[i].row+1]={data:O[N[i].row+1],row:i+1};}}for(var i=n.length-1;i>0;i--){if(N[i]&&!N[i-1]&&N[i].row>0&&!O[N[i].row-1]&&c(o[N[i].row-1],n[i-1])){N[i-1]={data:n[i-1],row:N[i].row-1};O[N[i].row-1]={data:O[N[i].row-1],row:i-1};}}var d=[];if(n.length==0){for(var i=0;i<o.length;i++){d.push({index:0,type:'delete'});}}else{var g=0;if(!O[0]){for(var i=0;i<o.length&&!O[i];i++){d.push({index:0,type:'delete'});g=i+1;}}for(var i=0;i<n.length;i++){if(!N[i]||N[i].row>g){d.push({index:i,type:'insert'});}else{g=N[i].row+1;for(var j=N[i].row+1;j<o.length&&(!O[j]||O[j].row<i);j++){d.push({index:i+1,type:'delete'});g=j+1;}}}}return d;};return a;});