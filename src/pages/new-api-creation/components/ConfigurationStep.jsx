import React, { useState } from 'react';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

import Icon from '../../../components/AppIcon';

const ConfigurationStep = ({ formData, updateFormData }) => {
  const [activeTab, setActiveTab] = useState('basic');

  const httpMethods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'];
  const contentTypes = [
    'application/json',
    'application/xml',
    'text/plain',
    'application/x-www-form-urlencoded',
    'multipart/form-data'
  ];

  const handleInputChange = (field, value) => {
    updateFormData({ [field]: value });
  };

  const handleMethodToggle = (method) => {
    const methods = formData?.methods?.includes(method)
      ? formData?.methods?.filter(m => m !== method)
      : [...formData?.methods, method];
    updateFormData({ methods });
  };

  const handleEnvironmentChange = (env, field, value) => {
    const environments = {
      ...formData?.environments,
      [env]: {
        ...formData?.environments?.[env],
        [field]: value
      }
    };
    updateFormData({ environments });
  };

  const handleRateLimitChange = (field, value) => {
    const rateLimit = {
      ...formData?.rateLimit,
      [field]: value
    };
    updateFormData({ rateLimit });
  };

  const validateUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="border-b border-border">
        <div className="flex space-x-8">
          <button
            onClick={() => setActiveTab('basic')}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'basic' ?'border-primary text-primary' :'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            Configuração Básica
          </button>
          <button
            onClick={() => setActiveTab('advanced')}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'advanced' ?'border-primary text-primary' :'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            Configurações Avançadas
          </button>
          <button
            onClick={() => setActiveTab('environments')}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'environments' ?'border-primary text-primary' :'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            Ambientes
          </button>
        </div>
      </div>

      {/* Basic Configuration Tab */}
      {activeTab === 'basic' && (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              URL Base da API *
            </label>
            <Input
              type="url"
              placeholder="https://api.exemplo.com"
              value={formData?.baseUrl}
              onChange={(e) => handleInputChange('baseUrl', e?.target?.value)}
              className={`w-full ${
                formData?.baseUrl && !validateUrl(formData?.baseUrl) 
                  ? 'border-destructive focus:ring-destructive' :''
              }`}
            />
            {formData?.baseUrl && !validateUrl(formData?.baseUrl) && (
              <p className="text-xs text-destructive mt-1">
                Por favor, insira uma URL válida
              </p>
            )}
            <p className="text-xs text-muted-foreground mt-1">
              URL base que será usada para todas as requisições desta API
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-3">
              Métodos HTTP Suportados *
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {httpMethods?.map(method => (
                <label key={method} className="flex items-center space-x-2 cursor-pointer">
                  <Checkbox
                    checked={formData?.methods?.includes(method)}
                    onCheckedChange={() => handleMethodToggle(method)}
                  />
                  <span className="text-sm font-medium text-foreground">{method}</span>
                </label>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Selecione os métodos HTTP que sua API suporta
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Content-Type Padrão
              </label>
              <Select
                value={formData?.contentType}
                onValueChange={(value) => handleInputChange('contentType', value)}
                className="w-full"
              >
                {contentTypes?.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Timeout (segundos)
              </label>
              <Input
                type="number"
                min="1"
                max="300"
                value={formData?.timeout}
                onChange={(e) => handleInputChange('timeout', parseInt(e?.target?.value) || 30)}
                className="w-full"
              />
            </div>
          </div>
        </div>
      )}

      {/* Advanced Configuration Tab */}
      {activeTab === 'advanced' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Tentativas de Retry
              </label>
              <Input
                type="number"
                min="0"
                max="10"
                value={formData?.retryAttempts}
                onChange={(e) => handleInputChange('retryAttempts', parseInt(e?.target?.value) || 0)}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Número de tentativas em caso de falha na requisição
              </p>
            </div>
          </div>

          {/* Rate Limiting */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                checked={formData?.rateLimitEnabled}
                onCheckedChange={(checked) => handleInputChange('rateLimitEnabled', checked)}
              />
              <label className="text-sm font-medium text-foreground">
                Habilitar Rate Limiting
              </label>
            </div>

            {formData?.rateLimitEnabled && (
              <div className="ml-6 grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-muted rounded-lg">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Máximo de Requisições
                  </label>
                  <Input
                    type="number"
                    min="1"
                    value={formData?.rateLimit?.requests}
                    onChange={(e) => handleRateLimitChange('requests', parseInt(e?.target?.value) || 100)}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Janela de Tempo (segundos)
                  </label>
                  <Input
                    type="number"
                    min="1"
                    value={formData?.rateLimit?.window}
                    onChange={(e) => handleRateLimitChange('window', parseInt(e?.target?.value) || 60)}
                    className="w-full"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Environments Tab */}
      {activeTab === 'environments' && (
        <div className="space-y-6">
          <div className="flex items-center space-x-2 mb-4">
            <Icon name="Globe" size={20} className="text-muted-foreground" />
            <h3 className="text-lg font-medium text-foreground">
              Configuração de Ambientes
            </h3>
          </div>
          <p className="text-sm text-muted-foreground mb-6">
            Configure URLs diferentes para cada ambiente de desenvolvimento
          </p>

          <div className="space-y-6">
            {Object?.entries(formData?.environments)?.map(([env, config]) => (
              <div key={env} className="border border-border rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <Icon 
                      name={env === 'production' ? 'Server' : env === 'staging' ? 'TestTube' : 'Code'} 
                      size={20} 
                      className="text-muted-foreground" 
                    />
                    <h4 className="font-medium text-foreground capitalize">
                      {env === 'development' ? 'Desenvolvimento' : 
                       env === 'staging' ? 'Homologação' : 'Produção'}
                    </h4>
                  </div>
                  <Checkbox
                    checked={config?.enabled}
                    onCheckedChange={(checked) => handleEnvironmentChange(env, 'enabled', checked)}
                  />
                </div>

                {config?.enabled && (
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      URL do {env === 'development' ? 'Desenvolvimento' : 
                              env === 'staging' ? 'Homologação' : 'Produção'}
                    </label>
                    <Input
                      type="url"
                      placeholder={`https://api-${env}.exemplo.com`}
                      value={config?.baseUrl}
                      onChange={(e) => handleEnvironmentChange(env, 'baseUrl', e?.target?.value)}
                      className="w-full"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Configuration Preview */}
      <div className="border-t border-border pt-6">
        <div className="flex items-center space-x-2 mb-4">
          <Icon name="Eye" size={20} className="text-muted-foreground" />
          <h3 className="text-lg font-medium text-foreground">
            Resumo da Configuração
          </h3>
        </div>
        
        <div className="bg-muted p-4 rounded-lg space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span className="text-sm font-medium text-foreground">URL Base:</span>
              <p className="text-sm text-muted-foreground break-all">
                {formData?.baseUrl || 'Não configurada'}
              </p>
            </div>
            <div>
              <span className="text-sm font-medium text-foreground">Métodos:</span>
              <p className="text-sm text-muted-foreground">
                {formData?.methods?.join(', ') || 'Nenhum selecionado'}
              </p>
            </div>
            <div>
              <span className="text-sm font-medium text-foreground">Content-Type:</span>
              <p className="text-sm text-muted-foreground">
                {formData?.contentType}
              </p>
            </div>
            <div>
              <span className="text-sm font-medium text-foreground">Timeout:</span>
              <p className="text-sm text-muted-foreground">
                {formData?.timeout} segundos
              </p>
            </div>
          </div>
          
          {formData?.rateLimitEnabled && (
            <div className="pt-2 border-t border-border">
              <span className="text-sm font-medium text-foreground">Rate Limiting:</span>
              <p className="text-sm text-muted-foreground">
                {formData?.rateLimit?.requests} requisições por {formData?.rateLimit?.window} segundos
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConfigurationStep;