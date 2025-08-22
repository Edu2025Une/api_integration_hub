import React, { useState } from 'react';

import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';
import StatusIndicator from '../../../components/ui/StatusIndicator';
import Icon from '../../../components/AppIcon';

const ApiCard = ({ api, isSelected, onSelect }) => {
  const [showDropdown, setShowDropdown] = useState(false);

  const getHealthColor = (health) => {
    switch (health) {
      case 'healthy':
        return 'text-success';
      case 'warning':
        return 'text-warning';
      case 'error':
        return 'text-destructive';
      default:
        return 'text-muted-foreground';
    }
  };

  const getHealthIcon = (health) => {
    switch (health) {
      case 'healthy':
        return 'CheckCircle';
      case 'warning':
        return 'AlertTriangle';
      case 'error':
        return 'XCircle';
      default:
        return 'Circle';
    }
  };

  const formatDate = (date) => {
    return new Date(date)?.toLocaleDateString('pt-BR');
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('pt-BR')?.format(num);
  };

  const copyToClipboard = (text) => {
    navigator?.clipboard?.writeText(text);
    // You could add a toast notification here
  };

  const handleAction = (action) => {
    setShowDropdown(false);
    switch (action) {
      case 'edit': console.log('Edit API:', api?.id);
        break;
      case 'test': console.log('Test API:', api?.id);
        break;
      case 'docs':
        console.log('View docs:', api?.id);
        break;
      case 'delete':
        console.log('Delete API:', api?.id);
        break;
      default:
        break;
    }
  };

  return (
    <div className={`bg-card border rounded-lg p-6 transition-all duration-200 hover:shadow-md ${
      isSelected ? 'border-primary ring-2 ring-primary/20' : 'border-border'
    }`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start space-x-3 flex-1">
          <Checkbox
            checked={isSelected}
            onCheckedChange={onSelect}
            className="mt-1"
          />
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground truncate mb-1">
              {api?.name}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {api?.description}
            </p>
          </div>
        </div>
        
        <div className="relative">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            <Icon name="MoreHorizontal" size={16} />
          </Button>
          
          {showDropdown && (
            <div className="absolute right-0 top-full mt-1 w-48 bg-popover border border-border rounded-md shadow-lg z-10">
              <div className="py-1">
                <button
                  onClick={() => handleAction('edit')}
                  className="w-full flex items-center px-3 py-2 text-sm hover:bg-muted"
                >
                  <Icon name="Edit" size={16} className="mr-2" />
                  Editar
                </button>
                <button
                  onClick={() => handleAction('test')}
                  className="w-full flex items-center px-3 py-2 text-sm hover:bg-muted"
                >
                  <Icon name="Play" size={16} className="mr-2" />
                  Testar
                </button>
                <button
                  onClick={() => handleAction('docs')}
                  className="w-full flex items-center px-3 py-2 text-sm hover:bg-muted"
                >
                  <Icon name="FileText" size={16} className="mr-2" />
                  Documentação
                </button>
                <hr className="my-1" />
                <button
                  onClick={() => handleAction('delete')}
                  className="w-full flex items-center px-3 py-2 text-sm hover:bg-muted text-destructive"
                >
                  <Icon name="Trash2" size={16} className="mr-2" />
                  Excluir
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Status & Health */}
      <div className="flex items-center justify-between mb-4">
        <StatusIndicator 
          status={api?.status} 
          className="text-sm"
        />
        <div className="flex items-center space-x-1">
          <Icon 
            name={getHealthIcon(api?.health)} 
            size={16} 
            className={getHealthColor(api?.health)} 
          />
          <span className={`text-sm capitalize ${getHealthColor(api?.health)}`}>
            {api?.health === 'healthy' ? 'Saudável' : 
             api?.health === 'warning' ? 'Atenção' : 'Erro'}
          </span>
        </div>
      </div>

      {/* Endpoint */}
      <div className="mb-4">
        <label className="text-xs text-muted-foreground uppercase tracking-wide">
          Endpoint
        </label>
        <div className="flex items-center space-x-2 mt-1">
          <code className="flex-1 text-sm bg-muted px-2 py-1 rounded text-foreground truncate">
            {api?.endpoint}
          </code>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => copyToClipboard(api?.endpoint)}
          >
            <Icon name="Copy" size={14} />
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <div className="text-xs text-muted-foreground">Requisições</div>
          <div className="font-semibold text-foreground">
            {formatNumber(api?.requestCount)}
          </div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground">Categoria</div>
          <div className="font-semibold text-foreground">
            {api?.category}
          </div>
        </div>
      </div>

      {/* Dates */}
      <div className="grid grid-cols-2 gap-4 text-xs text-muted-foreground mb-4">
        <div>
          <span>Criada em:</span><br />
          <span className="text-foreground">{formatDate(api?.createdAt)}</span>
        </div>
        <div>
          <span>Último uso:</span><br />
          <span className="text-foreground">{formatDate(api?.lastUsed)}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex space-x-2 pt-4 border-t border-border">
        <Button variant="outline" size="sm" className="flex-1">
          <Icon name="Play" size={14} className="mr-2" />
          Testar
        </Button>
        <Button variant="outline" size="sm" className="flex-1">
          <Icon name="Edit" size={14} className="mr-2" />
          Editar
        </Button>
      </div>

      {/* Click outside to close dropdown */}
      {showDropdown && (
        <div
          className="fixed inset-0 z-5"
          onClick={() => setShowDropdown(false)}
        />
      )}
    </div>
  );
};

export default ApiCard;