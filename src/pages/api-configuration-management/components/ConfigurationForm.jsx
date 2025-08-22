import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const ConfigurationForm = ({ integration, onSave, onTest, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    endpoint: '',
    method: 'GET',
    environment: 'development',
    version: '1.0.0',
    timeout: 30000,
    retryAttempts: 3,
    retryDelay: 1000,
    authType: 'none',
    authToken: '',
    authUsername: '',
    authPassword: '',
    headers: [{ key: '', value: '' }],
    queryParams: [{ key: '', value: '' }],
    webhookUrl: '',
    enableRateLimit: false,
    rateLimitRequests: 100,
    rateLimitWindow: 60,
    customField1: '',
    customField2: '',
    customField3: '',
    customField1Label: 'Campo Personalizado 1',
    customField2Label: 'Campo Personalizado 2',
    customField3Label: 'Campo Personalizado 3'
  });

  const [testResult, setTestResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (integration) {
      setFormData({
        ...integration,
        headers: integration?.headers || [{ key: '', value: '' }],
        queryParams: integration?.queryParams || [{ key: '', value: '' }]
      });
    }
  }, [integration]);

  const methodOptions = [
    { value: 'GET', label: 'GET' },
    { value: 'POST', label: 'POST' },
    { value: 'PUT', label: 'PUT' },
    { value: 'PATCH', label: 'PATCH' },
    { value: 'DELETE', label: 'DELETE' }
  ];

  const environmentOptions = [
    { value: 'development', label: 'Desenvolvimento' },
    { value: 'staging', label: 'Homologação' },
    { value: 'production', label: 'Produção' }
  ];

  const authTypeOptions = [
    { value: 'none', label: 'Nenhuma' },
    { value: 'bearer', label: 'Bearer Token' },
    { value: 'basic', label: 'Basic Auth' },
    { value: 'apikey', label: 'API Key' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors?.[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const handleArrayChange = (arrayName, index, field, value) => {
    setFormData(prev => ({
      ...prev,
      [arrayName]: prev?.[arrayName]?.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const addArrayItem = (arrayName) => {
    setFormData(prev => ({
      ...prev,
      [arrayName]: [...prev?.[arrayName], { key: '', value: '' }]
    }));
  };

  const removeArrayItem = (arrayName, index) => {
    setFormData(prev => ({
      ...prev,
      [arrayName]: prev?.[arrayName]?.filter((_, i) => i !== index)
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData?.name?.trim()) newErrors.name = 'Nome é obrigatório';
    if (!formData?.endpoint?.trim()) newErrors.endpoint = 'URL do endpoint é obrigatória';
    if (!formData?.endpoint?.match(/^https?:\/\/.+/)) newErrors.endpoint = 'URL deve começar com http:// ou https://';
    if (formData?.timeout < 1000) newErrors.timeout = 'Timeout deve ser pelo menos 1000ms';
    if (formData?.retryAttempts < 0) newErrors.retryAttempts = 'Tentativas de retry não podem ser negativas';

    if (formData?.authType === 'bearer' && !formData?.authToken?.trim()) {
      newErrors.authToken = 'Token é obrigatório para Bearer Auth';
    }
    if (formData?.authType === 'basic' && (!formData?.authUsername?.trim() || !formData?.authPassword?.trim())) {
      newErrors.authUsername = 'Usuário e senha são obrigatórios para Basic Auth';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleTest = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    setTestResult(null);

    try {
      // Simulate API test
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const success = Math.random() > 0.3; // 70% success rate for demo
      
      if (success) {
        setTestResult({
          success: true,
          status: 200,
          responseTime: Math.floor(Math.random() * 500) + 100,
          message: 'Conexão estabelecida com sucesso',
          data: { message: 'API respondeu corretamente', timestamp: new Date()?.toISOString() }
        });
      } else {
        setTestResult({
          success: false,
          status: 500,
          responseTime: Math.floor(Math.random() * 1000) + 500,
          message: 'Falha na conexão com a API',
          error: 'Timeout ou erro de autenticação'
        });
      }
    } catch (error) {
      setTestResult({
        success: false,
        message: 'Erro interno durante o teste',
        error: error?.message
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = () => {
    if (!validateForm()) return;
    
    const configData = {
      ...formData,
      id: integration?.id || Date.now(),
      status: integration?.status || 'inactive',
      lastModified: new Date()?.toISOString(),
      lastTested: testResult?.success ? new Date()?.toLocaleString('pt-BR') : integration?.lastTested
    };
    
    onSave(configData);
  };

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <div className="p-6 border-b border-border bg-card">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-foreground">
              {integration ? 'Editar Integração' : 'Nova Integração'}
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Configure os detalhes da integração da API
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              iconName="TestTube"
              iconPosition="left"
              onClick={handleTest}
              loading={isLoading}
              disabled={!formData?.endpoint}
            >
              Testar Conexão
            </Button>
            <Button
              variant="default"
              iconName="Save"
              iconPosition="left"
              onClick={handleSave}
            >
              Salvar
            </Button>
          </div>
        </div>
      </div>
      {/* Form Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Basic Information */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
              <Icon name="Info" size={20} className="mr-2" />
              Informações Básicas
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Nome da Integração"
                type="text"
                placeholder="Ex: API de Pagamentos"
                value={formData?.name}
                onChange={(e) => handleInputChange('name', e?.target?.value)}
                error={errors?.name}
                required
              />
              
              <Select
                label="Ambiente"
                options={environmentOptions}
                value={formData?.environment}
                onChange={(value) => handleInputChange('environment', value)}
              />
              
              <div className="md:col-span-2">
                <Input
                  label="Descrição"
                  type="text"
                  placeholder="Descreva o propósito desta integração"
                  value={formData?.description}
                  onChange={(e) => handleInputChange('description', e?.target?.value)}
                />
              </div>
              
              <Input
                label="Versão"
                type="text"
                placeholder="1.0.0"
                value={formData?.version}
                onChange={(e) => handleInputChange('version', e?.target?.value)}
              />
            </div>
          </div>

          {/* Endpoint Configuration */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
              <Icon name="Globe" size={20} className="mr-2" />
              Configuração do Endpoint
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <Select
                label="Método HTTP"
                options={methodOptions}
                value={formData?.method}
                onChange={(value) => handleInputChange('method', value)}
              />
              
              <div className="md:col-span-3">
                <Input
                  label="URL do Endpoint"
                  type="url"
                  placeholder="https://api.exemplo.com/v1/endpoint"
                  value={formData?.endpoint}
                  onChange={(e) => handleInputChange('endpoint', e?.target?.value)}
                  error={errors?.endpoint}
                  required
                />
              </div>
            </div>

            {/* Headers */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-medium text-foreground">Headers HTTP</label>
                <Button
                  variant="outline"
                  size="sm"
                  iconName="Plus"
                  onClick={() => addArrayItem('headers')}
                >
                  Adicionar
                </Button>
              </div>
              
              {formData?.headers?.map((header, index) => (
                <div key={index} className="flex items-center space-x-2 mb-2">
                  <Input
                    placeholder="Nome do header"
                    value={header?.key}
                    onChange={(e) => handleArrayChange('headers', index, 'key', e?.target?.value)}
                    className="flex-1"
                  />
                  <Input
                    placeholder="Valor do header"
                    value={header?.value}
                    onChange={(e) => handleArrayChange('headers', index, 'value', e?.target?.value)}
                    className="flex-1"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    iconName="Trash2"
                    onClick={() => removeArrayItem('headers', index)}
                    className="text-error hover:text-error"
                  />
                </div>
              ))}
            </div>

            {/* Query Parameters */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-medium text-foreground">Parâmetros de Query</label>
                <Button
                  variant="outline"
                  size="sm"
                  iconName="Plus"
                  onClick={() => addArrayItem('queryParams')}
                >
                  Adicionar
                </Button>
              </div>
              
              {formData?.queryParams?.map((param, index) => (
                <div key={index} className="flex items-center space-x-2 mb-2">
                  <Input
                    placeholder="Nome do parâmetro"
                    value={param?.key}
                    onChange={(e) => handleArrayChange('queryParams', index, 'key', e?.target?.value)}
                    className="flex-1"
                  />
                  <Input
                    placeholder="Valor do parâmetro"
                    value={param?.value}
                    onChange={(e) => handleArrayChange('queryParams', index, 'value', e?.target?.value)}
                    className="flex-1"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    iconName="Trash2"
                    onClick={() => removeArrayItem('queryParams', index)}
                    className="text-error hover:text-error"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Authentication */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
              <Icon name="Shield" size={20} className="mr-2" />
              Autenticação
            </h3>
            
            <div className="space-y-4">
              <Select
                label="Tipo de Autenticação"
                options={authTypeOptions}
                value={formData?.authType}
                onChange={(value) => handleInputChange('authType', value)}
              />
              
              {formData?.authType === 'bearer' && (
                <Input
                  label="Bearer Token"
                  type="password"
                  placeholder="Insira o token de autenticação"
                  value={formData?.authToken}
                  onChange={(e) => handleInputChange('authToken', e?.target?.value)}
                  error={errors?.authToken}
                />
              )}
              
              {formData?.authType === 'basic' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Usuário"
                    type="text"
                    placeholder="Nome de usuário"
                    value={formData?.authUsername}
                    onChange={(e) => handleInputChange('authUsername', e?.target?.value)}
                    error={errors?.authUsername}
                  />
                  <Input
                    label="Senha"
                    type="password"
                    placeholder="Senha"
                    value={formData?.authPassword}
                    onChange={(e) => handleInputChange('authPassword', e?.target?.value)}
                  />
                </div>
              )}
              
              {formData?.authType === 'apikey' && (
                <Input
                  label="API Key"
                  type="password"
                  placeholder="Insira a chave da API"
                  value={formData?.authToken}
                  onChange={(e) => handleInputChange('authToken', e?.target?.value)}
                />
              )}
            </div>
          </div>

          {/* Advanced Settings */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
              <Icon name="Settings" size={20} className="mr-2" />
              Configurações Avançadas
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Input
                label="Timeout (ms)"
                type="number"
                placeholder="30000"
                value={formData?.timeout}
                onChange={(e) => handleInputChange('timeout', parseInt(e?.target?.value) || 0)}
                error={errors?.timeout}
              />
              
              <Input
                label="Tentativas de Retry"
                type="number"
                placeholder="3"
                value={formData?.retryAttempts}
                onChange={(e) => handleInputChange('retryAttempts', parseInt(e?.target?.value) || 0)}
                error={errors?.retryAttempts}
              />
              
              <Input
                label="Delay entre Retries (ms)"
                type="number"
                placeholder="1000"
                value={formData?.retryDelay}
                onChange={(e) => handleInputChange('retryDelay', parseInt(e?.target?.value) || 0)}
              />
            </div>

            <div className="mb-6">
              <Input
                label="URL do Webhook (opcional)"
                type="url"
                placeholder="https://webhook.exemplo.com/callback"
                value={formData?.webhookUrl}
                onChange={(e) => handleInputChange('webhookUrl', e?.target?.value)}
              />
            </div>

            {/* Rate Limiting */}
            <div className="space-y-4">
              <Checkbox
                label="Habilitar Rate Limiting"
                checked={formData?.enableRateLimit}
                onChange={(e) => handleInputChange('enableRateLimit', e?.target?.checked)}
              />
              
              {formData?.enableRateLimit && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-6">
                  <Input
                    label="Máximo de Requisições"
                    type="number"
                    placeholder="100"
                    value={formData?.rateLimitRequests}
                    onChange={(e) => handleInputChange('rateLimitRequests', parseInt(e?.target?.value) || 0)}
                  />
                  <Input
                    label="Janela de Tempo (segundos)"
                    type="number"
                    placeholder="60"
                    value={formData?.rateLimitWindow}
                    onChange={(e) => handleInputChange('rateLimitWindow', parseInt(e?.target?.value) || 0)}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Custom Fields */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
              <Icon name="Wrench" size={20} className="mr-2" />
              Campos Personalizados
            </h3>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Rótulo do Campo 1"
                  type="text"
                  placeholder="Nome do campo personalizado"
                  value={formData?.customField1Label}
                  onChange={(e) => handleInputChange('customField1Label', e?.target?.value)}
                />
                <Input
                  label="Valor do Campo 1"
                  type="text"
                  placeholder="Valor do campo"
                  value={formData?.customField1}
                  onChange={(e) => handleInputChange('customField1', e?.target?.value)}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Rótulo do Campo 2"
                  type="text"
                  placeholder="Nome do campo personalizado"
                  value={formData?.customField2Label}
                  onChange={(e) => handleInputChange('customField2Label', e?.target?.value)}
                />
                <Input
                  label="Valor do Campo 2"
                  type="text"
                  placeholder="Valor do campo"
                  value={formData?.customField2}
                  onChange={(e) => handleInputChange('customField2', e?.target?.value)}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Rótulo do Campo 3"
                  type="text"
                  placeholder="Nome do campo personalizado"
                  value={formData?.customField3Label}
                  onChange={(e) => handleInputChange('customField3Label', e?.target?.value)}
                />
                <Input
                  label="Valor do Campo 3"
                  type="text"
                  placeholder="Valor do campo"
                  value={formData?.customField3}
                  onChange={(e) => handleInputChange('customField3', e?.target?.value)}
                />
              </div>
            </div>
          </div>

          {/* Test Results */}
          {testResult && (
            <div className={`bg-card border rounded-lg p-6 ${
              testResult?.success ? 'border-success' : 'border-error'
            }`}>
              <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                <Icon 
                  name={testResult?.success ? 'CheckCircle' : 'XCircle'} 
                  size={20} 
                  className={`mr-2 ${testResult?.success ? 'text-success' : 'text-error'}`}
                />
                Resultado do Teste
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">Status:</span>
                  <span className={`text-sm font-mono ${
                    testResult?.success ? 'text-success' : 'text-error'
                  }`}>
                    {testResult?.status || 'N/A'}
                  </span>
                </div>
                
                {testResult?.responseTime && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">Tempo de Resposta:</span>
                    <span className="text-sm font-mono text-foreground">
                      {testResult?.responseTime}ms
                    </span>
                  </div>
                )}
                
                <div className="flex items-start justify-between">
                  <span className="text-sm font-medium text-foreground">Mensagem:</span>
                  <span className="text-sm text-muted-foreground text-right max-w-xs">
                    {testResult?.message}
                  </span>
                </div>
                
                {testResult?.error && (
                  <div className="mt-3 p-3 bg-error/10 border border-error/20 rounded-md">
                    <p className="text-sm text-error font-mono">{testResult?.error}</p>
                  </div>
                )}
                
                {testResult?.data && (
                  <div className="mt-3 p-3 bg-success/10 border border-success/20 rounded-md">
                    <pre className="text-xs text-success font-mono overflow-x-auto">
                      {JSON.stringify(testResult?.data, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Footer Actions */}
      <div className="p-6 border-t border-border bg-card">
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            {integration && (
              <span>Última modificação: {new Date(integration.lastModified || Date.now())?.toLocaleString('pt-BR')}</span>
            )}
          </div>
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              onClick={onCancel}
            >
              Cancelar
            </Button>
            <Button
              variant="default"
              iconName="Save"
              iconPosition="left"
              onClick={handleSave}
            >
              Salvar Configuração
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfigurationForm;