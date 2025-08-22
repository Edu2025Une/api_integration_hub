import React, { useState } from 'react';
import Input from '../../../components/ui/Input';

import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const AuthenticationStep = ({ formData, updateFormData }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showToken, setShowToken] = useState(false);

  const authTypes = [
    { value: 'none', label: 'Nenhuma', description: 'API pública sem autenticação' },
    { value: 'apiKey', label: 'API Key', description: 'Chave de API no header ou query' },
    { value: 'bearer', label: 'Bearer Token', description: 'Token JWT ou OAuth no header' },
    { value: 'basic', label: 'Basic Auth', description: 'Usuário e senha codificados em base64' }
  ];

  const handleAuthTypeChange = (value) => {
    updateFormData({ authType: value });
    
    // Clear other auth fields when changing type
    if (value !== 'apiKey') updateFormData({ apiKey: '' });
    if (value !== 'bearer') updateFormData({ bearerToken: '' });
    if (value !== 'basic') updateFormData({ basicAuth: { username: '', password: '' } });
  };

  const handleInputChange = (field, value) => {
    updateFormData({ [field]: value });
  };

  const handleBasicAuthChange = (field, value) => {
    const basicAuth = {
      ...formData?.basicAuth,
      [field]: value
    };
    updateFormData({ basicAuth });
  };

  const generateApiKey = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 32; i++) {
      result += chars?.charAt(Math.floor(Math.random() * chars?.length));
    }
    updateFormData({ apiKey: result });
  };

  const testAuthentication = () => {
    console.log('Testing authentication with:', formData?.authType);
    // Simulate authentication test
  };

  return (
    <div className="space-y-6">
      {/* Authentication Type Selection */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-4">
          Tipo de Autenticação
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {authTypes?.map(type => (
            <div
              key={type?.value}
              onClick={() => handleAuthTypeChange(type?.value)}
              className={`p-4 border rounded-lg cursor-pointer transition-all ${
                formData?.authType === type?.value
                  ? 'border-primary bg-primary/5 ring-2 ring-primary/20' :'border-border hover:border-muted-foreground hover:bg-muted/50'
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className={`w-4 h-4 rounded-full border-2 mt-0.5 ${
                  formData?.authType === type?.value
                    ? 'border-primary bg-primary' :'border-muted-foreground'
                }`}>
                  {formData?.authType === type?.value && (
                    <div className="w-2 h-2 bg-primary-foreground rounded-full m-0.5" />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-foreground">{type?.label}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {type?.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* API Key Configuration */}
      {formData?.authType === 'apiKey' && (
        <div className="border border-border rounded-lg p-6 space-y-4">
          <div className="flex items-center space-x-2">
            <Icon name="Key" size={20} className="text-primary" />
            <h3 className="text-lg font-medium text-foreground">Configuração da API Key</h3>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              API Key
            </label>
            <div className="flex space-x-2">
              <Input
                type="password"
                placeholder="Insira sua API key"
                value={formData?.apiKey}
                onChange={(e) => handleInputChange('apiKey', e?.target?.value)}
                className="flex-1"
              />
              <Button
                type="button"
                variant="outline"
                onClick={generateApiKey}
              >
                <Icon name="RefreshCw" size={16} className="mr-2" />
                Gerar
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              A API key será enviada no header "X-API-Key"
            </p>
          </div>

          {formData?.apiKey && (
            <div className="bg-muted p-3 rounded-md">
              <p className="text-sm font-medium text-foreground mb-1">Preview do Header:</p>
              <code className="text-sm text-muted-foreground">
                X-API-Key: {formData?.apiKey?.substring(0, 8)}...
              </code>
            </div>
          )}
        </div>
      )}

      {/* Bearer Token Configuration */}
      {formData?.authType === 'bearer' && (
        <div className="border border-border rounded-lg p-6 space-y-4">
          <div className="flex items-center space-x-2">
            <Icon name="Shield" size={20} className="text-primary" />
            <h3 className="text-lg font-medium text-foreground">Configuração do Bearer Token</h3>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Bearer Token
            </label>
            <div className="relative">
              <Input
                type={showToken ? "text" : "password"}
                placeholder="Insira seu Bearer token (JWT, OAuth, etc.)"
                value={formData?.bearerToken}
                onChange={(e) => handleInputChange('bearerToken', e?.target?.value)}
                className="w-full pr-10"
              />
              <button
                type="button"
                onClick={() => setShowToken(!showToken)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <Icon name={showToken ? "EyeOff" : "Eye"} size={16} />
              </button>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              O token será enviado no header "Authorization: Bearer [token]"
            </p>
          </div>

          {formData?.bearerToken && (
            <div className="bg-muted p-3 rounded-md">
              <p className="text-sm font-medium text-foreground mb-1">Preview do Header:</p>
              <code className="text-sm text-muted-foreground">
                Authorization: Bearer {formData?.bearerToken?.substring(0, 20)}...
              </code>
            </div>
          )}
        </div>
      )}

      {/* Basic Auth Configuration */}
      {formData?.authType === 'basic' && (
        <div className="border border-border rounded-lg p-6 space-y-4">
          <div className="flex items-center space-x-2">
            <Icon name="User" size={20} className="text-primary" />
            <h3 className="text-lg font-medium text-foreground">Configuração Basic Auth</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Usuário
              </label>
              <Input
                type="text"
                placeholder="username"
                value={formData?.basicAuth?.username}
                onChange={(e) => handleBasicAuthChange('username', e?.target?.value)}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Senha
              </label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="password"
                  value={formData?.basicAuth?.password}
                  onChange={(e) => handleBasicAuthChange('password', e?.target?.value)}
                  className="w-full pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <Icon name={showPassword ? "EyeOff" : "Eye"} size={16} />
                </button>
              </div>
            </div>
          </div>

          {formData?.basicAuth?.username && formData?.basicAuth?.password && (
            <div className="bg-muted p-3 rounded-md">
              <p className="text-sm font-medium text-foreground mb-1">Preview do Header:</p>
              <code className="text-sm text-muted-foreground">
                Authorization: Basic {btoa(formData?.basicAuth?.username + ':' + formData?.basicAuth?.password)?.substring(0, 20)}...
              </code>
            </div>
          )}

          <p className="text-xs text-muted-foreground">
            As credenciais serão codificadas em base64 e enviadas no header "Authorization"
          </p>
        </div>
      )}

      {/* No Authentication */}
      {formData?.authType === 'none' && (
        <div className="border border-border rounded-lg p-6 text-center">
          <Icon name="Globe" size={48} className="mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-medium text-foreground mb-2">API Pública</h3>
          <p className="text-muted-foreground">
            Esta API não requer autenticação. Todas as requisições serão enviadas sem credenciais.
          </p>
        </div>
      )}

      {/* Test Authentication */}
      {formData?.authType !== 'none' && (
        <div className="border-t border-border pt-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-foreground mb-2">
                Testar Autenticação
              </h3>
              <p className="text-sm text-muted-foreground">
                Verifique se suas credenciais estão funcionando corretamente
              </p>
            </div>
            
            <Button
              onClick={testAuthentication}
              variant="outline"
              disabled={
                (formData?.authType === 'apiKey' && !formData?.apiKey) ||
                (formData?.authType === 'bearer' && !formData?.bearerToken) ||
                (formData?.authType === 'basic' && (!formData?.basicAuth?.username || !formData?.basicAuth?.password))
              }
            >
              <Icon name="TestTube" size={16} className="mr-2" />
              Testar Conexão
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuthenticationStep;