<?php
namespace exface\UI5Facade\Facades\Formatters;

use exface\UI5Facade\Facades\Interfaces\ui5BindingFormatterInterface;
use exface\Core\Facades\AbstractAjaxFacade\Interfaces\JsDataTypeFormatterInterface;

abstract class AbstractUi5BindingFormatter implements ui5BindingFormatterInterface
{
    private $jsFormatter = null;
    
    public function __construct(JsDataTypeFormatterInterface $jsFormatter)
    {
        $this->setJsFormmater($jsFormatter);
    }
    
    /**
     * 
     * @param JsDataTypeFormatterInterface $jsFormatter
     * @return \exface\UI5Facade\Facades\Formatters\ui5DateFormatter
     */
    protected function setJsFormmater(JsDataTypeFormatterInterface $jsFormatter)
    {
        $this->jsFormatter = $jsFormatter;
        return $this;
    }
    
    /**
     * 
     * {@inheritDoc}
     * @see \exface\UI5Facade\Facades\Interfaces\ui5BindingFormatterInterface::getJsFormatter()
     */
    public function getJsFormatter()
    {
        return $this->jsFormatter;
    }
    
    /**
     * 
     * {@inheritDoc}
     * @see \exface\Core\Facades\AbstractAjaxFacade\Formatters\JsDateFormatter::getDataType()
     */
    public function getDataType()
    {
        return $this->getJsFormatter()->getDataType();
    }
}