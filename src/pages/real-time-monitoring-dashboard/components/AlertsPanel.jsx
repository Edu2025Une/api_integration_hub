import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AlertsPanel = () => {
  const [alerts, setAlerts] = useState([]);
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [alertFilter, setAlertFilter] = useState('active');

  const alertSeverities = ['critical', 'high', 'medium', 'low'];
  const alertStatuses = ['active', 'acknowledged', 'resolved'];

  const generateAlert = () => {
    const severities = ['critical', 'high', 'medium', 'low'];
    const types = [
      'API Response Time',
      'Error Rate Spike',
      'Connection Failure',
      'Rate Limit Exceeded',
      'Service Unavailable',
      'Database Connection',
      'Memory Usage',
      'Disk Space'
    ];
    
    const descriptions = {
      'API Response Time': 'Tempo de resposta da API excedeu o limite de 500ms',
      'Error Rate Spike': 'Taxa de erro aumentou para mais de 5% nas últimas 10 minutos',
      'Connection Failure': 'Falha na conexão com o serviço externo',
      'Rate Limit Exceeded': 'Limite de requisições por minuto foi excedido',
      'Service Unavailable': 'Serviço não está respondendo às requisições',
      'Database Connection': 'Problemas de conectividade com o banco de dados',
      'Memory Usage': 'Uso de memória acima de 85%',
      'Disk Space': 'Espaço em disco abaixo de 10%'
    };

    const endpoints = [
      '/api/users',
      '/api/orders',
      '/api/payments',
      '/api/products',
      '/api/analytics'
    ];

    const severity = severities?.[Math.floor(Math.random() * severities?.length)];
    const type = types?.[Math.floor(Math.random() * types?.length)];
    const endpoint = endpoints?.[Math.floor(Math.random() * endpoints?.length)];

    return {
      id: Date.now() + Math.random(),
      severity,
      type,
      description: descriptions?.[type],
      endpoint,
      status: 'active',
      timestamp: new Date(),
      escalationLevel: Math.floor(Math.random() * 3) + 1,
      affectedUsers: Math.floor(Math.random() * 1000) + 10,
      duration: Math.floor(Math.random() * 3600) + 60, // seconds
      actions: [
        'Reiniciar serviço',
        'Verificar logs',
        'Escalar para equipe',
        'Aplicar correção automática'
      ]
    };
  };

  useEffect(() => {
    // Initialize with some alerts
    const initialAlerts = Array.from({ length: 8 }, () => generateAlert());
    setAlerts(initialAlerts);

    // Add new alerts periodically
    const interval = setInterval(() => {
      if (Math.random() > 0.7) { // 30% chance of new alert
        const newAlert = generateAlert();
        setAlerts(prev => [newAlert, ...prev?.slice(0, 19)]); // Keep only 20 alerts
      }
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'critical': return 'AlertTriangle';
      case 'high': return 'AlertCircle';
      case 'medium': return 'Info';
      case 'low': return 'Bell';
      default: return 'Circle';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-error';
      case 'acknowledged': return 'text-warning';
      case 'resolved': return 'text-success';
      default: return 'text-muted-foreground';
    }
  };

  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const handleAlertAction = (alertId, action) => {
    setAlerts(prev => prev?.map(alert => 
      alert?.id === alertId 
        ? { ...alert, status: action === 'resolve' ? 'resolved' : 'acknowledged' }
        : alert
    ));
    
    if (selectedAlert && selectedAlert?.id === alertId) {
      setSelectedAlert(prev => ({ 
        ...prev, 
        status: action === 'resolve' ? 'resolved' : 'acknowledged' 
      }));
    }
  };

  const filteredAlerts = alerts?.filter(alert => {
    if (alertFilter === 'all') return true;
    return alert?.status === alertFilter;
  });

  const getAlertCounts = () => {
    return {
      active: alerts?.filter(a => a?.status === 'active')?.length,
      acknowledged: alerts?.filter(a => a?.status === 'acknowledged')?.length,
      resolved: alerts?.filter(a => a?.status === 'resolved')?.length,
      all: alerts?.length
    };
  };

  const counts = getAlertCounts();

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Icon name="Bell" size={20} className="text-primary" />
          <h2 className="text-lg font-semibold text-foreground">
            Alertas Ativos
          </h2>
          {counts?.active > 0 && (
            <span className="bg-error text-error-foreground text-xs px-2 py-1 rounded-full font-medium">
              {counts?.active}
            </span>
          )}
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => setAlerts([])}
          iconName="X"
          iconPosition="left"
        >
          Limpar Todos
        </Button>
      </div>
      {/* Filter Tabs */}
      <div className="flex space-x-1 bg-muted rounded-lg p-1 mb-6">
        {[
          { value: 'active', label: 'Ativos', count: counts?.active },
          { value: 'acknowledged', label: 'Reconhecidos', count: counts?.acknowledged },
          { value: 'resolved', label: 'Resolvidos', count: counts?.resolved },
          { value: 'all', label: 'Todos', count: counts?.all }
        ]?.map((filter) => (
          <button
            key={filter?.value}
            onClick={() => setAlertFilter(filter?.value)}
            className={`flex items-center space-x-2 px-3 py-1.5 text-xs font-medium rounded-md transition-colors duration-150 ${
              alertFilter === filter?.value
                ? 'bg-card text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <span>{filter?.label}</span>
            <span className="bg-background text-muted-foreground px-1.5 py-0.5 rounded-full">
              {filter?.count}
            </span>
          </button>
        ))}
      </div>
      {/* Alerts List */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {filteredAlerts?.length === 0 ? (
          <div className="text-center py-8">
            <Icon name="CheckCircle" size={48} className="text-success mx-auto mb-3" />
            <p className="text-muted-foreground">Nenhum alerta encontrado</p>
          </div>
        ) : (
          filteredAlerts?.map((alert) => (
            <div
              key={alert?.id}
              className={`border rounded-lg p-4 cursor-pointer transition-all duration-150 hover:shadow-md ${
                selectedAlert?.id === alert?.id ? 'ring-2 ring-primary' : ''
              } ${getSeverityColor(alert?.severity)}`}
              onClick={() => setSelectedAlert(alert)}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <Icon 
                    name={getSeverityIcon(alert?.severity)} 
                    size={20} 
                    className={alert?.severity === 'critical' ? 'text-red-600' : 
                              alert?.severity === 'high' ? 'text-orange-600' :
                              alert?.severity === 'medium' ? 'text-yellow-600' : 'text-blue-600'}
                  />
                  <div>
                    <h3 className="font-semibold text-foreground text-sm">
                      {alert?.type}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {alert?.endpoint}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <span className={`text-xs font-medium ${getStatusColor(alert?.status)}`}>
                    {alert?.status === 'active' ? 'Ativo' :
                     alert?.status === 'acknowledged' ? 'Reconhecido' : 'Resolvido'}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {formatDuration(alert?.duration)}
                  </span>
                </div>
              </div>
              
              <p className="text-sm text-foreground mb-3">
                {alert?.description}
              </p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                  <span>Usuários afetados: {alert?.affectedUsers?.toLocaleString('pt-BR')}</span>
                  <span>Nível: {alert?.escalationLevel}</span>
                </div>
                
                {alert?.status === 'active' && (
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="xs"
                      onClick={(e) => {
                        e?.stopPropagation();
                        handleAlertAction(alert?.id, 'acknowledge');
                      }}
                    >
                      Reconhecer
                    </Button>
                    <Button
                      variant="default"
                      size="xs"
                      onClick={(e) => {
                        e?.stopPropagation();
                        handleAlertAction(alert?.id, 'resolve');
                      }}
                    >
                      Resolver
                    </Button>
                  </div>
                )}
              </div>
              
              <div className="mt-3 pt-3 border-t border-border/50">
                <p className="text-xs text-muted-foreground">
                  {alert?.timestamp?.toLocaleString('pt-BR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
      {/* Alert Details Modal */}
      {selectedAlert && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-lg p-6 max-w-md w-full max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">
                Detalhes do Alerta
              </h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSelectedAlert(null)}
              >
                <Icon name="X" size={20} />
              </Button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Tipo</label>
                <p className="text-foreground">{selectedAlert?.type}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-muted-foreground">Descrição</label>
                <p className="text-foreground">{selectedAlert?.description}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-muted-foreground">Endpoint</label>
                <code className="block bg-muted p-2 rounded text-sm font-mono">
                  {selectedAlert?.endpoint}
                </code>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Severidade</label>
                  <p className="text-foreground capitalize">{selectedAlert?.severity}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Status</label>
                  <p className={`capitalize ${getStatusColor(selectedAlert?.status)}`}>
                    {selectedAlert?.status === 'active' ? 'Ativo' :
                     selectedAlert?.status === 'acknowledged' ? 'Reconhecido' : 'Resolvido'}
                  </p>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-muted-foreground">Ações Sugeridas</label>
                <div className="space-y-2 mt-2">
                  {selectedAlert?.actions?.map((action, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className="w-full justify-start"
                      iconName="Play"
                      iconPosition="left"
                    >
                      {action}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AlertsPanel;