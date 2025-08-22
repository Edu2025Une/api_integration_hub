import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const DeploymentModal = ({ isOpen, onClose, integration, onDeploy }) => {
  const [deploymentConfig, setDeploymentConfig] = useState({
    targetEnvironment: 'staging',
    createBackup: true,
    runTests: true,
    notifyTeam: true,
    rollbackOnFailure: true,
    deploymentNotes: ''
  });

  const [isDeploying, setIsDeploying] = useState(false);
  const [deploymentStep, setDeploymentStep] = useState(0);

  const environmentOptions = [
    { value: 'development', label: 'Desenvolvimento' },
    { value: 'staging', label: 'Homologação' },
    { value: 'production', label: 'Produção' }
  ];

  const deploymentSteps = [
    { label: 'Validando configuração', icon: 'CheckCircle' },
    { label: 'Criando backup', icon: 'Archive' },
    { label: 'Executando testes', icon: 'TestTube' },
    { label: 'Implantando alterações', icon: 'Rocket' },
    { label: 'Verificando saúde', icon: 'Activity' },
    { label: 'Notificando equipe', icon: 'Bell' }
  ];

  const impactAnalysis = {
    affectedEndpoints: 3,
    estimatedDowntime: '< 30 segundos',
    dependentServices: ['Sistema de Pagamentos', 'API de Notificações'],
    riskLevel: deploymentConfig?.targetEnvironment === 'production' ? 'Alto' : 'Médio'
  };

  const handleDeploy = async () => {
    setIsDeploying(true);
    setDeploymentStep(0);

    // Simulate deployment steps
    for (let i = 0; i < deploymentSteps?.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setDeploymentStep(i + 1);
    }

    // Complete deployment
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    onDeploy({
      ...integration,
      environment: deploymentConfig?.targetEnvironment,
      deployedAt: new Date()?.toISOString(),
      deployedBy: 'Usuário Atual',
      version: `${integration?.version}.${Date.now()?.toString()?.slice(-3)}`
    });

    setIsDeploying(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      {/* Modal */}
      <div className="relative bg-card border border-border rounded-lg shadow-lg w-full max-w-2xl mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-foreground flex items-center">
                <Icon name="Rocket" size={24} className="mr-2 text-primary" />
                Implantar Configuração
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                {integration?.name} - v{integration?.version}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              disabled={isDeploying}
            >
              <Icon name="X" size={20} />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {!isDeploying ? (
            <div className="space-y-6">
              {/* Deployment Configuration */}
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  Configuração da Implantação
                </h3>
                
                <div className="space-y-4">
                  <Select
                    label="Ambiente de Destino"
                    options={environmentOptions}
                    value={deploymentConfig?.targetEnvironment}
                    onChange={(value) => setDeploymentConfig(prev => ({ ...prev, targetEnvironment: value }))}
                  />

                  <div className="space-y-3">
                    <Checkbox
                      label="Criar backup antes da implantação"
                      description="Permite rollback rápido em caso de problemas"
                      checked={deploymentConfig?.createBackup}
                      onChange={(e) => setDeploymentConfig(prev => ({ ...prev, createBackup: e?.target?.checked }))}
                    />
                    
                    <Checkbox
                      label="Executar testes automatizados"
                      description="Valida a configuração antes da implantação"
                      checked={deploymentConfig?.runTests}
                      onChange={(e) => setDeploymentConfig(prev => ({ ...prev, runTests: e?.target?.checked }))}
                    />
                    
                    <Checkbox
                      label="Notificar equipe"
                      description="Envia notificação sobre a implantação"
                      checked={deploymentConfig?.notifyTeam}
                      onChange={(e) => setDeploymentConfig(prev => ({ ...prev, notifyTeam: e?.target?.checked }))}
                    />
                    
                    <Checkbox
                      label="Rollback automático em caso de falha"
                      description="Reverte automaticamente se a implantação falhar"
                      checked={deploymentConfig?.rollbackOnFailure}
                      onChange={(e) => setDeploymentConfig(prev => ({ ...prev, rollbackOnFailure: e?.target?.checked }))}
                    />
                  </div>
                </div>
              </div>

              {/* Impact Analysis */}
              <div className="bg-muted/30 border border-border rounded-lg p-4">
                <h4 className="font-semibold text-foreground mb-3 flex items-center">
                  <Icon name="AlertTriangle" size={18} className="mr-2 text-warning" />
                  Análise de Impacto
                </h4>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Endpoints Afetados:</span>
                    <span className="ml-2 font-medium text-foreground">{impactAnalysis?.affectedEndpoints}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Downtime Estimado:</span>
                    <span className="ml-2 font-medium text-foreground">{impactAnalysis?.estimatedDowntime}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-muted-foreground">Serviços Dependentes:</span>
                    <div className="mt-1">
                      {impactAnalysis?.dependentServices?.map((service, index) => (
                        <span key={index} className="inline-block bg-primary/10 text-primary px-2 py-1 text-xs rounded-full mr-2 mb-1">
                          {service}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Nível de Risco:</span>
                    <span className={`ml-2 font-medium ${
                      impactAnalysis?.riskLevel === 'Alto' ? 'text-error' : 
                      impactAnalysis?.riskLevel === 'Médio' ? 'text-warning' : 'text-success'
                    }`}>
                      {impactAnalysis?.riskLevel}
                    </span>
                  </div>
                </div>
              </div>

              {/* Warning for Production */}
              {deploymentConfig?.targetEnvironment === 'production' && (
                <div className="bg-error/10 border border-error/20 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <Icon name="AlertTriangle" size={20} className="text-error flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-error mb-1">Atenção: Implantação em Produção</h4>
                      <p className="text-sm text-error/80">
                        Esta implantação afetará o ambiente de produção. Certifique-se de que todas as validações foram realizadas e que a equipe foi notificada.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Deployment Progress */
            (<div className="space-y-6">
              <div className="text-center">
                <Icon name="Rocket" size={48} className="mx-auto mb-4 text-primary animate-pulse" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Implantando Configuração
                </h3>
                <p className="text-sm text-muted-foreground">
                  Por favor, aguarde enquanto a configuração é implantada...
                </p>
              </div>
              <div className="space-y-3">
                {deploymentSteps?.map((step, index) => (
                  <div
                    key={index}
                    className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-300 ${
                      index < deploymentStep ? 'bg-success/10 border border-success/20' :
                      index === deploymentStep ? 'bg-primary/10 border border-primary/20': 'bg-muted/30 border border-border'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      index < deploymentStep ? 'bg-success text-success-foreground' :
                      index === deploymentStep ? 'bg-primary text-primary-foreground': 'bg-muted text-muted-foreground'
                    }`}>
                      {index < deploymentStep ? (
                        <Icon name="Check" size={16} />
                      ) : index === deploymentStep ? (
                        <Icon name="Loader2" size={16} className="animate-spin" />
                      ) : (
                        <Icon name={step?.icon} size={16} />
                      )}
                    </div>
                    <span className={`font-medium ${
                      index < deploymentStep ? 'text-success' :
                      index === deploymentStep ? 'text-primary': 'text-muted-foreground'
                    }`}>
                      {step?.label}
                    </span>
                  </div>
                ))}
              </div>
              <div className="bg-muted/30 border border-border rounded-lg p-4">
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Icon name="Info" size={16} />
                  <span>
                    Progresso: {deploymentStep} de {deploymentSteps?.length} etapas concluídas
                  </span>
                </div>
              </div>
            </div>)
          )}
        </div>

        {/* Footer */}
        {!isDeploying && (
          <div className="p-6 border-t border-border">
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                A implantação pode levar alguns minutos para ser concluída
              </div>
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  onClick={onClose}
                >
                  Cancelar
                </Button>
                <Button
                  variant="default"
                  iconName="Rocket"
                  iconPosition="left"
                  onClick={handleDeploy}
                >
                  Iniciar Implantação
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeploymentModal;