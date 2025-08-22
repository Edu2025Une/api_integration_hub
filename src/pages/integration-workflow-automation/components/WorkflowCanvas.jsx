import React, { useState, useRef, useCallback } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const WorkflowCanvas = ({ 
  nodes, 
  connections, 
  onNodeAdd, 
  onNodeUpdate, 
  onNodeDelete, 
  onConnectionAdd, 
  onConnectionDelete,
  selectedNode,
  onNodeSelect,
  isExecuting,
  executionStatus
}) => {
  const canvasRef = useRef(null);
  const [draggedNode, setDraggedNode] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [connecting, setConnecting] = useState(null);
  const [canvasOffset, setCanvasOffset] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);

  const handleNodeDragStart = useCallback((e, node) => {
    const rect = canvasRef?.current?.getBoundingClientRect();
    setDragOffset({
      x: e?.clientX - rect?.left - node?.position?.x,
      y: e?.clientY - rect?.top - node?.position?.y
    });
    setDraggedNode(node);
  }, []);

  const handleNodeDrag = useCallback((e) => {
    if (!draggedNode) return;
    
    const rect = canvasRef?.current?.getBoundingClientRect();
    const newPosition = {
      x: e?.clientX - rect?.left - dragOffset?.x,
      y: e?.clientY - rect?.top - dragOffset?.y
    };
    
    onNodeUpdate(draggedNode?.id, { position: newPosition });
  }, [draggedNode, dragOffset, onNodeUpdate]);

  const handleNodeDragEnd = useCallback(() => {
    setDraggedNode(null);
    setDragOffset({ x: 0, y: 0 });
  }, []);

  const handleConnectionStart = useCallback((nodeId, outputPort) => {
    setConnecting({ from: nodeId, port: outputPort });
  }, []);

  const handleConnectionEnd = useCallback((nodeId, inputPort) => {
    if (connecting && connecting?.from !== nodeId) {
      onConnectionAdd({
        id: `conn_${Date.now()}`,
        from: connecting?.from,
        to: nodeId,
        fromPort: connecting?.port,
        toPort: inputPort
      });
    }
    setConnecting(null);
  }, [connecting, onConnectionAdd]);

  const getNodeStatusColor = (nodeId) => {
    if (!isExecuting) return 'border-border';
    
    const status = executionStatus?.[nodeId];
    switch (status) {
      case 'running': return 'border-warning animate-pulse';
      case 'success': return 'border-success';
      case 'error': return 'border-error';
      default: return 'border-border';
    }
  };

  const renderNode = (node) => {
    const isSelected = selectedNode?.id === node?.id;
    const statusColor = getNodeStatusColor(node?.id);
    
    return (
      <div
        key={node?.id}
        className={`absolute bg-card border-2 ${statusColor} rounded-lg shadow-md cursor-move select-none transition-all duration-200 ${
          isSelected ? 'ring-2 ring-primary' : ''
        }`}
        style={{
          left: node?.position?.x,
          top: node?.position?.y,
          width: '180px',
          minHeight: '80px'
        }}
        onMouseDown={(e) => handleNodeDragStart(e, node)}
        onClick={() => onNodeSelect(node)}
      >
        {/* Node Header */}
        <div className="flex items-center justify-between p-3 border-b border-border">
          <div className="flex items-center space-x-2">
            <Icon name={node?.icon} size={16} className="text-primary" />
            <span className="text-sm font-medium text-foreground truncate">
              {node?.name}
            </span>
          </div>
          <Button
            variant="ghost"
            size="xs"
            onClick={(e) => {
              e?.stopPropagation();
              onNodeDelete(node?.id);
            }}
          >
            <Icon name="X" size={12} />
          </Button>
        </div>
        {/* Node Content */}
        <div className="p-3">
          <p className="text-xs text-muted-foreground mb-2">{node?.type}</p>
          {node?.config?.endpoint && (
            <p className="text-xs text-foreground font-mono truncate">
              {node?.config?.endpoint}
            </p>
          )}
        </div>
        {/* Connection Points */}
        <div className="absolute -left-2 top-1/2 transform -translate-y-1/2">
          <div
            className="w-4 h-4 bg-muted border-2 border-border rounded-full cursor-pointer hover:bg-primary hover:border-primary transition-colors"
            onClick={() => handleConnectionEnd(node?.id, 'input')}
          />
        </div>
        <div className="absolute -right-2 top-1/2 transform -translate-y-1/2">
          <div
            className="w-4 h-4 bg-muted border-2 border-border rounded-full cursor-pointer hover:bg-primary hover:border-primary transition-colors"
            onClick={() => handleConnectionStart(node?.id, 'output')}
          />
        </div>
        {/* Execution Status Indicator */}
        {isExecuting && executionStatus?.[node?.id] && (
          <div className="absolute -top-2 -right-2">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs ${
              executionStatus?.[node?.id] === 'running' ? 'bg-warning' :
              executionStatus?.[node?.id] === 'success' ? 'bg-success' :
              executionStatus?.[node?.id] === 'error' ? 'bg-error' : 'bg-muted'
            }`}>
              {executionStatus?.[node?.id] === 'running' && <Icon name="Loader2" size={12} className="animate-spin" />}
              {executionStatus?.[node?.id] === 'success' && <Icon name="Check" size={12} />}
              {executionStatus?.[node?.id] === 'error' && <Icon name="X" size={12} />}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderConnection = (connection) => {
    const fromNode = nodes?.find(n => n?.id === connection?.from);
    const toNode = nodes?.find(n => n?.id === connection?.to);
    
    if (!fromNode || !toNode) return null;

    const fromX = fromNode?.position?.x + 180;
    const fromY = fromNode?.position?.y + 40;
    const toX = toNode?.position?.x;
    const toY = toNode?.position?.y + 40;

    const midX = (fromX + toX) / 2;

    return (
      <svg
        key={connection?.id}
        className="absolute inset-0 pointer-events-none"
        style={{ zIndex: 1 }}
      >
        <path
          d={`M ${fromX} ${fromY} C ${midX} ${fromY}, ${midX} ${toY}, ${toX} ${toY}`}
          stroke="var(--color-primary)"
          strokeWidth="2"
          fill="none"
          className="drop-shadow-sm"
        />
        <circle
          cx={toX}
          cy={toY}
          r="4"
          fill="var(--color-primary)"
        />
      </svg>
    );
  };

  return (
    <div className="flex-1 bg-muted/30 relative overflow-hidden">
      {/* Canvas Controls */}
      <div className="absolute top-4 right-4 z-10 flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setZoom(Math.max(0.5, zoom - 0.1))}
        >
          <Icon name="ZoomOut" size={16} />
        </Button>
        <span className="text-sm text-muted-foreground px-2">
          {Math.round(zoom * 100)}%
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setZoom(Math.min(2, zoom + 0.1))}
        >
          <Icon name="ZoomIn" size={16} />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setZoom(1);
            setCanvasOffset({ x: 0, y: 0 });
          }}
        >
          <Icon name="RotateCcw" size={16} />
        </Button>
      </div>
      {/* Canvas */}
      <div
        ref={canvasRef}
        className="w-full h-full relative"
        style={{
          transform: `scale(${zoom}) translate(${canvasOffset?.x}px, ${canvasOffset?.y}px)`,
          transformOrigin: '0 0'
        }}
        onMouseMove={handleNodeDrag}
        onMouseUp={handleNodeDragEnd}
        onMouseLeave={handleNodeDragEnd}
      >
        {/* Grid Background */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(to right, var(--color-border) 1px, transparent 1px),
              linear-gradient(to bottom, var(--color-border) 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px'
          }}
        />

        {/* Connections */}
        {connections?.map(renderConnection)}

        {/* Nodes */}
        {nodes?.map(renderNode)}

        {/* Empty State */}
        {nodes?.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <Icon name="Workflow" size={48} className="text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Comece seu fluxo de trabalho
              </h3>
              <p className="text-muted-foreground mb-4">
                Arraste componentes da paleta para criar seu primeiro fluxo
              </p>
              <Button variant="outline">
                <Icon name="Plus" size={16} className="mr-2" />
                Adicionar Primeiro Nó
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkflowCanvas;