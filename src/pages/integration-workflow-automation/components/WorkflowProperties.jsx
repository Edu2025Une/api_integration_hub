import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const WorkflowProperties = ({ 
  selectedNode, 
  onNodeUpdate, 
  workflow, 
  onWorkflowUpdate,
  executionHistory,
  isCollapsed,
  onToggle 
}) => {
  const [activeTab, setActiveTab] = useState('properties');

  const environmentOptions = [
    { value: 'development', label: 'Desenvolvimento' },
    { value: 'staging', label: 'Homologação' },
    { value: 'production', label: 'Produção' }
  ];

  const logLevelOptions = [
    { value: 'debug', label: 'Debug' },
    { value: 'info', label: 'Info' },
    { value: 'warn', label: 'Warning' },
    { value: 'error', label: 'Error' }
  ];

  const handleNodeConfigUpdate = (field, value) => {
    if (!selectedNode) return;
    
    const updatedConfig = {
      ...selectedNode?.config,
      [field]: value
    };
    
    onNodeUpdate(selectedNode?.id, { config: updatedConfig });
  };

  const handleCustomFieldUpdate = (field, value) => {
    if (!selectedNode) return;
    
    const updatedCustomFields = {
      ...selectedNode?.customFields,
      [field]: value
    };
    
    onNodeUpdate(selectedNode?.id, { customFields: updatedCustomFields });
  };

  const renderNodeProperties = () => {
    if (!selectedNode) {
      return (
        <div className="text-center py-8">
          <Icon name="MousePointer" size={32} className="text-muted-foreground mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">
            Selecione um nó para ver suas propriedades
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {/* Basic Properties */}
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-3">
            Propriedades Básicas
          </h3>
          <div className="space-y-3">
            <Input
              label="Nome do Nó"
              value={selectedNode?.name}
              onChange={(e) => onNodeUpdate(selectedNode?.id, { name: e?.target?.value })}
            />
            
            <div>
              <label className="text-xs font-medium text-foreground mb-1 block">
                Tipo
              </label>
              <div className="flex items-center space-x-2 p-2 bg-muted rounded-md">
                <Icon name={selectedNode?.icon} size={16} className="text-primary" />
                <span className="text-sm text-foreground">{selectedNode?.type}</span>
              </div>
            </div>
          </div>
        </div>
        {/* Node-specific Configuration */}
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-3">
            Configuração
          </h3>
          <div className="space-y-3">
            {selectedNode?.category === 'connectors' && (
              <>
                {selectedNode?.type === 'HTTP Request' && (
                  <>
                    <Select
                      label="Método HTTP"
                      options={[
                        { value: 'GET', label: 'GET' },
                        { value: 'POST', label: 'POST' },
                        { value: 'PUT', label: 'PUT' },
                        { value: 'DELETE', label: 'DELETE' }
                      ]}
                      value={selectedNode?.config?.method}
                      onChange={(value) => handleNodeConfigUpdate('method', value)}
                    />
                    <Input
                      label="Endpoint URL"
                      value={selectedNode?.config?.endpoint}
                      onChange={(e) => handleNodeConfigUpdate('endpoint', e?.target?.value)}
                      placeholder="https://api.exemplo.com/dados"
                    />
                  </>
                )}
                
                {selectedNode?.type === 'Database Query' && (
                  <>
                    <Input
                      label="String de Conexão"
                      value={selectedNode?.config?.connection}
                      onChange={(e) => handleNodeConfigUpdate('connection', e?.target?.value)}
                      placeholder="postgresql://user:pass@host:port/db"
                    />
                    <div>
                      <label className="text-xs font-medium text-foreground mb-1 block">
                        Query SQL
                      </label>
                      <textarea
                        className="w-full p-2 text-sm border border-border rounded-md bg-input text-foreground font-mono"
                        rows={4}
                        value={selectedNode?.config?.query}
                        onChange={(e) => handleNodeConfigUpdate('query', e?.target?.value)}
                        placeholder="SELECT * FROM tabela WHERE condicao = ?"
                      />
                    </div>
                  </>
                )}
              </>
            )}

            {selectedNode?.category === 'transformers' && (
              <>
                {selectedNode?.type === 'Data Mapper' && (
                  <div>
                    <label className="text-xs font-medium text-foreground mb-1 block">
                      Mapeamento JSON
                    </label>
                    <textarea
                      className="w-full p-2 text-sm border border-border rounded-md bg-input text-foreground font-mono"
                      rows={6}
                      value={JSON.stringify(selectedNode?.config?.mappings, null, 2)}
                      onChange={(e) => {
                        try {
                          const mappings = JSON.parse(e?.target?.value);
                          handleNodeConfigUpdate('mappings', mappings);
                        } catch (error) {
                          // Invalid JSON, don't update
                        }
                      }}
                      placeholder='{\n  "campo_origem": "campo_destino"\n}'
                    />
                  </div>
                )}
              </>
            )}

            {selectedNode?.category === 'logic' && (
              <>
                {selectedNode?.type === 'Conditional Logic' && (
                  <Input
                    label="Condição"
                    value={selectedNode?.config?.condition}
                    onChange={(e) => handleNodeConfigUpdate('condition', e?.target?.value)}
                    placeholder="data.status === 'active'"
                  />
                )}
                
                {selectedNode?.type === 'Delay Timer' && (
                  <>
                    <Input
                      type="number"
                      label="Duração"
                      value={selectedNode?.config?.duration}
                      onChange={(e) => handleNodeConfigUpdate('duration', parseInt(e?.target?.value))}
                    />
                    <Select
                      label="Unidade"
                      options={[
                        { value: 'milliseconds', label: 'Milissegundos' },
                        { value: 'seconds', label: 'Segundos' },
                        { value: 'minutes', label: 'Minutos' }
                      ]}
                      value={selectedNode?.config?.unit}
                      onChange={(value) => handleNodeConfigUpdate('unit', value)}
                    />
                  </>
                )}
              </>
            )}

            {selectedNode?.category === 'actions' && (
              <>
                {selectedNode?.type === 'Email Sender' && (
                  <>
                    <Input
                      label="Para"
                      value={selectedNode?.config?.to}
                      onChange={(e) => handleNodeConfigUpdate('to', e?.target?.value)}
                      placeholder="destinatario@exemplo.com"
                    />
                    <Input
                      label="Assunto"
                      value={selectedNode?.config?.subject}
                      onChange={(e) => handleNodeConfigUpdate('subject', e?.target?.value)}
                    />
                    <div>
                      <label className="text-xs font-medium text-foreground mb-1 block">
                        Corpo do Email
                      </label>
                      <textarea
                        className="w-full p-2 text-sm border border-border rounded-md bg-input text-foreground"
                        rows={4}
                        value={selectedNode?.config?.body}
                        onChange={(e) => handleNodeConfigUpdate('body', e?.target?.value)}
                      />
                    </div>
                  </>
                )}
                
                {selectedNode?.type === 'Logger' && (
                  <>
                    <Select
                      label="Nível de Log"
                      options={logLevelOptions}
                      value={selectedNode?.config?.level}
                      onChange={(value) => handleNodeConfigUpdate('level', value)}
                    />
                    <Input
                      label="Mensagem"
                      value={selectedNode?.config?.message}
                      onChange={(e) => handleNodeConfigUpdate('message', e?.target?.value)}
                    />
                  </>
                )}
              </>
            )}
          </div>
        </div>
        {/* Custom Fields */}
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-3">
            Campos Personalizados
          </h3>
          <div className="space-y-3">
            <Input
              label="Campo Personalizado 1"
              value={selectedNode?.customFields?.field1 || ''}
              onChange={(e) => handleCustomFieldUpdate('field1', e?.target?.value)}
              placeholder="Informação adicional 1"
            />
            <Input
              label="Campo Personalizado 2"
              value={selectedNode?.customFields?.field2 || ''}
              onChange={(e) => handleCustomFieldUpdate('field2', e?.target?.value)}
              placeholder="Informação adicional 2"
            />
            <Input
              label="Campo Personalizado 3"
              value={selectedNode?.customFields?.field3 || ''}
              onChange={(e) => handleCustomFieldUpdate('field3', e?.target?.value)}
              placeholder="Informação adicional 3"
            />
          </div>
        </div>
      </div>
    );
  };

  const renderWorkflowSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-3">
          Configurações do Fluxo
        </h3>
        <div className="space-y-3">
          <Input
            label="Nome do Fluxo"
            value={workflow?.name}
            onChange={(e) => onWorkflowUpdate({ name: e?.target?.value })}
          />
          
          <div>
            <label className="text-xs font-medium text-foreground mb-1 block">
              Descrição
            </label>
            <textarea
              className="w-full p-2 text-sm border border-border rounded-md bg-input text-foreground"
              rows={3}
              value={workflow?.description}
              onChange={(e) => onWorkflowUpdate({ description: e?.target?.value })}
              placeholder="Descreva o propósito deste fluxo de trabalho"
            />
          </div>

          <Select
            label="Ambiente"
            options={environmentOptions}
            value={workflow?.environment}
            onChange={(value) => onWorkflowUpdate({ environment: value })}
          />

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="autoStart"
              checked={workflow?.autoStart}
              onChange={(e) => onWorkflowUpdate({ autoStart: e?.target?.checked })}
              className="rounded border-border"
            />
            <label htmlFor="autoStart" className="text-sm text-foreground">
              Iniciar automaticamente
            </label>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-foreground mb-3">
          Configurações de Execução
        </h3>
        <div className="space-y-3">
          <Input
            type="number"
            label="Timeout (segundos)"
            value={workflow?.timeout}
            onChange={(e) => onWorkflowUpdate({ timeout: parseInt(e?.target?.value) })}
          />
          
          <Input
            type="number"
            label="Máximo de Tentativas"
            value={workflow?.maxRetries}
            onChange={(e) => onWorkflowUpdate({ maxRetries: parseInt(e?.target?.value) })}
          />

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="enableLogging"
              checked={workflow?.enableLogging}
              onChange={(e) => onWorkflowUpdate({ enableLogging: e?.target?.checked })}
              className="rounded border-border"
            />
            <label htmlFor="enableLogging" className="text-sm text-foreground">
              Habilitar logging detalhado
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  const renderExecutionHistory = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">
          Histórico de Execução
        </h3>
        <Button variant="ghost" size="sm">
          <Icon name="RefreshCw" size={14} className="mr-1" />
          Atualizar
        </Button>
      </div>

      <div className="space-y-2">
        {executionHistory?.map((execution) => (
          <div
            key={execution?.id}
            className="p-3 bg-muted/50 border border-border rounded-lg"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <Icon
                  name={execution?.status === 'success' ? 'CheckCircle' : 
                        execution?.status === 'error' ? 'XCircle' : 'Clock'}
                  size={16}
                  className={execution?.status === 'success' ? 'text-success' : 
                            execution?.status === 'error' ? 'text-error' : 'text-warning'}
                />
                <span className="text-sm font-medium text-foreground">
                  {execution?.status === 'success' ? 'Sucesso' : 
                   execution?.status === 'error' ? 'Erro' : 'Em Execução'}
                </span>
              </div>
              <span className="text-xs text-muted-foreground">
                {new Date(execution.timestamp)?.toLocaleString('pt-BR')}
              </span>
            </div>
            
            <p className="text-xs text-muted-foreground mb-2">
              Duração: {execution?.duration}ms
            </p>
            
            {execution?.error && (
              <div className="text-xs text-error bg-error/10 p-2 rounded">
                {execution?.error}
              </div>
            )}
          </div>
        ))}
      </div>

      {executionHistory?.length === 0 && (
        <div className="text-center py-8">
          <Icon name="History" size={32} className="text-muted-foreground mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">
            Nenhuma execução registrada
          </p>
        </div>
      )}
    </div>
  );

  if (isCollapsed) {
    return (
      <div className="w-12 bg-card border-l border-border flex flex-col items-center py-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggle}
          className="mb-4"
        >
          <Icon name="PanelRightOpen" size={20} />
        </Button>
        
        <div className="space-y-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setActiveTab('properties');
              onToggle();
            }}
          >
            <Icon name="Settings" size={20} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setActiveTab('workflow');
              onToggle();
            }}
          >
            <Icon name="Workflow" size={20} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setActiveTab('history');
              onToggle();
            }}
          >
            <Icon name="History" size={20} />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-80 bg-card border-l border-border flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">
            Propriedades
          </h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggle}
          >
            <Icon name="PanelRightClose" size={20} />
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1">
          <Button
            variant={activeTab === 'properties' ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab('properties')}
            className="flex-1"
          >
            <Icon name="Settings" size={14} className="mr-1" />
            Nó
          </Button>
          <Button
            variant={activeTab === 'workflow' ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab('workflow')}
            className="flex-1"
          >
            <Icon name="Workflow" size={14} className="mr-1" />
            Fluxo
          </Button>
          <Button
            variant={activeTab === 'history' ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab('history')}
            className="flex-1"
          >
            <Icon name="History" size={14} className="mr-1" />
            Histórico
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'properties' && renderNodeProperties()}
        {activeTab === 'workflow' && renderWorkflowSettings()}
        {activeTab === 'history' && renderExecutionHistory()}
      </div>
    </div>
  );
};

export default WorkflowProperties;