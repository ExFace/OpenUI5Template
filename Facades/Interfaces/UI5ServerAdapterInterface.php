<?php
namespace exface\UI5Facade\Facades\Interfaces;

use exface\Core\Interfaces\Actions\ActionInterface;
use exface\UI5Facade\Facades\Elements\UI5AbstractElement;

/**
 * 
 * @author Andrej Kabachnik
 *
 */
interface UI5ServerAdapterInterface {
    
    /**
     * 
     * @return UI5AbstractElement
     */
    public function getElement() : UI5AbstractElement;
    
    /**
     * Returns the JS code to load data from the server and return a promise resolving to the loaded JSONModel.
     * 
     * @param ActionInterface $action
     * @param string $oModelJs
     * @param string $oParamsJs
     * @param string $onModelLoadedJs
     * @param string $onErrorJs
     * @param string $onOfflineJs
     * @return string
     */
    public function buildJsServerRequest(ActionInterface $action, string $oModelJs, string $oParamsJs, string $onModelLoadedJs, string $onErrorJs = '', string $onOfflineJs = '') : string;
    
}