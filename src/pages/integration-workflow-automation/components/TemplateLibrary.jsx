import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const TemplateLibrary = ({ isOpen, onClose, onTemplateSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const templateCategories = [
    { id: 'all', name: 'Todos', icon: 'Grid3X3' },
    { id: 'api', name: 'Integração API', icon: 'Globe' },
    { id: 'data', name: 'Processamento de Dados', icon: 'Database' },
    { id: 'notification', name: 'Notificações', icon: 'Bell' },
    { id: 'automation', name: 'Automação', icon: 'Zap' }
  ];

  const templates = [
    {
      id: 'rest_api_integration',
      name: 'Integração REST API Básica',
      description: 'Template para integração com APIs REST incluindo autenticação, tratamento de erros e retry logic.',
      category: 'api',
      icon: 'Globe',
      complexity: 'Básico',
      estimatedTime: '15 min',
      tags: ['REST', 'HTTP', 'Autenticação'],
      nodes: 5,
      connections: 4,
      preview: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=200&fit=crop',
      author: 'Equipe API Hub',
      downloads: 1247,
      rating: 4.8
    },
    {
      id: 'webhook_processor',
      name: 'Processador de Webhooks',
      description: 'Recebe webhooks, valida dados, transforma formato e encaminha para sistemas internos.',
      category: 'api',
      icon: 'Webhook',
      complexity: 'Intermediário',
      estimatedTime: '25 min',
      tags: ['Webhook', 'Validação', 'Transformação'],
      nodes: 8,
      connections: 7,
      preview: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=200&fit=crop',
      author: 'João Silva',
      downloads: 892,
      rating: 4.6
    },
    {
      id: 'data_sync_pipeline',
      name: 'Pipeline de Sincronização de Dados',
      description: 'Sincroniza dados entre múltiplas fontes com detecção de mudanças e resolução de conflitos.',
      category: 'data',
      icon: 'RefreshCw',
      complexity: 'Avançado',
      estimatedTime: '45 min',
      tags: ['Sincronização', 'ETL', 'Banco de Dados'],
      nodes: 12,
      connections: 11,
      preview: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=200&fit=crop',
      author: 'Maria Santos',
      downloads: 634,
      rating: 4.9
    },
    {
      id: 'email_notification_system',
      name: 'Sistema de Notificação por Email',
      description: 'Envia emails personalizados baseados em eventos do sistema com templates dinâmicos.',
      category: 'notification',
      icon: 'Mail',
      complexity: 'Básico',
      estimatedTime: '20 min',
      tags: ['Email', 'Templates', 'Eventos'],
      nodes: 6,
      connections: 5,
      preview: 'https://images.unsplash.com/photo-1596526131083-e8c633c948d2?w=400&h=200&fit=crop',
      author: 'Carlos Oliveira',
      downloads: 1156,
      rating: 4.7
    },
    {
      id: 'file_processing_automation',
      name: 'Automação de Processamento de Arquivos',
      description: 'Monitora diretórios, processa arquivos automaticamente e move para destinos apropriados.',
      category: 'automation',
      icon: 'FileText',
      complexity: 'Intermediário',
      estimatedTime: '30 min',
      tags: ['Arquivos', 'Monitoramento', 'Automação'],
      nodes: 9,
      connections: 8,
      preview: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=400&h=200&fit=crop',
      author: 'Ana Costa',
      downloads: 743,
      rating: 4.5
    },
    {
      id: 'multi_channel_notification',
      name: 'Notificação Multi-Canal',
      description: 'Envia notificações via email, SMS, push e Slack baseado em preferências do usuário.',
      category: 'notification',
      icon: 'MessageSquare',
      complexity: 'Avançado',
      estimatedTime: '40 min',
      tags: ['Multi-canal', 'Preferências', 'Integração'],
      nodes: 15,
      connections: 14,
      preview: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=200&fit=crop',
      author: 'Pedro Almeida',
      downloads: 521,
      rating: 4.8
    }
  ];

  const filteredTemplates = templates?.filter(template => {
    const matchesSearch = template?.name?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
                         template?.description?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
                         template?.tags?.some(tag => tag?.toLowerCase()?.includes(searchTerm?.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || template?.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getComplexityColor = (complexity) => {
    switch (complexity) {
      case 'Básico': return 'text-success bg-success/10';
      case 'Intermediário': return 'text-warning bg-warning/10';
      case 'Avançado': return 'text-error bg-error/10';
      default: return 'text-muted-foreground bg-muted';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-card border border-border rounded-lg shadow-lg w-full max-w-6xl mx-4 h-[80vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-foreground">
                Biblioteca de Templates
              </h2>
              <p className="text-muted-foreground">
                Acelere seu desenvolvimento com templates pré-construídos
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
            >
              <Icon name="X" size={24} />
            </Button>
          </div>

          {/* Search and Filters */}
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <Input
                type="search"
                placeholder="Buscar templates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e?.target?.value)}
              />
            </div>
            
            <div className="flex space-x-2">
              {templateCategories?.map((category) => (
                <Button
                  key={category?.id}
                  variant={selectedCategory === category?.id ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setSelectedCategory(category?.id)}
                >
                  <Icon name={category?.icon} size={16} className="mr-2" />
                  {category?.name}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Templates Grid */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates?.map((template) => (
              <div
                key={template?.id}
                className="bg-muted/30 border border-border rounded-lg overflow-hidden hover:border-primary/50 transition-all duration-200 group"
              >
                {/* Template Preview */}
                <div className="relative h-32 bg-gradient-to-br from-primary/10 to-accent/10 overflow-hidden">
                  <img
                    src={template?.preview}
                    alt={template?.name}
                    className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Icon name={template?.icon} size={32} className="text-primary" />
                  </div>
                  
                  {/* Complexity Badge */}
                  <div className="absolute top-2 right-2">
                    <span className={`text-xs px-2 py-1 rounded-full ${getComplexityColor(template?.complexity)}`}>
                      {template?.complexity}
                    </span>
                  </div>
                </div>

                {/* Template Info */}
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                      {template?.name}
                    </h3>
                    <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                      <Icon name="Star" size={12} className="text-warning fill-current" />
                      <span>{template?.rating}</span>
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                    {template?.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    {template?.tags?.slice(0, 3)?.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs bg-secondary/20 text-secondary px-2 py-1 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Stats */}
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-1">
                        <Icon name="Box" size={12} />
                        <span>{template?.nodes}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Icon name="Clock" size={12} />
                        <span>{template?.estimatedTime}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Icon name="Download" size={12} />
                      <span>{template?.downloads?.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Author */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center">
                        <Icon name="User" size={12} className="text-primary" />
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {template?.author}
                      </span>
                    </div>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onTemplateSelect(template)}
                      className="text-xs"
                    >
                      <Icon name="Plus" size={12} className="mr-1" />
                      Usar
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredTemplates?.length === 0 && (
            <div className="text-center py-12">
              <Icon name="Search" size={48} className="text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Nenhum template encontrado
              </h3>
              <p className="text-muted-foreground mb-4">
                Tente ajustar seus filtros ou termo de busca
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                }}
              >
                Limpar Filtros
              </Button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border bg-muted/30">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>
              {filteredTemplates?.length} template{filteredTemplates?.length !== 1 ? 's' : ''} encontrado{filteredTemplates?.length !== 1 ? 's' : ''}
            </span>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <Icon name="Upload" size={14} className="mr-2" />
                Contribuir Template
              </Button>
              <Button variant="ghost" size="sm">
                <Icon name="ExternalLink" size={14} className="mr-2" />
                Ver Documentação
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateLibrary;