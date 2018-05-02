<?php
namespace exface\OpenUI5Template\Templates\Elements;

use exface\Core\Widgets\SplitVertical;

/**
 * @method SplitVertical getWidget()
 * 
 * @author Andrej Kabachnik
 *
 */
class ui5SplitVertical extends ui5Container
{
    public function buildJsConstructor($oController = 'oController') : string
    {
        return <<<JS

    new sap.ui.layout.Splitter("{$this->getId()}", {
        height: "100%",
        width: "100%",
        orientation: "{$this->getOrientation()}",
        contentAreas: [
            {$this->buildJsChildrenConstructors()}
        ]
    })
JS;
    }
        
    protected function getOrientation()
    {
        return 'Vertical';
    }
}
