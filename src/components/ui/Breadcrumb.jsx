import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';

const Breadcrumb = () => {
  const location = useLocation();
  
  const routeMap = {
    '/api-integration-dashboard': [
      { label: 'Dashboard', path: '/api-integration-dashboard' }
    ],
    '/api-configuration-management': [
      { label: 'Integrations', path: null },
      { label: 'Configuration', path: '/api-configuration-management' }
    ],
    '/real-time-monitoring-dashboard': [
      { label: 'Monitoring', path: '/real-time-monitoring-dashboard' }
    ],
    '/integration-workflow-automation': [
      { label: 'Integrations', path: null },
      { label: 'Automation', path: '/integration-workflow-automation' }
    ],
    '/my-ap-is-list': [
      { label: 'Minhas APIs', path: null },
      { label: 'Lista', path: '/my-ap-is-list' }
    ],
    '/new-api-creation': [
      { label: 'Minhas APIs', path: '/my-ap-is-list' },
      { label: 'Nova API', path: '/new-api-creation' }
    ]
  };

  const breadcrumbs = routeMap?.[location?.pathname] || [];

  if (breadcrumbs?.length === 0) {
    return null;
  }

  return (
    <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-6">
      <Link 
        to="/api-integration-dashboard" 
        className="flex items-center hover:text-foreground transition-colors duration-150"
      >
        <Icon name="Home" size={16} className="mr-1" />
        Home
      </Link>
      {breadcrumbs?.map((crumb, index) => (
        <React.Fragment key={index}>
          <Icon name="ChevronRight" size={14} className="text-border" />
          {crumb?.path && index < breadcrumbs?.length - 1 ? (
            <Link 
              to={crumb?.path}
              className="hover:text-foreground transition-colors duration-150"
            >
              {crumb?.label}
            </Link>
          ) : (
            <span className={index === breadcrumbs?.length - 1 ? 'text-foreground font-medium' : ''}>
              {crumb?.label}
            </span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumb;