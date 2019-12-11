<?php
namespace exface\UI5Facade\Facades\Elements;

use exface\Core\Widgets\RangeFilter;
use exface\Core\Facades\AbstractAjaxFacade\Elements\JsRangeFilterTrait;

/**
 * Creates and renders an InlineGroup with to and from filters.
 * 
 * @method RangeFilter getWidget();
 * 
 * @author Andrej Kabachnik
 *
 */
class UI5RangeFilter extends UI5Filter
{
    use JsRangeFilterTrait;
    
    /**
     * 
     * {@inheritDoc}
     * @see \exface\UI5Facade\Facades\Elements\UI5Filter::buildJsConstructor()
     */
    public function buildJsConstructor($oControllerJs = 'oController') : string
    {
        return $this->getFacade()->getElement($this->getWidgetInlineGroup())->buildJsConstructor();
    }

    /**
     * adds the PseudoHandler to every element of the InlineGroup
     * 
     * {@inheritDoc}
     * @see \exface\UI5Facade\Facades\Elements\UI5Filter::addPseudoEventHandler()
     */
    public function addPseudoEventHandler($event, $code)
    {
        $inlineGroupWidgets = $this->getFacade()->getElement($this->getWidgetInlineGroup())->getWidget()->getWidgets();
        
        foreach($inlineGroupWidgets as $widget){
            $this->getFacade()->getElement($widget)->addPseudoEventHandler($event, $code);
        }
        
        return $this;
    }
}