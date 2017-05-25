<?php
namespace exface\OpenUI5Template\Template;

use exface\AbstractAjaxTemplate\Template\AbstractAjaxTemplate;
use exface\Core\Interfaces\UiPageInterface;
use exface\Core\Interfaces\Exceptions\ErrorExceptionInterface;

class OpenUI5Template extends AbstractAjaxTemplate
{

    protected $request_columns = array();

    public function init()
    {
        $this->setClassPrefix('ui5');
        $this->setClassNamespace(__NAMESPACE__);
    }

    /**
     *
     * {@inheritdoc}
     *
     * @see \exface\AbstractAjaxTemplate\Template\AbstractAjaxTemplate::processRequest($page_id=NULL, $widget_id=NULL, $action_alias=NULL, $disable_error_handling=false)
     */
    public function processRequest($page_id = NULL, $widget_id = NULL, $action_alias = NULL, $disable_error_handling = false)
    {
        $this->request_columns = $this->getWorkbench()->getRequestParams()['columns'];
        $this->getWorkbench()->removeRequestParam('columns');
        $this->getWorkbench()->removeRequestParam('search');
        $this->getWorkbench()->removeRequestParam('draw');
        $this->getWorkbench()->removeRequestParam('_');
        return parent::processRequest($page_id, $widget_id, $action_alias, $disable_error_handling);
    }

    public function getRequestPagingOffset()
    {
        if (! $this->request_paging_offset) {
            $this->request_paging_offset = $this->getWorkbench()->getRequestParams()['start'];
            $this->getWorkbench()->removeRequestParam('start');
        }
        return $this->request_paging_offset;
    }

    public function getRequestPagingRows()
    {
        if (! $this->request_paging_rows) {
            $this->request_paging_rows = $this->getWorkbench()->getRequestParams()['length'];
            $this->getWorkbench()->removeRequestParam('length');
        }
        return $this->request_paging_rows;
    }

    protected function setResponseFromError(ErrorExceptionInterface $exception, UiPageInterface $page)
    {
        $http_status_code = is_numeric($exception->getStatusCode()) ? $exception->getStatusCode() : 500;
        if (is_numeric($http_status_code)) {
            http_response_code($http_status_code);
        } else {
            http_response_code(500);
        }
        $this->setResponse($page->getWorkbench()->getDebugger()->printException($exception));
        return $this;
    }
}
?>