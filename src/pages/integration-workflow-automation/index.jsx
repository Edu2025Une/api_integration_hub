import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import Breadcrumb from '../../components/ui/Breadcrumb';
import WorkflowCanvas from './components/WorkflowCanvas';
import ComponentPalette from './components/ComponentPalette';
import WorkflowProperties from './components/WorkflowProperties';
import WorkflowToolbar from './components/WorkflowToolbar';
import TemplateLibrary from './components/TemplateLibrary';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const IntegrationWorkflowAutomation = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [paletteCollapsed, setPaletteCollapsed] = useState(false);
  const [propertiesCollapsed, setPropertiesCollapsed] = useState(false);
  const [templateLibraryOpen, setTemplateLibraryOpen] = useState(false);

  // Workflow state
  const [workflow, setWorkflow] = useState({
    id: 'workflow_001',
    name: 'Fluxo de Integração Principal',
    description: 'Fluxo principal para processamento de dados de integração API',
    environment: 'development',
    autoStart: false,
    timeout: 300,
    maxRetries: 3,
    enableLogging: true,
    nodeCount: 0,
    connectionCount: 0,
    lastModified: new Date()?.toISOString(),
    lastModifiedBy: 'João Silva'
  });

  const [nodes, setNodes] = useState([]);
  const [connections, setConnections] = useState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [executionStatus, setExecutionStatus] = useState({});

  // History for undo/redo
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // Execution history
  const [executionHistory, setExecutionHistory] = useState([
    {
      id: 'exec_001',
      status: 'success',
      timestamp: new Date(Date.now() - 3600000)?.toISOString(),
      duration: 2340,
      error: null
    },
    {
      id: 'exec_002',
      status: 'error',
      timestamp: new Date(Date.now() - 7200000)?.toISOString(),
      duration: 1200,
      error: 'Falha na conexão com API externa: timeout após 30s'
    },
    {
      id: 'exec_003',
      status: 'success',
      timestamp: new Date(Date.now() - 10800000)?.toISOString(),
      duration: 1890,
      error: null
    }
  ]);

  // Update workflow counts when nodes/connections change
  useEffect(() => {
    setWorkflow(prev => ({
      ...prev,
      nodeCount: nodes?.length,
      connectionCount: connections?.length,
      lastModified: new Date()?.toISOString()
    }));
    setHasUnsavedChanges(true);
  }, [nodes, connections]);

  // Save state to history for undo/redo
  const saveToHistory = () => {
    const state = { nodes: [...nodes], connections: [...connections] };
    const newHistory = history?.slice(0, historyIndex + 1);
    newHistory?.push(state);
    setHistory(newHistory);
    setHistoryIndex(newHistory?.length - 1);
  };

  // Node operations
  const handleNodeAdd = (nodeData) => {
    saveToHistory();
    const newNode = {
      ...nodeData,
      id: `node_${Date.now()}`,
      position: { x: 200 + Math.random() * 200, y: 100 + Math.random() * 200 }
    };
    setNodes(prev => [...prev, newNode]);
  };

  const handleNodeUpdate = (nodeId, updates) => {
    setNodes(prev => prev?.map(node => 
      node?.id === nodeId ? { ...node, ...updates } : node
    ));
    
    if (selectedNode?.id === nodeId) {
      setSelectedNode(prev => ({ ...prev, ...updates }));
    }
  };

  const handleNodeDelete = (nodeId) => {
    saveToHistory();
    setNodes(prev => prev?.filter(node => node?.id !== nodeId));
    setConnections(prev => prev?.filter(conn => 
      conn?.from !== nodeId && conn?.to !== nodeId
    ));
    
    if (selectedNode?.id === nodeId) {
      setSelectedNode(null);
    }
  };

  const handleNodeSelect = (node) => {
    setSelectedNode(node);
  };

  // Connection operations
  const handleConnectionAdd = (connectionData) => {
    saveToHistory();
    setConnections(prev => [...prev, connectionData]);
  };

  const handleConnectionDelete = (connectionId) => {
    saveToHistory();
    setConnections(prev => prev?.filter(conn => conn?.id !== connectionId));
  };

  // Workflow operations
  const handleWorkflowUpdate = (updates) => {
    setWorkflow(prev => ({ ...prev, ...updates }));
    setHasUnsavedChanges(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setHasUnsavedChanges(false);
      console.log('Fluxo salvo com sucesso');
    } catch (error) {
      console.error('Erro ao salvar fluxo:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeploy = async (environment) => {
    try {
      console.log(`Implantando fluxo no ambiente: ${environment}`);
      // Simulate deployment
      await new Promise(resolve => setTimeout(resolve, 2000));
      setWorkflow(prev => ({ ...prev, environment }));
      console.log('Fluxo implantado com sucesso');
    } catch (error) {
      console.error('Erro na implantação:', error);
    }
  };

  const handleTest = async () => {
    setIsExecuting(true);
    setExecutionStatus({});
    
    try {
      // Simulate workflow execution
      for (let i = 0; i < nodes?.length; i++) {
        const node = nodes?.[i];
        setExecutionStatus(prev => ({ ...prev, [node?.id]: 'running' }));
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Simulate random success/failure
        const success = Math.random() > 0.2;
        setExecutionStatus(prev => ({ 
          ...prev, 
          [node?.id]: success ? 'success' : 'error' 
        }));
        
        if (!success) break;
      }
      
      // Add to execution history
      const newExecution = {
        id: `exec_${Date.now()}`,
        status: Object.values(executionStatus)?.includes('error') ? 'error' : 'success',
        timestamp: new Date()?.toISOString(),
        duration: nodes?.length * 1000,
        error: Object.values(executionStatus)?.includes('error') ? 
          'Erro simulado durante execução do teste' : null
      };
      
      setExecutionHistory(prev => [newExecution, ...prev]);
      
    } catch (error) {
      console.error('Erro durante teste:', error);
    } finally {
      setIsExecuting(false);
    }
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = e?.target?.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const data = JSON.parse(event?.target?.result);
            setNodes(data?.nodes || []);
            setConnections(data?.connections || []);
            setWorkflow(prev => ({ ...prev, ...data?.workflow }));
            console.log('Fluxo importado com sucesso');
          } catch (error) {
            console.error('Erro ao importar fluxo:', error);
          }
        };
        reader?.readAsText(file);
      }
    };
    input?.click();
  };

  const handleExport = () => {
    const data = {
      workflow,
      nodes,
      connections,
      exportedAt: new Date()?.toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { 
      type: 'application/json' 
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${workflow?.name?.replace(/\s+/g, '_')}.json`;
    a?.click();
    URL.revokeObjectURL(url);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const prevState = history?.[historyIndex - 1];
      setNodes(prevState?.nodes);
      setConnections(prevState?.connections);
      setHistoryIndex(historyIndex - 1);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history?.length - 1) {
      const nextState = history?.[historyIndex + 1];
      setNodes(nextState?.nodes);
      setConnections(nextState?.connections);
      setHistoryIndex(historyIndex + 1);
    }
  };

  const handleTemplateSelect = (template) => {
    // Create nodes from template
    const templateNodes = [];
    const templateConnections = [];
    
    // This would normally parse the template data
    // For demo, create a simple flow
    const startNode = {
      id: `node_${Date.now()}`,
      name: 'Início',
      type: 'Webhook Trigger',
      icon: 'Play',
      category: 'connectors',
      position: { x: 100, y: 100 },
      config: { url: '/webhook/start', method: 'POST' },
      customFields: { field1: '', field2: '', field3: '' }
    };
    
    templateNodes?.push(startNode);
    
    setNodes(templateNodes);
    setConnections(templateConnections);
    setWorkflow(prev => ({
      ...prev,
      name: template?.name,
      description: template?.description
    }));
    
    setTemplateLibraryOpen(false);
    console.log(`Template "${template?.name}" aplicado com sucesso`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header 
        onSidebarToggle={() => setSidebarOpen(!sidebarOpen)}
        sidebarCollapsed={sidebarCollapsed}
      />
      <Sidebar 
        isCollapsed={sidebarCollapsed}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div className={`transition-all duration-200 ${
        sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-60'
      } pt-16`}>
        
        {/* Breadcrumb */}
        <div className="px-6 py-4 border-b border-border">
          <Breadcrumb />
          
          {/* Quick Actions */}
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setTemplateLibraryOpen(true)}
              >
                <Icon name="BookOpen" size={16} className="mr-2" />
                Templates
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setPaletteCollapsed(!paletteCollapsed)}
              >
                <Icon name={paletteCollapsed ? "PanelLeftOpen" : "PanelLeftClose"} size={16} className="mr-2" />
                Paleta
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setPropertiesCollapsed(!propertiesCollapsed)}
              >
                <Icon name={propertiesCollapsed ? "PanelRightOpen" : "PanelRightClose"} size={16} className="mr-2" />
                Propriedades
              </Button>
            </div>

            <div className="flex items-center space-x-2">
              <div className="text-sm text-muted-foreground">
                Última sincronização: {new Date()?.toLocaleTimeString('pt-BR')}
              </div>
            </div>
          </div>
        </div>

        {/* Workflow Toolbar */}
        <WorkflowToolbar
          workflow={workflow}
          onSave={handleSave}
          onDeploy={handleDeploy}
          onTest={handleTest}
          onImport={handleImport}
          onExport={handleExport}
          onUndo={handleUndo}
          onRedo={handleRedo}
          canUndo={historyIndex > 0}
          canRedo={historyIndex < history?.length - 1}
          isExecuting={isExecuting}
          isSaving={isSaving}
          hasUnsavedChanges={hasUnsavedChanges}
        />

        {/* Main Workspace */}
        <div className="flex h-[calc(100vh-200px)]">
          {/* Component Palette */}
          <ComponentPalette
            onNodeAdd={handleNodeAdd}
            isCollapsed={paletteCollapsed}
            onToggle={() => setPaletteCollapsed(!paletteCollapsed)}
          />

          {/* Workflow Canvas */}
          <WorkflowCanvas
            nodes={nodes}
            connections={connections}
            onNodeAdd={handleNodeAdd}
            onNodeUpdate={handleNodeUpdate}
            onNodeDelete={handleNodeDelete}
            onConnectionAdd={handleConnectionAdd}
            onConnectionDelete={handleConnectionDelete}
            selectedNode={selectedNode}
            onNodeSelect={handleNodeSelect}
            isExecuting={isExecuting}
            executionStatus={executionStatus}
          />

          {/* Properties Panel */}
          <WorkflowProperties
            selectedNode={selectedNode}
            onNodeUpdate={handleNodeUpdate}
            workflow={workflow}
            onWorkflowUpdate={handleWorkflowUpdate}
            executionHistory={executionHistory}
            isCollapsed={propertiesCollapsed}
            onToggle={() => setPropertiesCollapsed(!propertiesCollapsed)}
          />
        </div>
      </div>
      {/* Template Library Modal */}
      <TemplateLibrary
        isOpen={templateLibraryOpen}
        onClose={() => setTemplateLibraryOpen(false)}
        onTemplateSelect={handleTemplateSelect}
      />
      {/* Mobile Responsive Message */}
      <div className="lg:hidden fixed inset-0 bg-background flex items-center justify-center p-4 z-50">
        <div className="text-center">
          <Icon name="Monitor" size={48} className="text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-foreground mb-2">
            Melhor Experiência no Desktop
          </h2>
          <p className="text-muted-foreground mb-4">
            O editor de fluxo de trabalho foi otimizado para telas maiores.
            Para uma experiência completa, acesse em um desktop ou tablet.
          </p>
          <Button variant="outline">
            <Icon name="ExternalLink" size={16} className="mr-2" />
            Abrir no Desktop
          </Button>
        </div>
      </div>
    </div>
  );
};

export default IntegrationWorkflowAutomation;