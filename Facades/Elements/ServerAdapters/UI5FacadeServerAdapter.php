<?php
namespace exface\UI5Facade\Facades\Elements\ServerAdapters;

use exface\UI5Facade\Facades\Elements\UI5AbstractElement;
use exface\UI5Facade\Facades\Interfaces\UI5ServerAdapterInterface;
use exface\Core\Interfaces\Actions\ActionInterface;
use exface\Core\Actions\ReadData;
use exface\Core\Actions\ReadPrefill;
use exface\UrlDataConnector\Actions\CallOData2Operation;

class UI5FacadeServerAdapter implements UI5ServerAdapterInterface
{
    private $element = null;
    
    public function __construct(UI5AbstractElement $element)
    {
        $this->element = $element;
    }
    
    /**
     * 
     * {@inheritDoc}
     * @see \exface\UI5Facade\Facades\Interfaces\UI5ServerAdapterInterface::getElement()
     */
    public function getElement() : UI5AbstractElement
    {
        return $this->element;
    }
    
    /**
     * 
     * {@inheritDoc}
     * @see \exface\UI5Facade\Facades\Interfaces\UI5ServerAdapterInterface::buildJsServerRequest()
     */
    public function buildJsServerRequest(ActionInterface $action, string $oModelJs, string $oParamsJs, string $onModelLoadedJs, string $onErrorJs = '', string $onOfflineJs = '') : string
    {
        switch (true) {
            case $action instanceof ReadPrefill:
                return $this->buildJsPrefillLoader($oModelJs, $oParamsJs, $onModelLoadedJs, $onErrorJs, $onOfflineJs);
            case $action instanceof ReadData:
                return $this->buildJsDataLoader($oModelJs, $oParamsJs, $onModelLoadedJs, $onErrorJs, $onOfflineJs);
            default:
                return $this->buildJsClickCallServerAction($action, $oModelJs, $oParamsJs, $onModelLoadedJs, $onErrorJs, $onOfflineJs);
        }
    }
    
    protected function buildJsClickCallServerAction(ActionInterface $action, string $oModelJs, string $oParamsJs, string $onModelLoadedJs, string $onErrorJs = '', string $onOfflineJs = '') : string
    {
        $headers = ! empty($this->getElement()->getAjaxHeaders()) ? 'headers: ' . json_encode($this->getElement()->getAjaxHeaders()) . ',' : '';        
        $controller = $this->getElement()->getController();
        return <<<JS

							$oParamsJs.webapp = '{$this->getElement()->getFacade()->getWebapp()->getRootPage()->getAliasWithNamespace()}';
                            var oComponent = {$controller->buildJsComponentGetter()};                
                            if (!navigator.onLine) {
                                if (exfPreloader) {
                                    var actionParams = {
                                        type: 'POST',
        								url: '{$this->getElement()->getAjaxUrl()}',
                                        {$headers}
        								data: {$oParamsJs}
                                    }                                
                                    exfPreloader.addAction(actionParams, '{$action->getMetaObject()->getAliasWithNamespace()}')
                                    .then(function(key) {
                                        var response = {success: 'Action saved in offline queue!'};
                                        $oModelJs.setData(response);
                                        $onModelLoadedJs
                                    })
                                    .catch(function(error) {
                                        console.error(error);
                                        var response = {error: 'Action could not be saved in offline queue!'}
                                        {$this->getElement()->buildJsShowMessageError('response.error', '"Server error"')}
                                        {$onErrorJs}
                                    })
                                    oComponent.getPreloader().updateQueueCount();
                                } else {
                                    {$onOfflineJs}
                                }
                            } else {
                                $.ajax({
    								type: 'POST',
    								url: '{$this->getElement()->getAjaxUrl()}',
                                    {$headers}
    								data: {$oParamsJs},
    								success: function(data, textStatus, jqXHR) {
                                        if (typeof data === 'object') {
                                            response = data;
                                        } else {
                                            var response = {};
        									try {
        										response = $.parseJSON(data);
        									} catch (e) {
        										response.error = data;
        									}
                                        }
    				                   	if (response.success){
                                            $oModelJs.setData(response);
    										{$onModelLoadedJs}
    				                    } else {
    										{$this->getElement()->buildJsShowMessageError('response.error', '"Server error"')}
                                            {$onErrorJs}
    				                    }
    								},
    								error: function(jqXHR, textStatus, errorThrown){
                                        {$onErrorJs}
                                        if (navigator.onLine === false) {
                                            {$onOfflineJs}
                                        } else {
                                            {$this->getElement()->getController()->buildJsComponentGetter()}.showAjaxErrorDialog(jqXHR)
                                        }
    								}
    							});
                            }
                                        
JS;
    }
    
