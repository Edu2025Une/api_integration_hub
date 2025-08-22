import React from 'react';
import Icon from '../../../components/AppIcon';

const CompanyBranding = () => {
  return (
    <div className="text-center space-y-6">
      {/* Logo */}
      <div className="flex justify-center">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center shadow-lg">
            <Icon name="Workflow" size={28} className="text-primary-foreground" />
          </div>
          <div className="text-left">
            <h1 className="text-2xl font-bold text-foreground">API Hub</h1>
            <p className="text-sm text-muted-foreground">Integration Platform</p>
          </div>
        </div>
      </div>

      {/* Welcome Message */}
      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-foreground">
          Bem-vindo de volta
        </h2>
        <p className="text-sm text-muted-foreground max-w-sm mx-auto">
          Acesse sua plataforma de integração de APIs e gerencie suas conexões com segurança e eficiência.
        </p>
      </div>

      {/* Key Features */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
        <div className="flex flex-col items-center space-y-2 p-3 bg-muted/30 rounded-lg">
          <div className="w-8 h-8 bg-success/10 rounded-full flex items-center justify-center">
            <Icon name="Shield" size={16} className="text-success" />
          </div>
          <p className="text-xs font-medium text-foreground">Seguro</p>
        </div>
        
        <div className="flex flex-col items-center space-y-2 p-3 bg-muted/30 rounded-lg">
          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
            <Icon name="Zap" size={16} className="text-primary" />
          </div>
          <p className="text-xs font-medium text-foreground">Rápido</p>
        </div>
        
        <div className="flex flex-col items-center space-y-2 p-3 bg-muted/30 rounded-lg">
          <div className="w-8 h-8 bg-accent/10 rounded-full flex items-center justify-center">
            <Icon name="Users" size={16} className="text-accent" />
          </div>
          <p className="text-xs font-medium text-foreground">Colaborativo</p>
        </div>
      </div>

      {/* System Status */}
      <div className="flex items-center justify-center space-x-2 pt-2">
        <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
        <p className="text-xs text-muted-foreground">
          Todos os sistemas operacionais
        </p>
      </div>
    </div>
  );
};

export default CompanyBranding;