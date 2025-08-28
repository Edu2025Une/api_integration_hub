import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AlertsPanel = () => {
  const [alerts, setAlerts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    setTimeout(() => {
      setAlerts([]);
      setIsLoading(false);
    }, 600);
  }, []);

  const getAlertConfig = (type) => {
    switch (type) {
      case 'error':
        return {
          icon: 'AlertCircle',
          color: 'text-error',
          bgColor: 'bg-error/10',
          borderColor: 'border-error/20'
        };
      case 'warning':
        return {
          icon: 'AlertTriangle',
          color: 'text-warning',
          bgColor: 'bg-warning/10',
          borderColor: 'border-warning/20'
        };
      case 'info':
        return {
          icon: 'Info',
          color: 'text-primary',
          bgColor: 'bg-primary/10',
          borderColor: 'border-primary/20'
        };
      case 'success':
        return {
          icon: 'CheckCircle',
          color: 'text-success',
          bgColor: 'bg-success/10',
          borderColor: 'border-success/20'
        };
      default:
        return {
          icon: 'Bell',
          color: 'text-muted-foreground',
          bgColor: 'bg-muted',
          borderColor: 'border-border'
        };
    }
  };

  const getSeverityBadge = (severity) => {
    switch (severity) {
      case 'high':
        return 'bg-error text-error-foreground';
      case 'medium':
        return 'bg-warning text-warning-foreground';
      case 'low':
        return 'bg-muted text-muted-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const formatTimestamp = (date) => {
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    
    if (minutes < 60) {
      return `${minutes} min atrás`;
    } else if (hours < 24) {
      return `${hours}h atrás`;
    } else {
      return date?.toLocaleDateString('pt-BR', { 
        day: '2-digit', 
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };

  const filteredAlerts = alerts?.filter(alert => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !alert?.isRead;
    return alert?.type === filter;
  });

  const unreadCount = alerts?.filter(alert => !alert?.isRead)?.length;

  const markAsRead = (alertId) => {
    setAlerts(prev => prev?.map(alert => 
      alert?.id === alertId ? { ...alert, isRead: true } : alert
    ));
  };

  const markAllAsRead = () => {
    setAlerts(prev => prev?.map(alert => ({ ...alert, isRead: true })));
  };

  const filterOptions = [
    { value: 'all', label: 'Todos', count: alerts?.length },
    { value: 'unread', label: 'Não lidos', count: unreadCount },
    { value: 'error', label: 'Erros', count: alerts?.filter(a => a?.type === 'error')?.length },
    { value: 'warning', label: 'Avisos', count: alerts?.filter(a => a?.type === 'warning')?.length }
  ];

  return (
    <div className="bg-card border border-border rounded-lg">
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Icon name="Bell" size={20} className="text-foreground" />
            <h3 className="text-lg font-semibold text-foreground">Alertas Recentes</h3>
            {unreadCount > 0 && (
              <span className="bg-error text-error-foreground text-xs px-2 py-1 rounded-full">
                {unreadCount}
              </span>
            )}
          </div>
          
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={markAllAsRead}
              className="text-xs"
            >
              Marcar todos como lidos
            </Button>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {filterOptions?.map((option) => (
            <button
              key={option?.value}
              onClick={() => setFilter(option?.value)}
              className={`px-3 py-1.5 text-xs rounded-md transition-colors duration-150 ${
                filter === option?.value
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              {option?.label} ({option?.count})
            </button>
          ))}
        </div>
      </div>
      <div className="max-h-96 overflow-y-auto">
        {isLoading ? (
          <div className="p-6 text-center">
            <Icon name="Loader2" size={20} className="animate-spin text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Carregando alertas...</p>
          </div>
        ) : filteredAlerts?.length === 0 ? (
          <div className="p-6 text-center">
            <Icon name="CheckCircle" size={48} className="text-success mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">
              {filter === 'all' ? 'Nenhum alerta encontrado.' : 'Nenhum alerta nesta categoria.'}
            </p>
          </div>
        ) : (
          <div className="space-y-1">
            {filteredAlerts?.map((alert) => {
              const config = getAlertConfig(alert?.type);
              return (
                <div
                  key={alert?.id}
                  className={`p-4 border-l-4 ${config?.borderColor} ${
                    alert?.isRead ? 'bg-muted/30' : config?.bgColor
                  } hover:bg-muted/50 transition-colors cursor-pointer`}
                  onClick={() => markAsRead(alert?.id)}
                >
                  <div className="flex items-start space-x-3">
                    <Icon name={config?.icon} size={16} className={`${config?.color} mt-0.5 flex-shrink-0`} />
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className={`text-sm font-medium ${
                          alert?.isRead ? 'text-muted-foreground' : 'text-foreground'
                        }`}>
                          {alert?.title}
                        </h4>
                        <span className={`text-xs px-2 py-1 rounded-full ${getSeverityBadge(alert?.severity)}`}>
                          {alert?.severity === 'high' ? 'Alta' : 
                           alert?.severity === 'medium' ? 'Média' : 'Baixa'}
                        </span>
                      </div>
                      
                      <p className={`text-xs mb-2 ${
                        alert?.isRead ? 'text-muted-foreground' : 'text-foreground'
                      }`}>
                        {alert?.message}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                          {alert?.integration}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {formatTimestamp(alert?.timestamp)}
                        </span>
                      </div>
                    </div>
                    
                    {!alert?.isRead && (
                      <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-2" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <div className="p-4 border-t border-border">
        <Button variant="outline" fullWidth iconName="ExternalLink" iconPosition="right">
          Ver Todos os Alertas
        </Button>
      </div>
    </div>
  );
};

export default AlertsPanel;