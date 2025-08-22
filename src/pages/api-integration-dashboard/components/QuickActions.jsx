import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const QuickActions = () => {
  const [recentActions, setRecentActions] = useState([]);

  const quickActionItems = [
    {
      id: 'new-integration',
      title: 'Nova Integração',
      description: 'Configurar uma nova API',
      icon: 'Plus',
      color: 'primary',
      action: () => handleQuickAction('new-integration')
    },
    {
      id: 'test-all',
      title: 'Testar Todas',
      description: 'Executar testes em todas as APIs',
      icon: 'Play',
      color: 'success',
      action: () => handleQuickAction('test-all')
    },
    {
      id: 'view-logs',
      title: 'Ver Logs',
      description: 'Acessar logs detalhados',
      icon: 'FileText',
      color: 'secondary',
      action: () => handleQuickAction('view-logs')
    },
    {
      id: 'export-config',
      title: 'Exportar Config',
      description: 'Baixar configurações',
      icon: 'Download',
      color: 'secondary',
      action: () => handleQuickAction('export-config')
    },
    {
      id: 'monitoring',
      title: 'Monitoramento',
      description: 'Dashboard em tempo real',
      icon: 'BarChart3',
      color: 'primary',
      action: () => handleQuickAction('monitoring')
    },
    {
      id: 'automation',
      title: 'Automação',
      description: 'Configurar workflows',
      icon: 'Zap',
      color: 'warning',
      action: () => handleQuickAction('automation')
    }
  ];

  const handleQuickAction = (actionId) => {
    const action = quickActionItems?.find(item => item?.id === actionId);
    const newAction = {
      id: Date.now(),
      title: action?.title,
      timestamp: new Date(),
      status: 'completed'
    };
    
    setRecentActions(prev => [newAction, ...prev?.slice(0, 4)]);
    
    // Mock action execution
    console.log(`Executing action: ${actionId}`);
    
    // Here you would typically navigate or trigger the actual action
    switch (actionId) {
      case 'new-integration': console.log('Navigate to new integration form');
        break;
      case 'test-all': console.log('Running tests on all integrations');
        break;
      case 'view-logs': console.log('Navigate to logs page');
        break;
      case 'export-config':
        console.log('Downloading configuration file');
        break;
      case 'monitoring': console.log('Navigate to monitoring dashboard');
        break;
      case 'automation': console.log('Navigate to automation workflows');
        break;
      default:
        break;
    }
  };

  const getColorClasses = (color) => {
    switch (color) {
      case 'primary':
        return {
          bg: 'bg-primary/10 hover:bg-primary/20',
          text: 'text-primary',
          border: 'border-primary/20'
        };
      case 'success':
        return {
          bg: 'bg-success/10 hover:bg-success/20',
          text: 'text-success',
          border: 'border-success/20'
        };
      case 'warning':
        return {
          bg: 'bg-warning/10 hover:bg-warning/20',
          text: 'text-warning',
          border: 'border-warning/20'
        };
      case 'secondary':
        return {
          bg: 'bg-secondary/10 hover:bg-secondary/20',
          text: 'text-secondary',
          border: 'border-secondary/20'
        };
      default:
        return {
          bg: 'bg-muted hover:bg-muted/80',
          text: 'text-muted-foreground',
          border: 'border-border'
        };
    }
  };

  const formatActionTime = (date) => {
    return date?.toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="bg-card border border-border rounded-lg">
      <div className="p-4 border-b border-border">
        <div className="flex items-center space-x-2 mb-4">
          <Icon name="Zap" size={20} className="text-foreground" />
          <h3 className="text-lg font-semibold text-foreground">Ações Rápidas</h3>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          {quickActionItems?.map((item) => {
            const colorClasses = getColorClasses(item?.color);
            return (
              <button
                key={item?.id}
                onClick={item?.action}
                className={`p-3 rounded-lg border ${colorClasses?.border} ${colorClasses?.bg} transition-all duration-200 hover:scale-105 text-left group`}
              >
                <div className="flex items-center space-x-2 mb-2">
                  <Icon name={item?.icon} size={16} className={colorClasses?.text} />
                  <span className="text-sm font-medium text-foreground group-hover:text-foreground">
                    {item?.title}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {item?.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>
      {/* Recent Actions */}
      {recentActions?.length > 0 && (
        <div className="p-4">
          <h4 className="text-sm font-medium text-foreground mb-3">Ações Recentes</h4>
          <div className="space-y-2">
            {recentActions?.map((action) => (
              <div key={action?.id} className="flex items-center justify-between p-2 bg-muted/30 rounded-md">
                <div className="flex items-center space-x-2">
                  <Icon name="CheckCircle" size={14} className="text-success" />
                  <span className="text-xs text-foreground">{action?.title}</span>
                </div>
                <span className="text-xs text-muted-foreground">
                  {formatActionTime(action?.timestamp)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
      {/* System Status Summary */}
      <div className="p-4 border-t border-border">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <p className="text-xs text-muted-foreground">Integrações Ativas</p>
            <p className="text-lg font-semibold text-success">5</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Alertas Pendentes</p>
            <p className="text-lg font-semibold text-warning">2</p>
          </div>
        </div>
        
        <Button 
          variant="outline" 
          fullWidth 
          iconName="Settings" 
          iconPosition="left"
          className="mt-4"
        >
          Configurações Gerais
        </Button>
      </div>
    </div>
  );
};

export default QuickActions;