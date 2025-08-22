import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const WorkflowToolbar = ({
  workflow,
  onSave,
  onDeploy,
  onTest,
  onImport,
  onExport,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  isExecuting,
  isSaving,
  hasUnsavedChanges
}) => {
  const [showDeployModal, setShowDeployModal] = useState(false);
  const [selectedEnvironment, setSelectedEnvironment] = useState('development');

  const environmentOptions = [
    { value: 'development', label: 'Desenvolvimento' },
    { value: 'staging', label: 'Homologação' },
    { value: 'production', label: 'Produção' }
  ];

  const handleDeploy = () => {
    onDeploy(selectedEnvironment);
    setShowDeployModal(false);
  };

  const getWorkflowStatus = () => {
    if (isExecuting) return { text: 'Executando...', color: 'text-warning' };
    if (isSaving) return { text: 'Salvando...', color: 'text-primary' };
    if (hasUnsavedChanges) return { text: 'Não salvo', color: 'text-error' };
    return { text: 'Salvo', color: 'text-success' };
  };

  const status = getWorkflowStatus();

  return (
    <>
      <div className="bg-card border-b border-border px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Left Section - File Operations */}
          <div className="flex items-center space-x-2">
            <Button
              variant="default"
              size="sm"
              onClick={onSave}
              disabled={isSaving || !hasUnsavedChanges}
              loading={isSaving}
            >
              <Icon name="Save" size={16} className="mr-2" />
              Salvar
            </Button>

            <div className="w-px h-6 bg-border" />

            <Button
              variant="ghost"
              size="sm"
              onClick={onUndo}
              disabled={!canUndo}
            >
              <Icon name="Undo" size={16} />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={onRedo}
              disabled={!canRedo}
            >
              <Icon name="Redo" size={16} />
            </Button>

            <div className="w-px h-6 bg-border" />

            <Button
              variant="ghost"
              size="sm"
              onClick={onImport}
            >
              <Icon name="Upload" size={16} className="mr-2" />
              Importar
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={onExport}
            >
              <Icon name="Download" size={16} className="mr-2" />
              Exportar
            </Button>
          </div>

          {/* Center Section - Workflow Info */}
          <div className="flex items-center space-x-4">
            <div className="text-center">
              <h1 className="text-lg font-semibold text-foreground">
                {workflow?.name || 'Fluxo Sem Nome'}
              </h1>
              <div className="flex items-center justify-center space-x-2 text-sm">
                <span className={status?.color}>{status?.text}</span>
                <span className="text-muted-foreground">•</span>
                <span className="text-muted-foreground">
                  Ambiente: {workflow?.environment || 'development'}
                </span>
              </div>
            </div>
          </div>

          {/* Right Section - Execution Controls */}
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onTest}
              disabled={isExecuting}
            >
              <Icon name="Play" size={16} className="mr-2" />
              Testar
            </Button>

            <Button
              variant="default"
              size="sm"
              onClick={() => setShowDeployModal(true)}
              disabled={isExecuting || hasUnsavedChanges}
            >
              <Icon name="Rocket" size={16} className="mr-2" />
              Implantar
            </Button>

            {isExecuting && (
              <Button
                variant="destructive"
                size="sm"
                onClick={() => {/* Stop execution logic */}}
              >
                <Icon name="Square" size={16} className="mr-2" />
                Parar
              </Button>
            )}
          </div>
        </div>

        {/* Workflow Stats */}
        <div className="flex items-center justify-center mt-3 pt-3 border-t border-border">
          <div className="flex items-center space-x-6 text-sm text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Icon name="Box" size={14} />
              <span>{workflow?.nodeCount || 0} nós</span>
            </div>
            <div className="flex items-center space-x-1">
              <Icon name="ArrowRight" size={14} />
              <span>{workflow?.connectionCount || 0} conexões</span>
            </div>
            <div className="flex items-center space-x-1">
              <Icon name="Clock" size={14} />
              <span>
                Última modificação: {workflow?.lastModified ? 
                  new Date(workflow.lastModified)?.toLocaleString('pt-BR') : 
                  'Nunca'
                }
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <Icon name="User" size={14} />
              <span>Por: {workflow?.lastModifiedBy || 'Sistema'}</span>
            </div>
          </div>
        </div>
      </div>
      {/* Deploy Modal */}
      {showDeployModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card border border-border rounded-lg shadow-lg w-full max-w-md mx-4">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground">
                  Implantar Fluxo de Trabalho
                </h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowDeployModal(false)}
                >
                  <Icon name="X" size={20} />
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Selecione o ambiente onde deseja implantar este fluxo de trabalho.
                    Esta ação irá substituir a versão atual no ambiente selecionado.
                  </p>

                  <Select
                    label="Ambiente de Destino"
                    options={environmentOptions}
                    value={selectedEnvironment}
                    onChange={setSelectedEnvironment}
                  />
                </div>

                {/* Impact Assessment */}
                <div className="bg-warning/10 border border-warning/20 rounded-lg p-3">
                  <div className="flex items-start space-x-2">
                    <Icon name="AlertTriangle" size={16} className="text-warning mt-0.5" />
                    <div>
                      <h4 className="text-sm font-medium text-foreground mb-1">
                        Avaliação de Impacto
                      </h4>
                      <ul className="text-xs text-muted-foreground space-y-1">
                        <li>• Fluxos ativos serão interrompidos temporariamente</li>
                        <li>• Configurações existentes serão substituídas</li>
                        <li>• Backup automático será criado</li>
                        {selectedEnvironment === 'production' && (
                          <li className="text-error">• Ambiente de produção será afetado</li>
                        )}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Confirmation */}
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="confirmDeploy"
                    className="rounded border-border"
                  />
                  <label htmlFor="confirmDeploy" className="text-sm text-foreground">
                    Confirmo que entendo os impactos desta implantação
                  </label>
                </div>
              </div>

              <div className="flex justify-end space-x-2 mt-6">
                <Button
                  variant="ghost"
                  onClick={() => setShowDeployModal(false)}
                >
                  Cancelar
                </Button>
                <Button
                  variant={selectedEnvironment === 'production' ? 'destructive' : 'default'}
                  onClick={handleDeploy}
                >
                  <Icon name="Rocket" size={16} className="mr-2" />
                  Implantar em {environmentOptions?.find(e => e?.value === selectedEnvironment)?.label}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default WorkflowToolbar;