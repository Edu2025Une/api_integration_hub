import React from 'react';
import { Checkbox } from '../../../components/ui/Checkbox';
import Button from '../../../components/ui/Button';
import StatusIndicator from '../../../components/ui/StatusIndicator';
import Icon from '../../../components/AppIcon';

const ApiTable = ({ apis, selectedApis, onSelectApi, onSelectAll }) => {
  const formatDate = (date) => {
    return new Date(date)?.toLocaleDateString('pt-BR');
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('pt-BR')?.format(num);
  };

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

  const copyToClipboard = (text) => {
    navigator?.clipboard?.writeText(text);
  };

  const handleAction = (action, apiId) => {
    switch (action) {
      case 'edit': console.log('Edit API:', apiId);
        break;
      case 'test': console.log('Test API:', apiId);
        break;
      case 'docs':
        console.log('View docs:', apiId);
        break;
      case 'delete':
        console.log('Delete API:', apiId);
        break;
      default:
        break;
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted">
            <tr>
              <th className="p-4 text-left">
                <Checkbox
                  checked={selectedApis?.length === apis?.length && apis?.length > 0}
                  indeterminate={selectedApis?.length > 0 && selectedApis?.length < apis?.length}
                  onCheckedChange={onSelectAll}
                />
              </th>
              <th className="p-4 text-left font-medium text-foreground">Nome</th>
              <th className="p-4 text-left font-medium text-foreground">Endpoint</th>
              <th className="p-4 text-left font-medium text-foreground">Status</th>
              <th className="p-4 text-left font-medium text-foreground">Saúde</th>
              <th className="p-4 text-left font-medium text-foreground">Categoria</th>
              <th className="p-4 text-left font-medium text-foreground">Requisições</th>
              <th className="p-4 text-left font-medium text-foreground">Criada em</th>
              <th className="p-4 text-left font-medium text-foreground">Último Uso</th>
              <th className="p-4 text-left font-medium text-foreground">Ações</th>
            </tr>
          </thead>
          <tbody>
            {apis?.map((api, index) => (
              <tr 
                key={api?.id} 
                className={`border-t border-border hover:bg-muted/50 transition-colors ${
                  selectedApis?.includes(api?.id) ? 'bg-primary/5' : ''
                }`}
              >
                <td className="p-4">
                  <Checkbox
                    checked={selectedApis?.includes(api?.id)}
                    onCheckedChange={() => onSelectApi(api?.id)}
                  />
                </td>
                
                <td className="p-4">
                  <div>
                    <div className="font-medium text-foreground">{api?.name}</div>
                    <div className="text-sm text-muted-foreground truncate max-w-xs">
                      {api?.description}
                    </div>
                  </div>
                </td>
                
                <td className="p-4">
                  <div className="flex items-center space-x-2 max-w-xs">
                    <code className="text-sm bg-muted px-2 py-1 rounded text-foreground truncate">
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
                </td>
                
                <td className="p-4">
                  <StatusIndicator 
                    status={api?.status} 
                    className="text-sm"
                  />
                </td>
                
                <td className="p-4">
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
                </td>
                
                <td className="p-4">
                  <span className="text-sm text-foreground">{api?.category}</span>
                </td>
                
                <td className="p-4">
                  <span className="font-medium text-foreground">
                    {formatNumber(api?.requestCount)}
                  </span>
                </td>
                
                <td className="p-4">
                  <span className="text-sm text-muted-foreground">
                    {formatDate(api?.createdAt)}
                  </span>
                </td>
                
                <td className="p-4">
                  <span className="text-sm text-muted-foreground">
                    {formatDate(api?.lastUsed)}
                  </span>
                </td>
                
                <td className="p-4">
                  <div className="flex items-center space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleAction('test', api?.id)}
                      title="Testar API"
                    >
                      <Icon name="Play" size={14} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleAction('edit', api?.id)}
                      title="Editar API"
                    >
                      <Icon name="Edit" size={14} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleAction('docs', api?.id)}
                      title="Ver Documentação"
                    >
                      <Icon name="FileText" size={14} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleAction('delete', api?.id)}
                      title="Excluir API"
                      className="text-destructive hover:text-destructive"
                    >
                      <Icon name="Trash2" size={14} />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ApiTable;