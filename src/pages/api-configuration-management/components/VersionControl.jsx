import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const VersionControl = ({ integration, onRestore, onViewDiff }) => {
  const [selectedVersion, setSelectedVersion] = useState(null);

  // Mock version history data
  const versionHistory = [
    {
      id: 'v1.2.1',
      version: '1.2.1',
      timestamp: '2025-01-22 15:30:00',
      author: 'João Silva',
      changes: [
        'Atualizado timeout para 45 segundos',
        'Adicionado header de autenticação personalizado',
        'Configurado retry automático'
      ],
      status: 'current',
      environment: 'production'
    },
    {
      id: 'v1.2.0',
      version: '1.2.0',
      timestamp: '2025-01-20 10:15:00',
      author: 'Maria Santos',
      changes: [
        'Implementado rate limiting',
        'Adicionado webhook de callback',
        'Melhorado tratamento de erros'
      ],
      status: 'deployed',
      environment: 'staging'
    },
    {
      id: 'v1.1.5',
      version: '1.1.5',
      timestamp: '2025-01-18 14:45:00',
      author: 'Carlos Oliveira',
      changes: [
        'Corrigido bug na validação de parâmetros',
        'Atualizada documentação da API',
        'Otimizado performance das requisições'
      ],
      status: 'archived',
      environment: 'development'
    },
    {
      id: 'v1.1.4',
      version: '1.1.4',
      timestamp: '2025-01-15 09:20:00',
      author: 'Ana Costa',
      changes: [
        'Adicionado suporte para novos endpoints',
        'Implementado cache de respostas',
        'Configurado monitoramento avançado'
      ],
      status: 'archived',
      environment: 'development'
    },
    {
      id: 'v1.1.3',
      version: '1.1.3',
      timestamp: '2025-01-12 16:10:00',
      author: 'Pedro Lima',
      changes: [
        'Primeira versão estável',
        'Configuração básica de endpoints',
        'Autenticação Bearer implementada'
      ],
      status: 'archived',
      environment: 'development'
    }
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'current': return 'CheckCircle';
      case 'deployed': return 'Rocket';
      case 'archived': return 'Archive';
      default: return 'Circle';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'current': return 'text-success';
      case 'deployed': return 'text-primary';
      case 'archived': return 'text-muted-foreground';
      default: return 'text-muted-foreground';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'current': return 'Atual';
      case 'deployed': return 'Implantado';
      case 'archived': return 'Arquivado';
      default: return 'Desconhecido';
    }
  };

  const getEnvironmentBadgeColor = (environment) => {
    switch (environment) {
      case 'production': return 'bg-error/10 text-error';
      case 'staging': return 'bg-warning/10 text-warning';
      case 'development': return 'bg-success/10 text-success';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const handleRestore = (version) => {
    if (window.confirm(`Tem certeza que deseja restaurar para a versão ${version?.version}? Esta ação não pode ser desfeita.`)) {
      onRestore(version);
    }
  };

  const handleViewDiff = (version) => {
    onViewDiff(version);
  };

  return (
    <div className="bg-card border border-border rounded-lg">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-foreground flex items-center">
              <Icon name="GitBranch" size={20} className="mr-2" />
              Controle de Versão
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Histórico de alterações e rollback de configurações
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              iconName="Download"
              iconPosition="left"
            >
              Exportar
            </Button>
            <Button
              variant="outline"
              size="sm"
              iconName="Upload"
              iconPosition="left"
            >
              Importar
            </Button>
          </div>
        </div>
      </div>
      {/* Version List */}
      <div className="divide-y divide-border">
        {versionHistory?.map((version, index) => (
          <div
            key={version?.id}
            className={`p-4 hover:bg-muted/30 transition-colors duration-150 ${
              selectedVersion?.id === version?.id ? 'bg-primary/5 border-l-4 border-l-primary' : ''
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                {/* Version Header */}
                <div className="flex items-center space-x-3 mb-2">
                  <div className="flex items-center space-x-2">
                    <Icon
                      name={getStatusIcon(version?.status)}
                      size={16}
                      className={getStatusColor(version?.status)}
                    />
                    <span className="font-semibold text-foreground">
                      v{version?.version}
                    </span>
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(version?.status)}`}>
                      {getStatusLabel(version?.status)}
                    </span>
                  </div>
                  
                  <span className={`px-2 py-1 text-xs rounded-full ${getEnvironmentBadgeColor(version?.environment)}`}>
                    {version?.environment === 'production' ? 'Produção' : 
                     version?.environment === 'staging' ? 'Homologação' : 'Desenvolvimento'}
                  </span>
                </div>

                {/* Version Info */}
                <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-3">
                  <div className="flex items-center space-x-1">
                    <Icon name="User" size={14} />
                    <span>{version?.author}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Icon name="Clock" size={14} />
                    <span>{version?.timestamp}</span>
                  </div>
                </div>

                {/* Changes List */}
                <div className="space-y-1">
                  {version?.changes?.map((change, changeIndex) => (
                    <div key={changeIndex} className="flex items-start space-x-2 text-sm">
                      <Icon name="GitCommit" size={14} className="text-muted-foreground mt-0.5 flex-shrink-0" />
                      <span className="text-foreground">{change}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-2 ml-4">
                <Button
                  variant="ghost"
                  size="sm"
                  iconName="Eye"
                  onClick={() => handleViewDiff(version)}
                >
                  Ver Diff
                </Button>
                
                {version?.status !== 'current' && (
                  <Button
                    variant="outline"
                    size="sm"
                    iconName="RotateCcw"
                    onClick={() => handleRestore(version)}
                  >
                    Restaurar
                  </Button>
                )}
                
                <Button
                  variant="ghost"
                  size="icon"
                  iconName="MoreVertical"
                  onClick={() => setSelectedVersion(selectedVersion?.id === version?.id ? null : version)}
                />
              </div>
            </div>

            {/* Expanded Actions */}
            {selectedVersion?.id === version?.id && (
              <div className="mt-4 pt-4 border-t border-border">
                <div className="flex items-center space-x-3">
                  <Button
                    variant="outline"
                    size="sm"
                    iconName="Download"
                    iconPosition="left"
                  >
                    Baixar Configuração
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    iconName="Copy"
                    iconPosition="left"
                  >
                    Duplicar Versão
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    iconName="Tag"
                    iconPosition="left"
                  >
                    Criar Tag
                  </Button>
                  {version?.status === 'archived' && (
                    <Button
                      variant="ghost"
                      size="sm"
                      iconName="Trash2"
                      className="text-error hover:text-error"
                    >
                      Excluir
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      {/* Footer */}
      <div className="p-4 border-t border-border bg-muted/30">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>{versionHistory?.length} versões no histórico</span>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 rounded-full bg-success"></div>
              <span>Atual</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 rounded-full bg-primary"></div>
              <span>Implantado</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 rounded-full bg-muted-foreground"></div>
              <span>Arquivado</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VersionControl;