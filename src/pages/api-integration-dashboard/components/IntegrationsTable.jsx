import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const IntegrationsTable = () => {
  const [integrations, setIntegrations] = useState([]);
  const [filteredIntegrations, setFilteredIntegrations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });
  const [isLoading, setIsLoading] = useState(true);

  // Mock integrations data
  useEffect(() => {
    const mockIntegrations = [
      {
        id: 1,
        name: 'Sistema de Pagamentos',
        endpoint: 'https://api.pagamentos.com.br/v2',
        status: 'connected',
        lastActivity: new Date(Date.now() - 300000),
        responseTime: 145,
        requests: 2847,
        errorRate: 0.2,
        version: 'v2.1',
        environment: 'production'
      },
      {
        id: 2,
        name: 'API de Autenticação',
        endpoint: 'https://auth.empresa.com.br/api',
        status: 'warning',
        lastActivity: new Date(Date.now() - 900000),
        responseTime: 234,
        requests: 1523,
        errorRate: 1.8,
        version: 'v1.5',
        environment: 'production'
      },
      {
        id: 3,
        name: 'Serviço de Notificações',
        endpoint: 'https://notifications.app.com.br/v1',
        status: 'connected',
        lastActivity: new Date(Date.now() - 120000),
        responseTime: 89,
        requests: 5621,
        errorRate: 0.1,
        version: 'v1.2',
        environment: 'production'
      },
      {
        id: 4,
        name: 'API de Relatórios',
        endpoint: 'https://reports.sistema.com.br/api',
        status: 'error',
        lastActivity: new Date(Date.now() - 1800000),
        responseTime: 0,
        requests: 0,
        errorRate: 100,
        version: 'v3.0',
        environment: 'staging'
      },
      {
        id: 5,
        name: 'Integração CRM',
        endpoint: 'https://crm.vendas.com.br/webhook',
        status: 'connected',
        lastActivity: new Date(Date.now() - 600000),
        responseTime: 178,
        requests: 892,
        errorRate: 0.5,
        version: 'v2.3',
        environment: 'production'
      }
    ];

    setTimeout(() => {
      setIntegrations(mockIntegrations);
      setFilteredIntegrations(mockIntegrations);
      setIsLoading(false);
    }, 800);
  }, []);

  // Search functionality
  useEffect(() => {
    const filtered = integrations?.filter(integration =>
      integration?.name?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
      integration?.endpoint?.toLowerCase()?.includes(searchTerm?.toLowerCase())
    );
    setFilteredIntegrations(filtered);
  }, [searchTerm, integrations]);

  // Sorting functionality
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig?.key === key && sortConfig?.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });

    const sorted = [...filteredIntegrations]?.sort((a, b) => {
      if (a?.[key] < b?.[key]) return direction === 'asc' ? -1 : 1;
      if (a?.[key] > b?.[key]) return direction === 'asc' ? 1 : -1;
      return 0;
    });
    setFilteredIntegrations(sorted);
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case 'connected':
        return {
          icon: 'CheckCircle',
          color: 'text-success',
          bgColor: 'bg-success/10',
          label: 'Conectado'
        };
      case 'warning':
        return {
          icon: 'AlertTriangle',
          color: 'text-warning',
          bgColor: 'bg-warning/10',
          label: 'Atenção'
        };
      case 'error':
        return {
          icon: 'XCircle',
          color: 'text-error',
          bgColor: 'bg-error/10',
          label: 'Erro'
        };
      default:
        return {
          icon: 'Circle',
          color: 'text-muted-foreground',
          bgColor: 'bg-muted',
          label: 'Desconhecido'
        };
    }
  };

  const formatLastActivity = (date) => {
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    
    if (minutes < 60) {
      return `${minutes} min atrás`;
    } else if (hours < 24) {
      return `${hours}h atrás`;
    } else {
      return date?.toLocaleDateString('pt-BR');
    }
  };

  const handleTestConnection = (integration) => {
    console.log('Testing connection for:', integration?.name);
    // Mock test implementation
  };

  const handleEditIntegration = (integration) => {
    console.log('Editing integration:', integration?.name);
    // Navigate to edit page
  };

  const handleViewMonitoring = (integration) => {
    console.log('Viewing monitoring for:', integration?.name);
    // Navigate to monitoring page
  };

  if (isLoading) {
    return (
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center space-x-2 text-muted-foreground">
            <Icon name="Loader2" size={20} className="animate-spin" />
            <span>Carregando integrações...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg">
      <div className="p-6 border-b border-border">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Integrações Ativas</h3>
            <p className="text-sm text-muted-foreground">
              {filteredIntegrations?.length} de {integrations?.length} integrações
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Input
                type="search"
                placeholder="Buscar integrações..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e?.target?.value)}
                className="w-64"
              />
              <Icon 
                name="Search" 
                size={16} 
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground pointer-events-none" 
              />
            </div>
            
            <Button variant="outline" iconName="Plus" iconPosition="left">
              Nova Integração
            </Button>
          </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                <button
                  onClick={() => handleSort('name')}
                  className="flex items-center space-x-1 hover:text-foreground transition-colors"
                >
                  <span>Nome</span>
                  <Icon name="ArrowUpDown" size={14} />
                </button>
              </th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Status</th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                <button
                  onClick={() => handleSort('lastActivity')}
                  className="flex items-center space-x-1 hover:text-foreground transition-colors"
                >
                  <span>Última Atividade</span>
                  <Icon name="ArrowUpDown" size={14} />
                </button>
              </th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Performance</th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Ambiente</th>
              <th className="text-right p-4 text-sm font-medium text-muted-foreground">Ações</th>
            </tr>
          </thead>
          <tbody>
            {filteredIntegrations?.map((integration) => {
              const statusConfig = getStatusConfig(integration?.status);
              return (
                <tr key={integration?.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                  <td className="p-4">
                    <div className="space-y-1">
                      <p className="font-medium text-foreground">{integration?.name}</p>
                      <p className="text-xs text-muted-foreground font-mono">{integration?.endpoint}</p>
                      <p className="text-xs text-muted-foreground">Versão {integration?.version}</p>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className={`inline-flex items-center space-x-2 px-2 py-1 rounded-md ${statusConfig?.bgColor}`}>
                      <Icon name={statusConfig?.icon} size={14} className={statusConfig?.color} />
                      <span className={`text-xs font-medium ${statusConfig?.color}`}>
                        {statusConfig?.label}
                      </span>
                    </div>
                  </td>
                  <td className="p-4">
                    <p className="text-sm text-foreground">{formatLastActivity(integration?.lastActivity)}</p>
                  </td>
                  <td className="p-4">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-muted-foreground">Tempo:</span>
                        <span className="text-xs font-mono text-foreground">{integration?.responseTime}ms</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-muted-foreground">Erro:</span>
                        <span className={`text-xs font-mono ${
                          integration?.errorRate > 1 ? 'text-error' : 'text-success'
                        }`}>
                          {integration?.errorRate}%
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-muted-foreground">Req:</span>
                        <span className="text-xs font-mono text-foreground">
                          {integration?.requests?.toLocaleString('pt-BR')}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-md ${
                      integration?.environment === 'production' ?'bg-success/10 text-success' :'bg-warning/10 text-warning'
                    }`}>
                      {integration?.environment === 'production' ? 'Produção' : 'Staging'}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        iconName="Play"
                        onClick={() => handleTestConnection(integration)}
                      >
                        Testar
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        iconName="Settings"
                        onClick={() => handleEditIntegration(integration)}
                      >
                        Editar
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        iconName="BarChart3"
                        onClick={() => handleViewMonitoring(integration)}
                      >
                        Monitor
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {filteredIntegrations?.length === 0 && !isLoading && (
        <div className="p-8 text-center">
          <Icon name="Search" size={48} className="mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">
            {searchTerm ? 'Nenhuma integração encontrada para sua busca.' : 'Nenhuma integração configurada.'}
          </p>
        </div>
      )}
    </div>
  );
};

export default IntegrationsTable;