import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Icon from '../../../components/AppIcon';

const TestingStep = ({ formData, updateFormData, onSave, isLoading }) => {
  const [testResult, setTestResult] = useState(null);
  const [testLoading, setTestLoading] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState(formData?.methods?.[0] || 'GET');
  const [testEndpoint, setTestEndpoint] = useState('');
  const [requestBody, setRequestBody] = useState('');

  const runAPITest = async () => {
    setTestLoading(true);
    setTestResult(null);

    try {
      // Simulate API test
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Mock successful response
      const mockResult = {
        success: true,
        status: 200,
        statusText: 'OK',
        responseTime: Math.floor(Math.random() * 200) + 50,
        headers: {
          'content-type': 'application/json',
          'content-length': '156',
          'server': 'nginx/1.18.0'
        },
        data: {
          message: 'API test successful',
          timestamp: new Date()?.toISOString(),
          endpoint: `${formData?.baseUrl}${testEndpoint}`,
          method: selectedMethod
        }
      };

      setTestResult(mockResult);
    } catch (error) {
      setTestResult({
        success: false,
        error: 'Connection timeout',
        status: 0,
        responseTime: 0
      });
    } finally {
      setTestLoading(false);
    }
  };

  const formatJSON = (obj) => {
    return JSON.stringify(obj, null, 2);
  };

  const getStatusColor = (status) => {
    if (status >= 200 && status < 300) return 'text-success';
    if (status >= 300 && status < 400) return 'text-warning';
    return 'text-destructive';
  };

  const handleDeploy = () => {
    onSave(false); // Not a draft, deploy immediately
  };

  const handleSaveDraft = () => {
    onSave(true); // Save as draft
  };

  return (
    <div className="space-y-6">
      {/* API Configuration Summary */}
      <div className="bg-muted p-6 rounded-lg">
        <h3 className="text-lg font-medium text-foreground mb-4">
          Resumo da Configuração
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div>
              <span className="text-sm font-medium text-foreground">Nome:</span>
              <p className="text-sm text-muted-foreground">{formData?.name}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-foreground">URL Base:</span>
              <p className="text-sm text-muted-foreground break-all">{formData?.baseUrl}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-foreground">Métodos:</span>
              <p className="text-sm text-muted-foreground">{formData?.methods?.join(', ')}</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <div>
              <span className="text-sm font-medium text-foreground">Autenticação:</span>
              <p className="text-sm text-muted-foreground capitalize">
                {formData?.authType === 'none' ? 'Nenhuma' :
                 formData?.authType === 'apiKey' ? 'API Key' :
                 formData?.authType === 'bearer' ? 'Bearer Token' :
                 formData?.authType === 'basic' ? 'Basic Auth' :
                 formData?.authType}
              </p>
            </div>
            <div>
              <span className="text-sm font-medium text-foreground">Categoria:</span>
              <p className="text-sm text-muted-foreground">{formData?.category}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-foreground">Timeout:</span>
              <p className="text-sm text-muted-foreground">{formData?.timeout}s</p>
            </div>
          </div>
        </div>
      </div>

      {/* API Testing Section */}
      <div className="border border-border rounded-lg p-6">
        <div className="flex items-center space-x-2 mb-6">
          <Icon name="TestTube" size={20} className="text-primary" />
          <h3 className="text-lg font-medium text-foreground">
            Testar API
          </h3>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Método HTTP
              </label>
              <Select
                value={selectedMethod}
                onValueChange={setSelectedMethod}
                className="w-full"
              >
                {formData?.methods?.map(method => (
                  <option key={method} value={method}>{method}</option>
                ))}
              </Select>
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-foreground mb-2">
                Endpoint (opcional)
              </label>
              <Input
                type="text"
                placeholder="/endpoint ou deixe vazio para testar a URL base"
                value={testEndpoint}
                onChange={(e) => setTestEndpoint(e?.target?.value)}
                className="w-full"
              />
            </div>
          </div>

          {(selectedMethod === 'POST' || selectedMethod === 'PUT' || selectedMethod === 'PATCH') && (
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Body da Requisição (JSON)
              </label>
              <textarea
                rows={4}
                placeholder='{"key": "value"}'
                value={requestBody}
                onChange={(e) => setRequestBody(e?.target?.value)}
                className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          )}

          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              URL completa: {formData?.baseUrl}{testEndpoint}
            </p>
            
            <Button
              onClick={runAPITest}
              disabled={testLoading}
            >
              {testLoading ? (
                <Icon name="Loader2" size={16} className="mr-2 animate-spin" />
              ) : (
                <Icon name="Play" size={16} className="mr-2" />
              )}
              {testLoading ? 'Testando...' : 'Executar Teste'}
            </Button>
          </div>
        </div>

        {/* Test Results */}
        {testResult && (
          <div className="mt-6 border-t border-border pt-6">
            <h4 className="font-medium text-foreground mb-4">Resultado do Teste</h4>
            
            <div className="space-y-4">
              {/* Status */}
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Icon 
                    name={testResult?.success ? "CheckCircle" : "XCircle"} 
                    size={20} 
                    className={testResult?.success ? "text-success" : "text-destructive"} 
                  />
                  <span className="font-medium">
                    {testResult?.success ? 'Sucesso' : 'Erro'}
                  </span>
                </div>
                
                {testResult?.status && (
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-muted-foreground">Status:</span>
                    <span className={`font-medium ${getStatusColor(testResult?.status)}`}>
                      {testResult?.status} {testResult?.statusText}
                    </span>
                  </div>
                )}
                
                {testResult?.responseTime && (
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-muted-foreground">Tempo:</span>
                    <span className="font-medium text-foreground">
                      {testResult?.responseTime}ms
                    </span>
                  </div>
                )}
              </div>

              {/* Response */}
              {testResult?.success && testResult?.data && (
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Resposta:
                  </label>
                  <pre className="bg-muted p-4 rounded-md text-sm overflow-x-auto">
                    {formatJSON(testResult?.data)}
                  </pre>
                </div>
              )}

              {/* Error */}
              {!testResult?.success && testResult?.error && (
                <div>
                  <label className="block text-sm font-medium text-destructive mb-2">
                    Erro:
                  </label>
                  <div className="bg-destructive/10 border border-destructive/20 p-4 rounded-md">
                    <p className="text-destructive text-sm">{testResult?.error}</p>
                  </div>
                </div>
              )}

              {/* Headers */}
              {testResult?.headers && (
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Headers de Resposta:
                  </label>
                  <pre className="bg-muted p-4 rounded-md text-sm overflow-x-auto">
                    {formatJSON(testResult?.headers)}
                  </pre>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Deployment Actions */}
      <div className="border border-border rounded-lg p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Icon name="Rocket" size={20} className="text-primary" />
          <h3 className="text-lg font-medium text-foreground">
            Finalizar Criação
          </h3>
        </div>
        
        <p className="text-sm text-muted-foreground mb-6">
          Sua API está pronta para ser criada. Você pode salvá-la como rascunho para editar mais tarde 
          ou deployar imediatamente para começar a usá-la.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            variant="outline"
            onClick={handleSaveDraft}
            disabled={isLoading}
            className="flex-1"
          >
            {isLoading ? (
              <Icon name="Loader2" size={16} className="mr-2 animate-spin" />
            ) : (
              <Icon name="Save" size={16} className="mr-2" />
            )}
            Salvar como Rascunho
          </Button>
          
          <Button
            onClick={handleDeploy}
            disabled={isLoading}
            className="flex-1"
          >
            {isLoading ? (
              <Icon name="Loader2" size={16} className="mr-2 animate-spin" />
            ) : (
              <Icon name="Rocket" size={16} className="mr-2" />
            )}
            Criar e Deployar API
          </Button>
        </div>

        {testResult?.success && (
          <div className="mt-4 p-4 bg-success/10 border border-success/20 rounded-md">
            <div className="flex items-center space-x-2">
              <Icon name="CheckCircle" size={16} className="text-success" />
              <span className="text-sm font-medium text-success">
                Teste bem-sucedido! Sua API está pronta para deploy.
              </span>
            </div>
          </div>
        )}

        {testResult && !testResult?.success && (
          <div className="mt-4 p-4 bg-warning/10 border border-warning/20 rounded-md">
            <div className="flex items-center space-x-2">
              <Icon name="AlertTriangle" size={16} className="text-warning" />
              <span className="text-sm font-medium text-warning">
                O teste falhou. Verifique as configurações antes do deploy.
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TestingStep;