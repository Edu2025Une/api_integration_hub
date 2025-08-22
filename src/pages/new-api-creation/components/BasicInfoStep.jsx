import React from 'react';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Icon from '../../../components/AppIcon';

const BasicInfoStep = ({ formData, updateFormData }) => {
  const categories = [
    { value: 'authentication', label: 'Autenticação' },
    { value: 'payments', label: 'Pagamentos' },
    { value: 'analytics', label: 'Analytics' },
    { value: 'communication', label: 'Comunicação' },
    { value: 'storage', label: 'Armazenamento' },
    { value: 'crm', label: 'CRM' },
    { value: 'ecommerce', label: 'E-commerce' },
    { value: 'social', label: 'Social Media' },
    { value: 'productivity', label: 'Produtividade' },
    { value: 'other', label: 'Outros' }
  ];

  const handleInputChange = (field, value) => {
    updateFormData({ [field]: value });
  };

  const handleCustomFieldChange = (index, field, value) => {
    const customFields = [...formData?.customFields];
    customFields[index] = { ...customFields?.[index], [field]: value };
    updateFormData({ customFields });
  };

  return (
    <div className="space-y-6">
      {/* Basic Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-foreground mb-2">
            Nome da API *
          </label>
          <Input
            type="text"
            placeholder="Ex: User Authentication API"
            value={formData?.name}
            onChange={(e) => handleInputChange('name', e?.target?.value)}
            className="w-full"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Um nome descritivo que identifique claramente sua API
          </p>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-foreground mb-2">
            Descrição *
          </label>
          <textarea
            rows={3}
            placeholder="Descreva a funcionalidade e propósito desta API..."
            value={formData?.description}
            onChange={(e) => handleInputChange('description', e?.target?.value)}
            className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Explique o que esta API faz e como será utilizada
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Categoria *
          </label>
          <Select
            value={formData?.category}
            onValueChange={(value) => handleInputChange('category', value)}
            placeholder="Selecione uma categoria"
            className="w-full"
          >
            {categories?.map(category => (
              <option key={category?.value} value={category?.value}>
                {category?.label}
              </option>
            ))}
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Versão
          </label>
          <Input
            type="text"
            placeholder="1.0.0"
            value={formData?.version}
            onChange={(e) => handleInputChange('version', e?.target?.value)}
            className="w-full"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Versão semântica da API (ex: 1.0.0)
          </p>
        </div>
      </div>

      {/* Custom Fields */}
      <div className="border-t border-border pt-6">
        <div className="flex items-center space-x-2 mb-4">
          <Icon name="Settings" size={20} className="text-muted-foreground" />
          <h3 className="text-lg font-medium text-foreground">
            Campos Personalizados
          </h3>
        </div>
        <p className="text-sm text-muted-foreground mb-6">
          Configure até 3 campos personalizados para armazenar metadados específicos da sua API
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {formData?.customFields?.map((field, index) => (
            <div key={index} className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Nome do Campo {index + 1}
                </label>
                <Input
                  type="text"
                  placeholder={`Campo ${index + 1}`}
                  value={field?.name}
                  onChange={(e) => handleCustomFieldChange(index, 'name', e?.target?.value)}
                  className="w-full"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Tipo
                </label>
                <Select
                  value={field?.type}
                  onValueChange={(value) => handleCustomFieldChange(index, 'type', value)}
                  placeholder="Tipo"
                  className="w-full"
                >
                  <option value="string">Texto</option>
                  <option value="number">Número</option>
                  <option value="boolean">Booleano</option>
                  <option value="date">Data</option>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Valor
                </label>
                <Input
                  type={field?.type === 'number' ? 'number' : field?.type === 'date' ? 'date' : 'text'}
                  placeholder="Valor do campo"
                  value={field?.value}
                  onChange={(e) => handleCustomFieldChange(index, 'value', e?.target?.value)}
                  className="w-full"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* API Documentation Preview */}
      <div className="border-t border-border pt-6">
        <div className="flex items-center space-x-2 mb-4">
          <Icon name="FileText" size={20} className="text-muted-foreground" />
          <h3 className="text-lg font-medium text-foreground">
            Pré-visualização
          </h3>
        </div>
        
        <div className="bg-muted p-4 rounded-lg">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-foreground">Nome:</span>
              <span className="text-sm text-muted-foreground">
                {formData?.name || 'Nome da API'}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-foreground">Categoria:</span>
              <span className="text-sm text-muted-foreground">
                {categories?.find(c => c?.value === formData?.category)?.label || 'Não selecionada'}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-foreground">Versão:</span>
              <span className="text-sm text-muted-foreground">
                {formData?.version || '1.0.0'}
              </span>
            </div>
            {formData?.description && (
              <div className="pt-2 border-t border-border">
                <span className="text-sm font-medium text-foreground block mb-1">Descrição:</span>
                <p className="text-sm text-muted-foreground">
                  {formData?.description}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BasicInfoStep;