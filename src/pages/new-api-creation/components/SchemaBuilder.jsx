import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Icon from '../../../components/AppIcon';

const SchemaBuilder = ({ schema, onSchemaChange, type = 'request' }) => {
  const [expandedFields, setExpandedFields] = useState(new Set());

  const fieldTypes = [
    'string',
    'number',
    'integer',
    'boolean',
    'array',
    'object',
    'null'
  ];

  const addField = (parentPath = '') => {
    const newSchema = { ...schema };
    const fieldPath = parentPath ? `${parentPath}.properties` : 'properties';
    const fieldName = `field_${Date.now()}`;
    
    if (!getNestedProperty(newSchema, fieldPath)) {
      setNestedProperty(newSchema, fieldPath, {});
    }
    
    setNestedProperty(newSchema, `${fieldPath}.${fieldName}`, {
      type: 'string',
      description: ''
    });
    
    onSchemaChange(newSchema);
  };

  const removeField = (fieldPath) => {
    const newSchema = { ...schema };
    const pathParts = fieldPath?.split('.');
    const fieldName = pathParts?.pop();
    const parentPath = pathParts?.join('.');
    const parent = getNestedProperty(newSchema, parentPath);
    
    if (parent && fieldName) {
      delete parent?.[fieldName];
      onSchemaChange(newSchema);
    }
  };

  const updateField = (fieldPath, updates) => {
    const newSchema = { ...schema };
    const field = getNestedProperty(newSchema, fieldPath);
    
    if (field) {
      Object.assign(field, updates);
      onSchemaChange(newSchema);
    }
  };

  const getNestedProperty = (obj, path) => {
    return path?.split('.')?.reduce((current, key) => {
      return current && current?.[key] !== undefined ? current?.[key] : undefined;
    }, obj);
  };

  const setNestedProperty = (obj, path, value) => {
    const keys = path?.split('.');
    let current = obj;
    
    for (let i = 0; i < keys?.length - 1; i++) {
      const key = keys?.[i];
      if (!current?.[key] || typeof current?.[key] !== 'object') {
        current[key] = {};
      }
      current = current?.[key];
    }
    
    current[keys[keys.length - 1]] = value;
  };

  const toggleFieldExpansion = (fieldPath) => {
    const newExpanded = new Set(expandedFields);
    if (newExpanded?.has(fieldPath)) {
      newExpanded?.delete(fieldPath);
    } else {
      newExpanded?.add(fieldPath);
    }
    setExpandedFields(newExpanded);
  };

  const renderField = (fieldName, fieldData, fieldPath, level = 0) => {
    const isExpanded = expandedFields?.has(fieldPath);
    const hasProperties = fieldData?.type === 'object' && fieldData?.properties;

    return (
      <div key={fieldPath} className={`border border-border rounded-lg p-4 ${level > 0 ? 'ml-6 mt-2' : 'mb-4'}`}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            {hasProperties && (
              <button
                onClick={() => toggleFieldExpansion(fieldPath)}
                className="text-muted-foreground hover:text-foreground"
              >
                <Icon name={isExpanded ? "ChevronDown" : "ChevronRight"} size={16} />
              </button>
            )}
            <span className="font-medium text-foreground">{fieldName}</span>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => removeField(fieldPath)}
            className="text-destructive hover:text-destructive"
          >
            <Icon name="Trash2" size={14} />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-foreground mb-1">
              Tipo
            </label>
            <Select
              value={fieldData?.type || 'string'}
              onValueChange={(value) => updateField(fieldPath, { type: value })}
              className="w-full"
            >
              {fieldTypes?.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </Select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-medium text-foreground mb-1">
              Descrição
            </label>
            <Input
              type="text"
              placeholder="Descreva este campo..."
              value={fieldData?.description || ''}
              onChange={(e) => updateField(fieldPath, { description: e?.target?.value })}
              className="w-full"
            />
          </div>
        </div>

        {/* Additional properties for specific types */}
        {fieldData?.type === 'array' && (
          <div className="mt-4 p-3 bg-muted rounded-md">
            <label className="block text-xs font-medium text-foreground mb-2">
              Tipo dos itens do array
            </label>
            <Select
              value={fieldData?.items?.type || 'string'}
              onValueChange={(value) => updateField(fieldPath, { 
                items: { ...fieldData?.items, type: value } 
              })}
              className="w-full md:w-1/3"
            >
              {fieldTypes?.filter(type => type !== 'array')?.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </Select>
          </div>
        )}

        {fieldData?.type === 'string' && (
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-foreground mb-1">
                Comprimento mínimo
              </label>
              <Input
                type="number"
                min="0"
                value={fieldData?.minLength || ''}
                onChange={(e) => updateField(fieldPath, { 
                  minLength: e?.target?.value ? parseInt(e?.target?.value) : undefined 
                })}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-foreground mb-1">
                Comprimento máximo
              </label>
              <Input
                type="number"
                min="0"
                value={fieldData?.maxLength || ''}
                onChange={(e) => updateField(fieldPath, { 
                  maxLength: e?.target?.value ? parseInt(e?.target?.value) : undefined 
                })}
                className="w-full"
              />
            </div>
          </div>
        )}

        {(fieldData?.type === 'number' || fieldData?.type === 'integer') && (
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-foreground mb-1">
                Valor mínimo
              </label>
              <Input
                type="number"
                value={fieldData?.minimum || ''}
                onChange={(e) => updateField(fieldPath, { 
                  minimum: e?.target?.value ? parseFloat(e?.target?.value) : undefined 
                })}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-foreground mb-1">
                Valor máximo
              </label>
              <Input
                type="number"
                value={fieldData?.maximum || ''}
                onChange={(e) => updateField(fieldPath, { 
                  maximum: e?.target?.value ? parseFloat(e?.target?.value) : undefined 
                })}
                className="w-full"
              />
            </div>
          </div>
        )}

        {/* Nested object properties */}
        {fieldData?.type === 'object' && isExpanded && (
          <div className="mt-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-medium text-foreground">Propriedades</h4>
              <Button
                variant="outline"
                size="sm"
                onClick={() => addField(fieldPath)}
              >
                <Icon name="Plus" size={14} className="mr-1" />
                Adicionar Propriedade
              </Button>
            </div>
            
            {fieldData?.properties && Object.entries(fieldData?.properties)?.map(([propName, propData]) =>
              renderField(propName, propData, `${fieldPath}.properties.${propName}`, level + 1)
            )}
          </div>
        )}
      </div>
    );
  };

  const generateExample = () => {
    const example = generateExampleFromSchema(schema);
    return JSON.stringify(example, null, 2);
  };

  const generateExampleFromSchema = (schemaObj) => {
    if (!schemaObj || !schemaObj?.properties) return {};

    const example = {};
    
    Object.entries(schemaObj?.properties)?.forEach(([key, field]) => {
      switch (field?.type) {
        case 'string':
          example[key] = field?.description ? `exemplo_${key}` : 'string';
          break;
        case 'number':
          example[key] = 123.45;
          break;
        case 'integer':
          example[key] = 123;
          break;
        case 'boolean':
          example[key] = true;
          break;
        case 'array':
          example[key] = field?.items?.type === 'object' 
            ? [generateExampleFromSchema({ properties: field?.items?.properties || {} })]
            : ['item1', 'item2'];
          break;
        case 'object':
          example[key] = generateExampleFromSchema(field);
          break;
        case 'null':
          example[key] = null;
          break;
        default:
          example[key] = 'valor';
      }
    });
    
    return example;
  };

  const importFromJSON = () => {
    const jsonInput = prompt('Cole o JSON schema aqui:');
    if (jsonInput) {
      try {
        const parsedSchema = JSON.parse(jsonInput);
        onSchemaChange(parsedSchema);
      } catch (error) {
        alert('JSON inválido. Por favor, verifique o formato.');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Icon name="FileCode" size={20} className="text-primary" />
          <h3 className="text-lg font-medium text-foreground">
            Schema {type === 'request' ? 'da Requisição' : 'da Resposta'}
          </h3>
        </div>
        
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={importFromJSON}
          >
            <Icon name="Upload" size={14} className="mr-2" />
            Importar JSON
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => addField()}
          >
            <Icon name="Plus" size={14} className="mr-2" />
            Adicionar Campo
          </Button>
        </div>
      </div>

      {/* Schema Fields */}
      <div className="space-y-4">
        {schema?.properties && Object.entries(schema?.properties)?.map(([fieldName, fieldData]) =>
          renderField(fieldName, fieldData, `properties.${fieldName}`)
        )}
        
        {!schema?.properties || Object.keys(schema?.properties)?.length === 0 && (
          <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
            <Icon name="FileCode" size={48} className="mx-auto mb-4 text-muted-foreground" />
            <h4 className="text-lg font-medium text-foreground mb-2">
              Nenhum campo definido
            </h4>
            <p className="text-muted-foreground mb-4">
              Adicione campos para definir a estrutura do {type === 'request' ? 'request' : 'response'}
            </p>
            <Button onClick={() => addField()}>
              <Icon name="Plus" size={16} className="mr-2" />
              Adicionar Primeiro Campo
            </Button>
          </div>
        )}
      </div>

      {/* Example Preview */}
      {schema?.properties && Object.keys(schema?.properties)?.length > 0 && (
        <div className="border-t border-border pt-6">
          <h4 className="font-medium text-foreground mb-3">
            Exemplo de {type === 'request' ? 'Requisição' : 'Resposta'}
          </h4>
          <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
            {generateExample()}
          </pre>
        </div>
      )}
    </div>
  );
};

export default SchemaBuilder;