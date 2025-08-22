import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ConnectionStatus = () => {
  const [connectionState, setConnectionState] = useState('connected');
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [reconnectAttempts, setReconnectAttempts] = useState(0);
  const [latency, setLatency] = useState(45);
  const [dataTransferred, setDataTransferred] = useState(0);

  const connectionStates = {
    connected: {
      icon: 'Wifi',
      color: 'text-success',
      bgColor: 'bg-success/10',
      label: 'Conectado',
      description: 'Conexão estável com o servidor'
    },
    connecting: {
      icon: 'Loader2',
      color: 'text-warning',
      bgColor: 'bg-warning/10',
      label: 'Conectando',
      description: 'Estabelecendo conexão...'
    },
    disconnected: {
      icon: 'WifiOff',
      color: 'text-error',
      bgColor: 'bg-error/10',
      label: 'Desconectado',
      description: 'Sem conexão com o servidor'
    },
    reconnecting: {
      icon: 'RefreshCw',
      color: 'text-warning',
      bgColor: 'bg-warning/10',
      label: 'Reconectando',
      description: 'Tentando reconectar...'
    }
  };

  useEffect(() => {
    // Simulate connection state changes
    const interval = setInterval(() => {
      const random = Math.random();
      
      if (random > 0.95) { // 5% chance of disconnection
        setConnectionState('disconnected');
        setReconnectAttempts(0);
      } else if (connectionState === 'disconnected') {
        if (reconnectAttempts < 3) {
          setConnectionState('reconnecting');
          setReconnectAttempts(prev => prev + 1);
          
          setTimeout(() => {
            if (Math.random() > 0.3) { // 70% chance of successful reconnection
              setConnectionState('connected');
              setReconnectAttempts(0);
            }
          }, 2000);
        }
      } else if (connectionState === 'connected') {
        // Update metrics for connected state
        setLastUpdate(new Date());
        setLatency(Math.floor(Math.random() * 50) + 20);
        setDataTransferred(prev => prev + Math.floor(Math.random() * 1024) + 512);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [connectionState, reconnectAttempts]);

  const handleManualReconnect = () => {
    setConnectionState('connecting');
    setReconnectAttempts(0);
    
    setTimeout(() => {
      setConnectionState('connected');
      setLastUpdate(new Date());
    }, 1500);
  };

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i))?.toFixed(1)) + ' ' + sizes?.[i];
  };

  const currentState = connectionStates?.[connectionState];

  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 rounded-full ${currentState?.bgColor} flex items-center justify-center`}>
            <Icon 
              name={currentState?.icon} 
              size={20} 
              className={`${currentState?.color} ${
                connectionState === 'connecting' || connectionState === 'reconnecting' ?'animate-spin' :''
              }`}
            />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Status da Conexão</h3>
            <p className="text-sm text-muted-foreground">{currentState?.description}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className={`text-sm font-medium ${currentState?.color}`}>
            {currentState?.label}
          </span>
          
          {(connectionState === 'disconnected' || connectionState === 'reconnecting') && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleManualReconnect}
              disabled={connectionState === 'connecting'}
              iconName="RefreshCw"
              iconPosition="left"
            >
              Reconectar
            </Button>
          )}
        </div>
      </div>
      {/* Connection Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <div className="text-center">
          <p className="text-xs text-muted-foreground mb-1">Latência</p>
          <p className={`text-lg font-semibold font-mono ${
            latency < 50 ? 'text-success' : 
            latency < 100 ? 'text-warning' : 'text-error'
          }`}>
            {connectionState === 'connected' ? `${latency}ms` : '--'}
          </p>
        </div>
        
        <div className="text-center">
          <p className="text-xs text-muted-foreground mb-1">Dados Transferidos</p>
          <p className="text-lg font-semibold font-mono text-foreground">
            {connectionState === 'connected' ? formatBytes(dataTransferred) : '--'}
          </p>
        </div>
        
        <div className="text-center">
          <p className="text-xs text-muted-foreground mb-1">Tentativas</p>
          <p className="text-lg font-semibold font-mono text-foreground">
            {reconnectAttempts > 0 ? reconnectAttempts : '--'}
          </p>
        </div>
        
        <div className="text-center">
          <p className="text-xs text-muted-foreground mb-1">Uptime</p>
          <p className="text-lg font-semibold font-mono text-success">
            99.8%
          </p>
        </div>
      </div>
      {/* Connection Quality Indicator */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-muted-foreground">Qualidade da Conexão</span>
          <span className="text-xs font-medium text-foreground">
            {connectionState === 'connected' ? 
              (latency < 50 ? 'Excelente' : latency < 100 ? 'Boa' : 'Regular') : 
              'N/A'
            }
          </span>
        </div>
        
        <div className="w-full bg-muted rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-300 ${
              connectionState === 'connected' ?
                (latency < 50 ? 'bg-success w-full' : 
                 latency < 100 ? 'bg-warning w-3/4' : 'bg-error w-1/2') :
                'bg-muted w-0'
            }`}
          />
        </div>
      </div>
      {/* Last Update */}
      <div className="flex items-center justify-between text-xs text-muted-foreground pt-3 border-t border-border">
        <div className="flex items-center space-x-2">
          <Icon name="Clock" size={12} />
          <span>Última atualização:</span>
        </div>
        <span className="font-mono">
          {connectionState === 'connected' ? lastUpdate?.toLocaleTimeString('pt-BR') : 
            '--:--:--'
          }
        </span>
      </div>
      {/* WebSocket URL (for debugging) */}
      {connectionState === 'connected' && (
        <div className="mt-3 pt-3 border-t border-border">
          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
            <Icon name="Link" size={12} />
            <span className="font-mono">ws://api-hub.local:8080/monitoring</span>
            <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
          </div>
        </div>
      )}
    </div>
  );
};

export default ConnectionStatus;