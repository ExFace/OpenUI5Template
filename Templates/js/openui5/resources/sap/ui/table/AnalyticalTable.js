/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2017 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global','./AnalyticalColumn','./Table','./TreeTable','./library','sap/ui/model/analytics/ODataModelAdapter','sap/ui/model/SelectionModel','sap/ui/model/Sorter','sap/ui/core/Popup','sap/ui/unified/Menu','sap/ui/unified/MenuItem','./TableUtils'],function(q,A,T,a,b,O,S,c,P,M,d,e){"use strict";var G=b.GroupEventType,f=b.SelectionMode,g=b.SortOrder,h=b.TreeAutoExpandMode;var k=T.extend("sap.ui.table.AnalyticalTable",{metadata:{library:"sap.ui.table",properties:{sumOnTop:{type:"boolean",group:"Appearance",defaultValue:false,deprecated:true},numberOfExpandedLevels:{type:"int",group:"Misc",defaultValue:0,deprecated:true},autoExpandMode:{type:"string",group:"Misc",defaultValue:"Bundled",deprecated:true},columnVisibilityMenuSorter:{type:"any",group:"Appearance",defaultValue:null},collapseRecursive:{type:"boolean",defaultValue:true},dirty:{type:"boolean",group:"Appearance",defaultValue:null,deprecated:true}},designTime:true},renderer:"sap.ui.table.TableRenderer"});k.prototype._getFixedBottomRowContexts=function(){var B=this.getBinding("rows");if(B){return[B.getGrandTotalNode()];}};k.prototype._getContexts=a.prototype._getContexts;k.prototype.init=function(){T.prototype.init.apply(this,arguments);this.addStyleClass("sapUiAnalyticalTable");this.attachBrowserEvent("contextmenu",this._onContextMenu);this.setSelectionMode(f.MultiToggle);this.setShowColumnVisibilityMenu(true);this.setEnableColumnFreeze(true);this.setEnableCellFilter(true);this._aGroupedColumns=[];this._bSuspendUpdateAnalyticalInfo=false;e.Grouping.setGroupMode(this);};k.prototype.exit=function(){this._cleanupGroupHeaderMenu();T.prototype.exit.apply(this,arguments);};k.prototype._adaptLocalization=function(r,l){T.prototype._adaptLocalization.apply(this,arguments);if(l){this._cleanupGroupHeaderMenu();}};k.prototype.setFixedRowCount=function(){q.sap.log.error("The property fixedRowCount is not supported by control sap.ui.table.AnalyticalTable!");return this;};k.prototype.setFixedBottomRowCount=function(){q.sap.log.error("The property fixedBottomRowCount is managed by control sap.ui.table.AnalyticalTable!");return this;};k.prototype.setDirty=function(D){q.sap.log.error("The property dirty of control sap.ui.table.AnalyticalTable is deprecated. Please use showOverlay instead.");this.setProperty("dirty",D,true);this.setShowOverlay(this.getDirty());return this;};k.prototype.setEnableGrouping=function(){q.sap.log.error("The property enableGrouping is not supported by the sap.ui.table.AnalyticalTable control");return this;};k.prototype.setGroupBy=function(){q.sap.log.warning("The groupBy association is not supported by the sap.ui.table.AnalyticalTable control");return this;};k.prototype.getModel=function(n){var m=T.prototype.getModel.apply(this,arguments);var r=this.getBindingInfo("rows");if(m&&r&&r.model==n){O.apply(m);}return m;};k.prototype._onBindingChange=function(E){T.prototype._onBindingChange.apply(this,arguments);var r=typeof(E)==="object"?E.getParameter("reason"):E;if(r!=="sort"){this._invalidateColumnMenus();}};k.prototype._bindAggregation=function(n,B){if(n==="rows"){this.setProperty("firstVisibleRow",0,true);this._applyAnalyticalBindingInfo(B);this._updateTotalRow(true);this._applyODataModelAnalyticalAdapter(B.model);T._addBindingListener(B,"selectionChanged",this._onSelectionChanged.bind(this));}T.prototype._bindAggregation.call(this,n,B);};k.prototype._initSelectionModel=function(s){this._oSelection=new S(s);return this;};k.prototype.setSelectionMode=a.prototype.setSelectionMode;k.prototype._applyAnalyticalBindingInfo=function(B){var C=this.getColumns();for(var i=0,l=C.length;i<l;i++){if(C[i].getSorted()){B.sorter=B.sorter||[];B.sorter.push(new c(C[i].getSortProperty()||C[i].getLeadingProperty(),C[i].getSortOrder()===g.Descending));}}B.parameters=B.parameters||{};B.parameters.analyticalInfo=this._getColumnInformation();if(!B.parameters.hasOwnProperty("sumOnTop")){B.parameters.sumOnTop=this.getSumOnTop();}if(!B.parameters.hasOwnProperty("numberOfExpandedLevels")){B.parameters.numberOfExpandedLevels=this.getNumberOfExpandedLevels();}if(B.parameters.numberOfExpandedLevels>this._aGroupedColumns.length){B.parameters.numberOfExpandedLevels=0;}if(!B.parameters.hasOwnProperty("autoExpandMode")){var E=this.getAutoExpandMode();if(E!=h.Bundled&&E!=h.Sequential){E=h.Bundled;}B.parameters.autoExpandMode=E;}};k.prototype._applyODataModelAnalyticalAdapter=function(m){if(m!=null){O.apply(m);}};k.prototype._getColumnInformation=function(){var C=[],t=this.getColumns();for(var i=0;i<this._aGroupedColumns.length;i++){var o=sap.ui.getCore().byId(this._aGroupedColumns[i]);if(!o){continue;}C.push({name:o.getLeadingProperty(),visible:o.getVisible(),grouped:o.getGrouped(),total:o.getSummed(),sorted:o.getSorted(),sortOrder:o.getSortOrder(),inResult:o.getInResult(),formatter:o.getGroupHeaderFormatter()});}for(var i=0;i<t.length;i++){var o=t[i];if(q.inArray(o.getId(),this._aGroupedColumns)>-1){continue;}if(!o instanceof A){q.sap.log.error("You have to use AnalyticalColumns for the Analytical table");}C.push({name:o.getLeadingProperty(),visible:o.getVisible(),grouped:o.getGrouped(),total:o.getSummed(),sorted:o.getSorted(),sortOrder:o.getSortOrder(),inResult:o.getInResult(),formatter:o.getGroupHeaderFormatter()});}return C;};k.prototype._updateTableContent=function(){var B=this.getBinding("rows"),F=this.getFirstVisibleRow(),j=this.getFixedBottomRowCount(),C=this.getVisibleRowCount(),m=this.getColumns();var r=this.getRows();if(!B){for(var i=0;i<r.length;i++){e.Grouping.cleanupTableRowForGrouping(this,r[i]);}return;}var o=this.getBindingInfo("rows");for(var R=0,l=Math.min(C,r.length);R<l;R++){var I=R>(C-j-1)&&this._getTotalRowCount()>C,n=I?(this._getTotalRowCount()-1-(C-1-R)):F+R,p=r[R],$=p.$(),s=this.$().find("div[data-sap-ui-rowindex="+$.attr("data-sap-ui-rowindex")+"]");var t;if(I&&B.bProvideGrandTotals){t=B.getGrandTotalContextInfo();}else{t=this.getContextInfoByIndex(n);}var L=t?t.level:0;if(!t||!t.context){e.Grouping.cleanupTableRowForGrouping(this,p);if(t&&!t.context){$.addClass("sapUiAnalyticalTableDummy");s.addClass("sapUiAnalyticalTableDummy");}continue;}if(B.nodeHasChildren&&B.nodeHasChildren(t)){e.Grouping.updateTableRowForGrouping(this,p,true,t.nodeState.expanded,t.nodeState.expanded&&!o.parameters.sumOnTop,false,L,B.getGroupName(t.context,t.level));}else{e.Grouping.updateTableRowForGrouping(this,p,false,false,false,t.nodeState.sum,L,t.nodeState.sum&&t.level>0?B.getGroupName(t.context,t.level):null);}var u=p.getCells();for(var i=0,v=u.length;i<v;i++){var w=u[i].data("sap-ui-colindex");var x=m[w];var y=q(u[i].$().closest("td"));if(B.isMeasure(x.getLeadingProperty())){y.addClass("sapUiTableMeasureCell");y.toggleClass("sapUiTableCellHidden",t.nodeState.sum&&!x.getSummed());}else{y.removeClass("sapUiTableMeasureCell");}}}};k.prototype._onContextMenu=function(E){if(q(E.target).closest('tr').hasClass('sapUiTableGroupHeader')||q(E.target).closest('.sapUiTableRowHdr.sapUiTableGroupHeader').length>0){this._iGroupedLevel=q(E.target).closest('[data-sap-ui-level]').data('sap-ui-level');var m=this._getGroupHeaderMenu();var i=P.Dock;var l=E.pageX||E.clientX;var L=E.pageY||E.clientY;m.open(false,E.target,i.LeftTop,i.LeftTop,document,(l-2)+" "+(L-2));E.preventDefault();E.stopPropagation();return;}return true;};k.prototype._getGroupHeaderMenu=function(){var t=this;function j(){var i=t._iGroupedLevel-1;if(t._aGroupedColumns[i]){var l=t.getColumns().filter(function(C){return t._aGroupedColumns[i]===C.getId();})[0];return{column:l,index:i};}else{return undefined;}}if(!this._oGroupHeaderMenu){this._oGroupHeaderMenu=new M();this._oGroupHeaderMenuVisibilityItem=new d({text:this._oResBundle.getText("TBL_SHOW_COLUMN"),select:function(){var o=j();if(o){var C=o.column,s=C.getShowIfGrouped();C.setShowIfGrouped(!s);t.fireGroup({column:C,groupedColumns:C.getParent()._aGroupedColumns,type:(!s?G.showGroupedColumn:G.hideGroupedColumn)});}}});this._oGroupHeaderMenu.addItem(this._oGroupHeaderMenuVisibilityItem);this._oGroupHeaderMenu.addItem(new d({text:this._oResBundle.getText("TBL_UNGROUP"),select:function(){var o=j();if(o!=null&&o.column!=null){var u=o.column;u.setGrouped(false);t.fireGroup({column:u,groupedColumns:t._aGroupedColumns,type:G.ungroup});}}}));this._oGroupHeaderMenu.addItem(new d({text:this._oResBundle.getText("TBL_UNGROUP_ALL"),select:function(){var l=t.getColumns();t.suspendUpdateAnalyticalInfo();for(var i=0;i<l.length;i++){l[i].setGrouped(false);}t.resumeUpdateAnalyticalInfo();t.fireGroup({column:undefined,groupedColumns:[],type:G.ungroupAll});}}));this._oGroupHeaderMoveUpItem=new d({text:this._oResBundle.getText("TBL_MOVE_UP"),select:function(){var o=j();if(o){var C=o.column;var i=q.inArray(C.getId(),t._aGroupedColumns);if(i>0){t._aGroupedColumns[i]=t._aGroupedColumns.splice(i-1,1,t._aGroupedColumns[i])[0];t.updateAnalyticalInfo();t.fireGroup({column:C,groupedColumns:C.getParent()._aGroupedColumns,type:G.moveUp});}}},icon:"sap-icon://arrow-top"});this._oGroupHeaderMenu.addItem(this._oGroupHeaderMoveUpItem);this._oGroupHeaderMoveDownItem=new d({text:this._oResBundle.getText("TBL_MOVE_DOWN"),select:function(){var o=j();if(o){var C=o.column;var i=q.inArray(C.getId(),t._aGroupedColumns);if(i<t._aGroupedColumns.length){t._aGroupedColumns[i]=t._aGroupedColumns.splice(i+1,1,t._aGroupedColumns[i])[0];t.updateAnalyticalInfo();t.fireGroup({column:C,groupedColumns:C.getParent()._aGroupedColumns,type:G.moveDown});}}},icon:"sap-icon://arrow-bottom"});this._oGroupHeaderMenu.addItem(this._oGroupHeaderMoveDownItem);this._oGroupHeaderMenu.addItem(new d({text:this._oResBundle.getText("TBL_SORT_ASC"),select:function(){var o=j();if(o){var C=o.column;C.sort(false);}},icon:"sap-icon://up"}));this._oGroupHeaderMenu.addItem(new d({text:this._oResBundle.getText("TBL_SORT_DESC"),select:function(){var o=j();if(o){var C=o.column;C.sort(true);}},icon:"sap-icon://down"}));this._oGroupHeaderMenu.addItem(new d({text:this._oResBundle.getText("TBL_COLLAPSE_LEVEL"),select:function(){t.getBinding("rows").collapseToLevel(t._iGroupedLevel-1);t.setFirstVisibleRow(0);t.clearSelection();}}));this._oGroupHeaderMenu.addItem(new d({text:this._oResBundle.getText("TBL_COLLAPSE_ALL"),select:function(){t.getBinding("rows").collapseToLevel(0);t.setFirstVisibleRow(0);t.clearSelection();}}));}var o=j();if(o){var C=o.column;if(C.getShowIfGrouped()){this._oGroupHeaderMenuVisibilityItem.setText(this._oResBundle.getText("TBL_HIDE_COLUMN"));}else{this._oGroupHeaderMenuVisibilityItem.setText(this._oResBundle.getText("TBL_SHOW_COLUMN"));}this._oGroupHeaderMoveUpItem.setEnabled(o.index>0);this._oGroupHeaderMoveDownItem.setEnabled(o.index<this._aGroupedColumns.length-1);}else{this._oGroupHeaderMoveUpItem.setEnabled(true);this._oGroupHeaderMoveDownItem.setEnabled(true);}return this._oGroupHeaderMenu;};k.prototype._cleanupGroupHeaderMenu=function(){if(this._oGroupHeaderMenu){this._oGroupHeaderMenu.destroy();this._oGroupHeaderMenu=null;this._oGroupHeaderMenuVisibilityItem=null;this._oGroupHeaderMoveUpItem=null;this._oGroupHeaderMoveDownItem=null;}};k.prototype.expand=function(r){var B=this.getBinding("rows");if(B){B.expand(r);}};k.prototype.collapse=function(r){var B=this.getBinding("rows");if(B){B.collapse(r);}};k.prototype.collapseAll=function(){var B=this.getBinding("rows");if(B){B.collapseToLevel(0);this.setFirstVisibleRow(0);}return this;};k.prototype.isExpanded=function(r){var B=this.getBinding("rows");if(B){return B.isExpanded(r);}return false;};k.prototype.getContextByIndex=function(i){var B=this.getBinding("rows");return i>=0&&B?B.getContextByIndex(i):null;};k.prototype.getContextInfoByIndex=function(i){var B=this.getBinding("rows");return i>=0&&B?B.getNodeByIndex(i):null;};k.prototype.suspendUpdateAnalyticalInfo=function(){this._bSuspendUpdateAnalyticalInfo=true;};k.prototype.resumeUpdateAnalyticalInfo=function(s,F){this._bSuspendUpdateAnalyticalInfo=false;this._updateColumns(s,F);};k.prototype.addColumn=function(C,s){var o=this._getColumn(C);if(o.getGrouped()){this._addGroupedColumn(o.getId());}T.prototype.addColumn.call(this,o,s);this._updateColumns(s);return this;};k.prototype.insertColumn=function(C,i,s){var o=this._getColumn(C);if(o.getGrouped()){this._addGroupedColumn(o.getId());}T.prototype.insertColumn.call(this,o,i,s);this._updateColumns(s);return this;};k.prototype.removeColumn=function(C,s){var r=T.prototype.removeColumn.apply(this,arguments);if(!this._bReorderInProcess){this._aGroupedColumns=q.grep(this._aGroupedColumns,function(v){if(C.getId){return v!=C.getId();}else{return v==C;}});}this.updateAnalyticalInfo(s);return r;};k.prototype.removeAllColumns=function(s){this._aGroupedColumns=[];var r=T.prototype.removeAllColumns.apply(this,arguments);this._updateColumns(s);return r;};k.prototype._getColumn=function(C){if(typeof C==="string"){var o=new A({leadingProperty:C,template:C,managed:true});return o;}else if(C instanceof A){return C;}else{throw new Error("Wrong column type. You need to define a string (property) or pass an AnalyticalColumnObject");}};k.prototype._updateColumns=function(s,F){if(!this._bSuspendUpdateAnalyticalInfo){this._updateTableColumnDetails();this.updateAnalyticalInfo(s,F);}};k.prototype.updateAnalyticalInfo=function(s,F){if(this._bSuspendUpdateAnalyticalInfo){return;}var B=this.getBinding("rows");if(B){var C=this._getColumnInformation();var n=B.getNumberOfExpandedLevels()||0;if(n>this._aGroupedColumns.length){B.setNumberOfExpandedLevels(0);}B.updateAnalyticalInfo(C,F);this._updateTotalRow(s);if(!s){this._getRowContexts();}}};k.prototype.refreshRows=function(){T.prototype.refreshRows.apply(this,arguments);this._updateTotalRow();};k.prototype._updateTotalRow=function(s){var B=this.getBinding("rows");var F=this.getFixedBottomRowCount();if(B&&(B.providesGrandTotal()&&B.hasTotaledMeasures())){if(F!==1){this.setProperty("fixedBottomRowCount",1,s);}}else{if(F!==0){this.setProperty("fixedBottomRowCount",0,s);}}};k.prototype._updateTableColumnDetails=function(){if(this._bSuspendUpdateAnalyticalInfo){return;}var B=this.getBinding("rows"),r=B&&B.getAnalyticalQueryResult();if(r){var C=this.getColumns(),l=[],u=[],D=[],m={},n,p;for(var i=0;i<C.length;i++){n=C[i];n._isLastGroupableLeft=false;n._bLastGroupAndGrouped=false;n._bDependendGrouped=false;if(!n.getVisible()){continue;}var L=n.getLeadingProperty();p=r.findDimensionByPropertyName(L);if(p){var t=p.getName();if(!m[t]){m[t]={dimension:p,columns:[n]};}else{m[t].columns.push(n);}if(n.getGrouped()&&q.inArray(t,l)==-1){l.push(t);}if(q.inArray(t,D)==-1){D.push(t);}}}u=q.grep(D,function(s){return(q.inArray(s,l)==-1);});if(l.length>0){q.each(l,function(i,s){q.each(m[s].columns,function(j,o){if(!o.getGrouped()){o._bDependendGrouped=true;}});});if(l.length==D.length){p=r.findDimensionByPropertyName(sap.ui.getCore().byId(this._aGroupedColumns[this._aGroupedColumns.length-1]).getLeadingProperty());var v=m[p.getName()].columns;q.each(v,function(i,o){o._bLastGroupAndGrouped=true;});}}if(u.length==1){q.each(m[u[0]].columns,function(j,o){o._isLastGroupableLeft=true;});}}};k.prototype._getFirstMeasureColumnIndex=function(){var B=this.getBinding("rows"),r=B&&B.getAnalyticalQueryResult(),C=this._getVisibleColumns();if(!r){return-1;}for(var i=0;i<C.length;i++){var o=C[i],l=o.getLeadingProperty();if(r.findMeasureByName(l)||r.findMeasureByPropertyName(l)){return i;}}};k.prototype.getTotalSize=function(){var B=this.getBinding("rows");if(B){return B.getTotalSize();}return 0;};k.prototype._onPersoApplied=function(){T.prototype._onPersoApplied.apply(this,arguments);this._aGroupedColumns=[];var C=this.getColumns();for(var i=0,l=C.length;i<l;i++){if(C[i].getGrouped()){this._addGroupedColumn(C[i].getId());}}this._updateColumns();};k.prototype._addGroupedColumn=function(C){if(this._aGroupedColumns.indexOf(C)===-1){this._aGroupedColumns.push(C);}};k.prototype._removeGroupedColumn=function(C){var i=this._aGroupedColumns.indexOf(C);if(i>=0){this._aGroupedColumns.splice(i,1);}};k.prototype.getGroupedColumns=function(){return this._aGroupedColumns;};k.prototype.setCollapseRecursive=function(C){var B=this.getBinding("rows");if(B){if(B.setCollapseRecursive){B.setCollapseRecursive(C);}}this.setProperty("collapseRecursive",!!C,true);return this;};k.prototype._getSelectableRowCount=function(){var B=this.getBinding("rows");if(B==null){return 0;}var r=B.getGrandTotalContextInfo();return r==null?0:r.totalNumberOfLeafs;};k.prototype.isIndexSelected=a.prototype.isIndexSelected;k.prototype.setSelectedIndex=a.prototype.setSelectedIndex;k.prototype.getSelectedIndices=a.prototype.getSelectedIndices;k.prototype.setSelectionInterval=a.prototype.setSelectionInterval;k.prototype.addSelectionInterval=a.prototype.addSelectionInterval;k.prototype.removeSelectionInterval=a.prototype.removeSelectionInterval;k.prototype.selectAll=a.prototype.selectAll;k.prototype.getSelectedIndex=a.prototype.getSelectedIndex;k.prototype.clearSelection=a.prototype.clearSelection;k.prototype._isRowSelectable=function(r){var B=this.getBinding("rows");if(B){return B.isIndexSelectable(r);}else{return false;}};k.prototype._getSelectedIndicesCount=a.prototype._getSelectedIndicesCount;k.prototype.getAnalyticalInfoOfRow=function(r){if(!this._validateRow(r)){return null;}var B=this.getBindingInfo("rows");var o=this.getBinding("rows");if(!B||!o){return null;}var C=r.getBindingContext(B.model);if(!C){return null;}var I=C===o.getGrandTotalContext();var j=null;var l=-1;if(I){j=o.getGrandTotalContextInfo();l=0;}else{j=this.getContextInfoByIndex(r.getIndex());if(j){l=j.level;}}var m=j&&o.nodeHasChildren&&o.nodeHasChildren(j);var n=!m&&!I&&j&&j.nodeState&&j.nodeState.sum;var p=[];if(n||m){var s=this.getGroupedColumns();if(s.length>0&&l>0&&l<=s.length){for(var i=0;i<l;i++){p.push(s[i]);}}}return{grandTotal:I,group:m,groupTotal:n,level:l,context:C,groupedColumns:p};};return k;});