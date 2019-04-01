<?php
namespace exface\UI5Facade\Facades\Interfaces;

use exface\Core\Facades\AbstractAjaxFacade\Interfaces\JsDataTypeFormatterInterface;

/**
 * 
 * @author Andrej Kabachnik
 *
 */
interface ui5BindingFormatterInterface {
    
    /**
     * Returns data binding properties specifying the formatting.
     * 
     * E.g. to make a widget format it's data as a date, the follwing object
     * can be used as configuration for the text binding:
     * 
     *  text: {
     *      path: 'DeliveryDate',
     *      type: 'sap.ui.model.type.Date',
     *      formatOptions: {source: {pattern: 'timestamp'}}
     *  }
     *  
     * where this method would supply
     * 
     *      type: 'sap.ui.model.type.Date',
     *      formatOptions: {source: {pattern: 'timestamp'}}
     *      
     * while the path and eventually other options should be generated by the
     * template element taking care of the widget.
     * 
     * @return string
     */
    public function buildJsBindingProperties();
    
    /**
     * Returns the corresponding javascript formatter as a fallback for controls
     * that do not support format-related binding properties.
     * 
     * @return JsDataTypeFormatterInterface
     */
    public function getJsFormatter();
}