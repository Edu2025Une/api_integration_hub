import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const BulkActions = ({ selectedCount }) => {
  const [showDropdown, setShowDropdown] = useState(false);

  const handleAction = (action) => {
    setShowDropdown(false);
    switch (action) {
      case 'activate':
        console.log(`Activate ${selectedCount} APIs`);
        break;
      case 'deactivate':
        console.log(`Deactivate ${selectedCount} APIs`);
        break;
      case 'export':
        console.log(`Export ${selectedCount} APIs`);
        break;
      case 'delete':
        console.log(`Delete ${selectedCount} APIs`);
        break;
      default:
        break;
    }
  };

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setShowDropdown(!showDropdown)}
        className="text-sm"
      >
        <Icon name="Settings" size={16} className="mr-2" />
        Ações em Lote
        <Icon name="ChevronDown" size={16} className="ml-2" />
      </Button>
      
      {showDropdown && (
        <div className="absolute left-0 top-full mt-1 w-48 bg-popover border border-border rounded-md shadow-lg z-20">
          <div className="py-1">
            <button
              onClick={() => handleAction('activate')}
              className="w-full flex items-center px-3 py-2 text-sm hover:bg-muted"
            >
              <Icon name="Play" size={16} className="mr-2 text-success" />
              Ativar Selecionadas
            </button>
            <button
              onClick={() => handleAction('deactivate')}
              className="w-full flex items-center px-3 py-2 text-sm hover:bg-muted"
            >
              <Icon name="Pause" size={16} className="mr-2 text-warning" />
              Desativar Selecionadas
            </button>
            <hr className="my-1" />
            <button
              onClick={() => handleAction('export')}
              className="w-full flex items-center px-3 py-2 text-sm hover:bg-muted"
            >
              <Icon name="Download" size={16} className="mr-2" />
              Exportar Configurações
            </button>
            <hr className="my-1" />
            <button
              onClick={() => handleAction('delete')}
              className="w-full flex items-center px-3 py-2 text-sm hover:bg-muted text-destructive"
            >
              <Icon name="Trash2" size={16} className="mr-2" />
              Excluir Selecionadas
            </button>
          </div>
        </div>
      )}

      {/* Click outside to close dropdown */}
      {showDropdown && (
        <div
          className="fixed inset-0 z-10"
          onClick={() => setShowDropdown(false)}
        />
      )}
    </div>
  );
};

export default BulkActions;