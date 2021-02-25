<?php
namespace exface\UI5Facade\Facades\Elements;

use exface\Core\Widgets\SplitHorizontal;

/**
 * 
 * @method \exface\Core\Widgets\SplitPanel getWidget()
 * 
 * @author Andrej Kabachnik
 *
 */
class UI5SplitPanel extends UI5Panel
{
    public function buildJsProperties()
    {
        $widget = $this->getWidget();
        $sizeDimension = $widget->getParent() instanceof SplitHorizontal ? $widget->getWidth() : $widget->getHeight();
        switch (true) {
            case $sizeDimension->isFacadeSpecific() === true:
            case $sizeDimension->isPercentual() === true:
                $size = $sizeDimension->getValue();
                break;
            default:
                $size = 'auto';
        }
        return parent::buildJsProperties() . '
                    layoutData: new sap.ui.layout.SplitterLayoutData({
                        size: "' . $size . '"
                    })';
    }
    
    /**
     * 
     * {@inheritDoc}
     * @see \exface\UI5Facade\Facades\Elements\UI5Panel::buildJsPropertyHeight()
     */
    protected function buildJsPropertyHeight() : string
    {
        return 'height: "100%",';
    }
}
