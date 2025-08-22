import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const ComponentPalette = ({ onNodeAdd, isCollapsed, onToggle }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const componentCategories = [
    {
      id: 'all',
      name: 'Todos',
      icon: 'Grid3X3'
    },
    {
      id: 'connectors',
      name: 'Conectores',
      icon: 'Plug'
    },
    {
      id: 'transformers',
      name: 'Transformadores',
      icon: 'Shuffle'
    },
    {
      id: 'logic',
      name: 'Lógica',
      icon: 'GitBranch'
    },
    {
      id: 'actions',
      name: 'Ações',
      icon: 'Zap'
    }
  ];

  const components = [
    // Connectors
    {
      id: 'http_request',
      name: 'Requisição HTTP',
      type: 'HTTP Request',
      category: 'connectors',
      icon: 'Globe',
      description: 'Faz requisições HTTP para APIs externas',
      config: {
        method: 'GET',
        endpoint: '',
        headers: {},
        body: ''
      }
    },
    {
      id: 'database_query',
      name: 'Consulta BD',
      type: 'Database Query',
      category: 'connectors',
      icon: 'Database',
      description: 'Executa consultas em banco de dados',
      config: {
        connection: '',
        query: '',
        parameters: {}
      }
    },
    {
      id: 'webhook_trigger',
      name: 'Webhook',
      type: 'Webhook Trigger',
      category: 'connectors',
      icon: 'Webhook',
      description: 'Recebe dados via webhook',
      config: {
        url: '',
        method: 'POST',
        authentication: 'none'
      }
    },
    {
      id: 'file_reader',
      name: 'Leitor de Arquivo',
      type: 'File Reader',
      category: 'connectors',
      icon: 'FileText',
      description: 'Lê dados de arquivos',
      config: {
        path: '',
        format: 'json',
        encoding: 'utf-8'
      }
    },

    // Transformers
    {
      id: 'data_mapper',
      name: 'Mapeador de Dados',
      type: 'Data Mapper',
      category: 'transformers',
      icon: 'ArrowRightLeft',
      description: 'Transforma estrutura de dados',
      config: {
        mappings: {},
        outputFormat: 'json'
      }
    },
    {
      id: 'filter',
      name: 'Filtro',
      type: 'Data Filter',
      category: 'transformers',
      icon: 'Filter',
      description: 'Filtra dados baseado em condições',
      config: {
        conditions: [],
        operator: 'AND'
      }
    },
    {
      id: 'aggregator',
      name: 'Agregador',
      type: 'Data Aggregator',
      category: 'transformers',
      icon: 'Combine',
      description: 'Agrega múltiplos dados em um',
      config: {
        operation: 'merge',
        groupBy: ''
      }
    },
    {
      id: 'validator',
      name: 'Validador',
      type: 'Data Validator',
      category: 'transformers',
      icon: 'CheckCircle',
      description: 'Valida dados contra esquema',
      config: {
        schema: {},
        strict: true
      }
    },

    // Logic
    {
      id: 'condition',
      name: 'Condição',
      type: 'Conditional Logic',
      category: 'logic',
      icon: 'GitBranch',
      description: 'Executa lógica condicional',
      config: {
        condition: '',
        trueAction: null,
        falseAction: null
      }
    },
    {
      id: 'loop',
      name: 'Loop',
      type: 'Loop Iterator',
      category: 'logic',
      icon: 'RotateCw',
      description: 'Itera sobre coleção de dados',
      config: {
        collection: '',
        maxIterations: 100
      }
    },
    {
      id: 'delay',
      name: 'Atraso',
      type: 'Delay Timer',
      category: 'logic',
      icon: 'Clock',
      description: 'Adiciona atraso na execução',
      config: {
        duration: 1000,
        unit: 'milliseconds'
      }
    },
    {
      id: 'parallel',
      name: 'Paralelo',
      type: 'Parallel Execution',
      category: 'logic',
      icon: 'Split',
      description: 'Executa múltiplas ações em paralelo',
      config: {
        branches: [],
        waitForAll: true
      }
    },

    // Actions
    {
      id: 'email_sender',
      name: 'Enviar Email',
      type: 'Email Sender',
      category: 'actions',
      icon: 'Mail',
      description: 'Envia emails via SMTP',
      config: {
        to: '',
        subject: '',
        body: '',
        smtp: {}
      }
    },
    {
      id: 'notification',
      name: 'Notificação',
      type: 'Push Notification',
      category: 'actions',
      icon: 'Bell',
      description: 'Envia notificações push',
      config: {
        title: '',
        message: '',
        recipients: []
      }
    },
    {
      id: 'logger',
      name: 'Log',
      type: 'Logger',
      category: 'actions',
      icon: 'FileText',
      description: 'Registra informações em log',
      config: {
        level: 'info',
        message: '',
        metadata: {}
      }
    },
    {
      id: 'custom_script',
      name: 'Script Personalizado',
      type: 'Custom Script',
      category: 'actions',
      icon: 'Code',
      description: 'Executa código JavaScript personalizado',
      config: {
        script: '',
        timeout: 30000
      }
    }
  ];

  const filteredComponents = components?.filter(component => {
    const matchesSearch = component?.name?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
                         component?.description?.toLowerCase()?.includes(searchTerm?.toLowerCase());
    const matchesCategory = activeCategory === 'all' || component?.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const handleDragStart = (e, component) => {
    e?.dataTransfer?.setData('application/json', JSON.stringify(component));
  };

  const handleAddComponent = (component) => {
    const newNode = {
      id: `node_${Date.now()}`,
      name: component?.name,
      type: component?.type,
      icon: component?.icon,
      category: component?.category,
      config: { ...component?.config },
      position: { x: 100, y: 100 },
      customFields: {
        field1: '',
        field2: '',
        field3: ''
      }
    };
    onNodeAdd(newNode);
  };

  if (isCollapsed) {
    return (
      <div className="w-12 bg-card border-r border-border flex flex-col items-center py-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggle}
          className="mb-4"
        >
          <Icon name="PanelLeftOpen" size={20} />
        </Button>
        {componentCategories?.slice(1)?.map((category) => (
          <Button
            key={category?.id}
            variant="ghost"
            size="icon"
            className="mb-2"
            onClick={() => {
              setActiveCategory(category?.id);
              onToggle();
            }}
          >
            <Icon name={category?.icon} size={20} />
          </Button>
        ))}
      </div>
    );
  }

  return (
    <div className="w-80 bg-card border-r border-border flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">
            Paleta de Componentes
          </h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggle}
          >
            <Icon name="PanelLeftClose" size={20} />
          </Button>
        </div>
        
        <Input
          type="search"
          placeholder="Buscar componentes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e?.target?.value)}
          className="mb-4"
        />

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-1">
          {componentCategories?.map((category) => (
            <Button
              key={category?.id}
              variant={activeCategory === category?.id ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveCategory(category?.id)}
              className="text-xs"
            >
              <Icon name={category?.icon} size={14} className="mr-1" />
              {category?.name}
            </Button>
          ))}
        </div>
      </div>
      {/* Components List */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-2">
          {filteredComponents?.map((component) => (
            <div
              key={component?.id}
              className="group bg-muted/50 border border-border rounded-lg p-3 cursor-move hover:bg-muted hover:border-primary/50 transition-all duration-200"
              draggable
              onDragStart={(e) => handleDragStart(e, component)}
              onClick={() => handleAddComponent(component)}
            >
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-primary/10 rounded-md flex items-center justify-center flex-shrink-0">
                  <Icon name={component?.icon} size={16} className="text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                    {component?.name}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                    {component?.description}
                  </p>
                  <div className="flex items-center mt-2">
                    <span className="text-xs bg-secondary/20 text-secondary px-2 py-1 rounded">
                      {component?.type}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredComponents?.length === 0 && (
          <div className="text-center py-8">
            <Icon name="Search" size={32} className="text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">
              Nenhum componente encontrado
            </p>
          </div>
        )}
      </div>
      {/* Quick Actions */}
      <div className="p-4 border-t border-border">
        <div className="space-y-2">
          <Button variant="outline" size="sm" fullWidth>
            <Icon name="Download" size={14} className="mr-2" />
            Importar Componentes
          </Button>
          <Button variant="ghost" size="sm" fullWidth>
            <Icon name="Plus" size={14} className="mr-2" />
            Criar Componente
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ComponentPalette;