    protected function buildJsDataLoader(string $oModelJs, string $oParamsJs, string $onModelLoadedJs, string $onErrorJs = '', string $onOfflineJs = '') : string
    {
        $headers = ! empty($this->getElement()->getAjaxHeaders()) ? 'headers: ' . json_encode($this->getElement()->getAjaxHeaders()) . ',' : '';
        
        return <<<JS
                
                $oParamsJs.webapp = '{$this->getElement()->getFacade()->getWebapp()->getRootPage()->getAliasWithNamespace()}';                

                $.ajax({
					type: 'GET',
					url: '{$this->getElement()->getAjaxUrl()}',
                    {$headers}
					data: {$oParamsJs},
					success: function(data, textStatus, jqXHR) {
                        if (typeof data === 'object') {
                            response = data;
                        } else {
                            var response = {};
							try {
								response = $.parseJSON(data);
							} catch (e) {
								response.error = data;
							}
                        }
	                   	if (response.success){
                            $oModelJs.setData(response);
							{$onModelLoadedJs}
	                    } else {
							if (navigator.onLine === false) {
                                if (oData.length = 0) {
                                    {$onOfflineJs}
                                } else {
                                    {$this->getElement()->getController()->buildJsComponentGetter()}.showDialog('{$this->getElement()->translate('WIDGET.DATATABLE.OFFLINE_ERROR')}', '{$this->getElement()->translate('WIDGET.DATATABLE.OFFLINE_ERROR_TITLE')}', 'Error');
                                }
                            } else {
                                {$this->getElement()->buildJsShowError('jqXHR.responseText', "(jqXHR.statusCode+' '+jqXHR.statusText)")}
                            }
                            {$onErrorJs}
	                    }
					},
					error: function(jqXHR, textStatus, errorThrown){
                        {$onErrorJs}
                        if (navigator.onLine === false) {
                            {$onOfflineJs}
                        } else {
                            {$this->getElement()->getController()->buildJsComponentGetter()}.showAjaxErrorDialog(jqXHR)
                        }
					}
				});
                
JS;
    }
    
    protected function buildJsPrefillLoader(string $oModelJs, string $oParamsJs, string $onModelLoadedJs, string $onErrorJs = '', string $onOfflineJs = '') : string
    {
        return <<<JS
        
            $oParamsJs.webapp = '{$this->getElement()->getFacade()->getWebapp()->getRootPage()->getAliasWithNamespace()}';                
            
            $.ajax({
                url: "{$this->getElement()->getAjaxUrl()}",
                type: "GET",
				data: {$oParamsJs},
                success: function(response, textStatus, jqXHR) {
                    if (Object.keys({$oModelJs}.getData()).length !== 0) {
                        {$oModelJs}.setData({});
                    }
                    if (Array.isArray(response.rows) && response.rows.length > 0) {
                        {$oModelJs}.setData(response.rows[0]);
                        if (response.rows.length > 1) {
                            {$this->getElement()->buildJsShowMessageError('"Error prefilling view with data: received " + response.rows.length + " rows instead of 0 or 1! Only the first data row is visible."')};
                        }
                    }
                    {$onModelLoadedJs}
                },
                error: function(jqXHR, textStatus, errorThrown){
                    {$onErrorJs}
                    if (navigator.onLine === false) {
                        {$onOfflineJs}
                    } else {
                        {$this->getElement()->getController()->buildJsComponentGetter()}.showAjaxErrorDialog(jqXHR)
                    }
                }
			})
JS;
    }
}