import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';

const Sidebar = ({ isCollapsed = false, isOpen = false, onClose }) => {
  const location = useLocation();
  const [connectionStatus, setConnectionStatus] = useState('connected');

  const navigationItems = [
    {
      label: 'Dashboard',
      icon: 'LayoutDashboard',
      path: '/api-integration-dashboard',
      description: 'System overview and health metrics'
    },
    {
      label: 'Integrations',
      icon: 'Workflow',
      children: [
        {
          label: 'Configuration',
          icon: 'Settings',
          path: '/api-configuration-management',
          description: 'API configuration management'
        },
        {
          label: 'Automation',
          icon: 'Zap',
          path: '/integration-workflow-automation',
          description: 'Workflow automation tools'
        }
      ]
    }
  ];

  const isActiveRoute = (path) => {
    return location?.pathname === path;
  };

  const hasActiveChild = (children) => {
    return children?.some(child => isActiveRoute(child?.path));
  };

  const getStatusColor = () => {
    switch (connectionStatus) {
      case 'connected': return 'text-success';
      case 'warning': return 'text-warning';
      case 'error': return 'text-error';
      default: return 'text-muted-foreground';
    }
  };

  const sidebarClasses = `
    fixed top-0 left-0 h-full bg-card border-r border-border z-40 transition-all duration-200 ease-out
    ${isCollapsed ? 'w-16' : 'w-60'}
    ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
  `;

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={onClose}
        />
      )}
      {/* Sidebar */}
      <aside className={sidebarClasses}>
        <div className="flex flex-col h-full">
          {/* Logo Section */}
          <div className="flex items-center h-16 px-4 border-b border-border">
            {!isCollapsed ? (
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Icon name="Workflow" size={20} className="text-primary-foreground" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-foreground">API Hub</span>
                  <span className="text-xs text-muted-foreground">Integration Platform</span>
                </div>
              </div>
            ) : (
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center mx-auto">
                <Icon name="Workflow" size={20} className="text-primary-foreground" />
              </div>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {navigationItems?.map((item, index) => (
              <div key={index}>
                {item?.children ? (
                  // Parent with children
                  (<div className="space-y-1">
                    <div className={`
                      flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-150
                      ${hasActiveChild(item?.children) 
                        ? 'bg-primary/10 text-primary' :'text-muted-foreground hover:bg-muted hover:text-foreground'
                      }
                    `}>
                      <Icon name={item?.icon} size={20} className="flex-shrink-0" />
                      {!isCollapsed && (
                        <span className="ml-3 truncate">{item?.label}</span>
                      )}
                    </div>
                    {!isCollapsed && (
                      <div className="ml-6 space-y-1">
                        {item?.children?.map((child, childIndex) => (
                          <Link
                            key={childIndex}
                            to={child?.path}
                            onClick={onClose}
                            className={`
                              flex items-center px-3 py-2 text-sm rounded-md transition-colors duration-150 group
                              ${isActiveRoute(child?.path)
                                ? 'bg-primary text-primary-foreground'
                                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                              }
                            `}
                          >
                            <Icon name={child?.icon} size={16} className="flex-shrink-0" />
                            <span className="ml-3 truncate">{child?.label}</span>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>)
                ) : (
                  // Direct navigation item
                  (<Link
                    to={item?.path}
                    onClick={onClose}
                    className={`
                      flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-150 group relative
                      ${isActiveRoute(item?.path)
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                      }
                    `}
                  >
                    <Icon name={item?.icon} size={20} className="flex-shrink-0" />
                    {!isCollapsed && (
                      <>
                        <span className="ml-3 truncate">{item?.label}</span>
                        {item?.badge && (
                          <span className="ml-auto bg-error text-error-foreground text-xs px-1.5 py-0.5 rounded-full">
                            {item?.badge}
                          </span>
                        )}
                      </>
                    )}
                    {/* Tooltip for collapsed state */}
                    {isCollapsed && (
                      <div className="absolute left-full ml-2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded-md shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none whitespace-nowrap z-50">
                        {item?.label}
                        {item?.badge && (
                          <span className="ml-2 bg-error text-error-foreground px-1.5 py-0.5 rounded-full">
                            {item?.badge}
                          </span>
                        )}
                      </div>
                    )}
                  </Link>)
                )}
              </div>
            ))}
          </nav>

          {/* Connection Status */}
          <div className="p-3 border-t border-border">
            <div className={`
              flex items-center px-3 py-2 rounded-md bg-muted/50
              ${isCollapsed ? 'justify-center' : 'justify-between'}
            `}>
              <div className="flex items-center">
                <Icon 
                  name="Wifi" 
                  size={16} 
                  className={`${getStatusColor()} transition-colors duration-200`}
                />
                {!isCollapsed && (
                  <span className="ml-2 text-xs font-medium text-muted-foreground">
                    System Status
                  </span>
                )}
              </div>
              {!isCollapsed && (
                <div className={`w-2 h-2 rounded-full ${
                  connectionStatus === 'connected' ? 'bg-success' :
                  connectionStatus === 'warning' ? 'bg-warning' : 'bg-error'
                }`} />
              )}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;