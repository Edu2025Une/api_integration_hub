import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ActivityFeed = () => {
  const [activities, setActivities] = useState([]);
  const [filter, setFilter] = useState('all');
  const [isAutoScroll, setIsAutoScroll] = useState(true);

  const activityTypes = [
    { value: 'all', label: 'Todas', count: 0 },
    { value: 'success', label: 'Sucesso', count: 0 },
    { value: 'warning', label: 'Avisos', count: 0 },
    { value: 'error', label: 'Erros', count: 0 },
    { value: 'info', label: 'Info', count: 0 }
  ];

  const generateActivity = () => {
    const types = ['success', 'warning', 'error', 'info'];
    const endpoints = [
      '/api/users',
      '/api/orders',
      '/api/products',
      '/api/payments',
      '/api/notifications',
      '/api/analytics',
      '/api/reports',
      '/api/auth/login'
    ];
    
    const messages = {
      success: [
        'Requisição processada com sucesso',
        'Conexão estabelecida',
        'Dados sincronizados',
        'Cache atualizado',
        'Backup concluído'
      ],
      warning: [
        'Taxa de requisições elevada detectada',
        'Tempo de resposta acima do limite',
        'Cache próximo do limite',
        'Conexão instável detectada',
        'Limite de rate limiting atingido'
      ],
      error: [
        'Falha na conexão com o banco de dados',
        'Timeout na requisição',
        'Erro de autenticação',
        'Serviço indisponível',
        'Falha na validação de dados'
      ],
      info: [
        'Nova versão da API disponível',
        'Manutenção programada iniciada',
        'Configuração atualizada',
        'Novo endpoint registrado',
        'Monitoramento iniciado'
      ]
    };

    const type = types?.[Math.floor(Math.random() * types?.length)];
    const endpoint = endpoints?.[Math.floor(Math.random() * endpoints?.length)];
    const message = messages?.[type]?.[Math.floor(Math.random() * messages?.[type]?.length)];
    
    return {
      id: Date.now() + Math.random(),
      type,
      endpoint,
      message,
      timestamp: new Date(),
      responseTime: Math.floor(Math.random() * 500) + 50,
      statusCode: type === 'success' ? 200 : type === 'error' ? 500 : 429,
      method: ['GET', 'POST', 'PUT', 'DELETE']?.[Math.floor(Math.random() * 4)]
    };
  };

  useEffect(() => {
    // Initialize with some activities
    const initialActivities = Array.from({ length: 10 }, () => generateActivity());
    setActivities(initialActivities);

    // Add new activities periodically
    const interval = setInterval(() => {
      const newActivity = generateActivity();
      setActivities(prev => [newActivity, ...prev?.slice(0, 49)]); // Keep only 50 activities
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const getActivityIcon = (type) => {
    switch (type) {
      case 'success': return 'CheckCircle';
      case 'warning': return 'AlertTriangle';
      case 'error': return 'XCircle';
      case 'info': return 'Info';
      default: return 'Circle';
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'success': return 'text-success';
      case 'warning': return 'text-warning';
      case 'error': return 'text-error';
      case 'info': return 'text-primary';
      default: return 'text-muted-foreground';
    }
  };

  const getStatusCodeColor = (code) => {
    if (code >= 200 && code < 300) return 'text-success';
    if (code >= 400 && code < 500) return 'text-warning';
    if (code >= 500) return 'text-error';
    return 'text-muted-foreground';
  };

  const getMethodColor = (method) => {
    switch (method) {
      case 'GET': return 'bg-blue-100 text-blue-800';
      case 'POST': return 'bg-green-100 text-green-800';
      case 'PUT': return 'bg-yellow-100 text-yellow-800';
      case 'DELETE': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredActivities = filter === 'all' 
    ? activities 
    : activities?.filter(activity => activity?.type === filter);

  const getFilterCounts = () => {
    const counts = activities?.reduce((acc, activity) => {
      acc[activity.type] = (acc?.[activity?.type] || 0) + 1;
      return acc;
    }, {});
    
    return activityTypes?.map(type => ({
      ...type,
      count: type?.value === 'all' ? activities?.length : (counts?.[type?.value] || 0)
    }));
  };

  const filterCounts = getFilterCounts();

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Icon name="Activity" size={20} className="text-primary" />
          <h2 className="text-lg font-semibold text-foreground">
            Feed de Atividades
          </h2>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
            <span className="text-sm text-muted-foreground">Ao vivo</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant={isAutoScroll ? "default" : "outline"}
            size="sm"
            onClick={() => setIsAutoScroll(!isAutoScroll)}
            iconName={isAutoScroll ? "Pause" : "Play"}
            iconPosition="left"
          >
            {isAutoScroll ? 'Pausar' : 'Retomar'}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setActivities([])}
            iconName="Trash2"
            iconPosition="left"
          >
            Limpar
          </Button>
        </div>
      </div>
      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {filterCounts?.map((type) => (
          <button
            key={type?.value}
            onClick={() => setFilter(type?.value)}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors duration-150 ${
              filter === type?.value
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground'
            }`}
          >
            <span>{type?.label}</span>
            <span className={`px-1.5 py-0.5 rounded-full text-xs ${
              filter === type?.value
                ? 'bg-primary-foreground/20 text-primary-foreground'
                : 'bg-background text-muted-foreground'
            }`}>
              {type?.count}
            </span>
          </button>
        ))}
      </div>
      {/* Activity List */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {filteredActivities?.length === 0 ? (
          <div className="text-center py-8">
            <Icon name="Activity" size={48} className="text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">Nenhuma atividade encontrada</p>
          </div>
        ) : (
          filteredActivities?.map((activity) => (
            <div
              key={activity?.id}
              className="flex items-start space-x-3 p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors duration-150"
            >
              <div className={`flex-shrink-0 w-8 h-8 rounded-full bg-background flex items-center justify-center ${getActivityColor(activity?.type)}`}>
                <Icon name={getActivityIcon(activity?.type)} size={16} />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${getMethodColor(activity?.method)}`}>
                    {activity?.method}
                  </span>
                  <code className="text-xs font-mono text-foreground bg-background px-2 py-0.5 rounded">
                    {activity?.endpoint}
                  </code>
                  <span className={`text-xs font-medium ${getStatusCodeColor(activity?.statusCode)}`}>
                    {activity?.statusCode}
                  </span>
                </div>
                
                <p className="text-sm text-foreground mb-2">
                  {activity?.message}
                </p>
                
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>
                    {activity?.timestamp?.toLocaleString('pt-BR', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit'
                    })}
                  </span>
                  <span className="font-mono">
                    {activity?.responseTime}ms
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      {filteredActivities?.length > 0 && (
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>
              Mostrando {filteredActivities?.length} de {activities?.length} atividades
            </span>
            <span>
              Última atualização: {new Date()?.toLocaleTimeString('pt-BR')}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActivityFeed;