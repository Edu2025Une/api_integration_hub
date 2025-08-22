import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const IntegrationList = ({ integrations, selectedIntegration, onSelectIntegration, onCreateNew }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [environmentFilter, setEnvironmentFilter] = useState('all');

  const statusOptions = [
    { value: 'all', label: 'Todos os Status' },
    { value: 'active', label: 'Ativo' },
    { value: 'inactive', label: 'Inativo' },
    { value: 'error', label: 'Erro' },
    { value: 'testing', label: 'Testando' }
  ];

  const environmentOptions = [
    { value: 'all', label: 'Todos os Ambientes' },
    { value: 'development', label: 'Desenvolvimento' },
    { value: 'staging', label: 'Homologação' },
    { value: 'production', label: 'Produção' }
  ];

  const filteredIntegrations = integrations?.filter(integration => {
    const matchesSearch = integration?.name?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
                         integration?.description?.toLowerCase()?.includes(searchTerm?.toLowerCase());
    const matchesStatus = statusFilter === 'all' || integration?.status === statusFilter;
    const matchesEnvironment = environmentFilter === 'all' || integration?.environment === environmentFilter;
    
    return matchesSearch && matchesStatus && matchesEnvironment;
  });

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active': return 'CheckCircle';
      case 'inactive': return 'Circle';
      case 'error': return 'XCircle';
      case 'testing': return 'Clock';
      default: return 'Circle';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-success';
      case 'inactive': return 'text-muted-foreground';
      case 'error': return 'text-error';
      case 'testing': return 'text-warning';
      default: return 'text-muted-foreground';
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

  return (
    <div className="h-full flex flex-col bg-card border-r border-border">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">Integrações</h2>
          <Button
            variant="default"
            size="sm"
            iconName="Plus"
            iconPosition="left"
            onClick={onCreateNew}
          >
            Nova
          </Button>
        </div>

        {/* Search */}
        <Input
          type="search"
          placeholder="Buscar integrações..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e?.target?.value)}
          className="mb-3"
        />

        {/* Filters */}
        <div className="space-y-3">
          <Select
            placeholder="Filtrar por status"
            options={statusOptions}
            value={statusFilter}
            onChange={setStatusFilter}
          />
          
          <Select
            placeholder="Filtrar por ambiente"
            options={environmentOptions}
            value={environmentFilter}
            onChange={setEnvironmentFilter}
          />
        </div>
      </div>
      {/* Integration List */}
      <div className="flex-1 overflow-y-auto">
        {filteredIntegrations?.length === 0 ? (
          <div className="p-4 text-center">
            <Icon name="Search" size={48} className="mx-auto mb-3 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              {searchTerm || statusFilter !== 'all' || environmentFilter !== 'all' ?'Nenhuma integração encontrada com os filtros aplicados' :'Nenhuma integração configurada'
              }
            </p>
          </div>
        ) : (
          <div className="p-2">
            {filteredIntegrations?.map((integration) => (
              <div
                key={integration?.id}
                onClick={() => onSelectIntegration(integration)}
                className={`p-3 mb-2 rounded-lg border cursor-pointer transition-all duration-150 hover:shadow-sm ${
                  selectedIntegration?.id === integration?.id
                    ? 'bg-primary/10 border-primary' :'bg-background border-border hover:bg-muted/50'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <Icon
                      name={getStatusIcon(integration?.status)}
                      size={16}
                      className={getStatusColor(integration?.status)}
                    />
                    <h3 className="font-medium text-foreground text-sm truncate">
                      {integration?.name}
                    </h3>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${getEnvironmentBadgeColor(integration?.environment)}`}>
                    {integration?.environment === 'production' ? 'Prod' : 
                     integration?.environment === 'staging' ? 'Homol' : 'Dev'}
                  </span>
                </div>

                <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                  {integration?.description}
                </p>

                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{integration?.method} • {integration?.endpoint?.split('/')?.[2]}</span>
                  <span>v{integration?.version}</span>
                </div>

                {integration?.lastTested && (
                  <div className="mt-2 pt-2 border-t border-border">
                    <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                      <Icon name="Clock" size={12} />
                      <span>Testado: {integration?.lastTested}</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      {/* Footer Stats */}
      <div className="p-4 border-t border-border bg-muted/30">
        <div className="text-xs text-muted-foreground text-center">
          {filteredIntegrations?.length} de {integrations?.length} integrações
        </div>
      </div>
    </div>
  );
};

export default IntegrationList;