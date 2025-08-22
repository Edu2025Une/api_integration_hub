import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const Header = ({ onSidebarToggle, sidebarCollapsed = false }) => {
  const [quickMenuOpen, setQuickMenuOpen] = useState(false);
  const [statusIndicator, setStatusIndicator] = useState('connected'); // connected, warning, error
  const location = useLocation();

  const quickActions = [
  { label: 'Add Integration', icon: 'Plus', action: () => console.log('Add Integration') },
  { label: 'Run Test', icon: 'Play', action: () => console.log('Run Test') },
  { label: 'View Logs', icon: 'FileText', action: () => console.log('View Logs') },
  { label: 'Export Data', icon: 'Download', action: () => console.log('Export Data') }];


  const getStatusColor = () => {
    switch (statusIndicator) {
      case 'connected':return 'text-success';
      case 'warning':return 'text-warning';
      case 'error':return 'text-error';
      default:return 'text-muted-foreground';
    }
  };

  const getStatusIcon = () => {
    switch (statusIndicator) {
      case 'connected':return 'CheckCircle';
      case 'warning':return 'AlertTriangle';
      case 'error':return 'XCircle';
      default:return 'Circle';
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-card border-b border-border">
      <div className="flex items-center justify-between h-16 px-4">
        {/* Left Section - Mobile Menu Toggle */}
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={onSidebarToggle}
            className="lg:hidden">

            <Icon name="Menu" size={20} className="bg-[rgba(98,158,253,0)]" />
          </Button>
          
          {/* Desktop Sidebar Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onSidebarToggle}
            className="hidden lg:flex">

            <Icon name={sidebarCollapsed ? 'PanelLeftOpen' : 'PanelLeftClose'} size={20} />
          </Button>
        </div>

        {/* Center Section - Page Title */}
        <div className="flex-1 flex justify-center lg:justify-start lg:ml-8">
          <h1 className="text-foreground truncate text-2xl font-extrabold">
            {location?.pathname === '/api-integration-dashboard' && 'API Integration Dashboard'}
            {location?.pathname === '/api-configuration-management' && 'API Configuration'}
            {location?.pathname === '/real-time-monitoring-dashboard' && 'Real-time Monitoring'}
            {location?.pathname === '/integration-workflow-automation' && 'Workflow Automation'}
            {location?.pathname === '/login' && 'Sign In'}
            {location?.pathname === '/register' && 'Create Account'}
            {location?.pathname === '/my-ap-is-list' && 'Minhas APIs'}
            {location?.pathname === '/new-api-creation' && 'Nova API'}
          </h1>
        </div>

        {/* Right Section - Status & Actions */}
        <div className="flex items-center space-x-3">
          {/* Real-time Status Indicator */}
          <div className="hidden sm:flex items-center space-x-2 px-3 py-1.5 bg-muted rounded-md">
            <Icon
              name={getStatusIcon()}
              size={16}
              className={`${getStatusColor()} transition-colors duration-200`} />

            <span className="text-sm font-medium text-muted-foreground">
              {statusIndicator === 'connected' && 'Connected'}
              {statusIndicator === 'warning' && 'Warning'}
              {statusIndicator === 'error' && 'Error'}
            </span>
          </div>

          {/* Quick Actions Menu */}
          <div className="relative">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setQuickMenuOpen(!quickMenuOpen)}
              className="hidden md:flex">

              <Icon name="Zap" size={16} className="mr-2" />
              Quick Actions
              <Icon name="ChevronDown" size={16} className="ml-2" />
            </Button>

            {/* Mobile Quick Action Button */}
            <Button
              variant="outline"
              size="icon"
              onClick={() => setQuickMenuOpen(!quickMenuOpen)}
              className="md:hidden">

              <Icon name="Zap" size={16} />
            </Button>

            {/* Quick Actions Dropdown */}
            {quickMenuOpen &&
            <div className="absolute right-0 top-full mt-2 w-48 bg-popover border border-border rounded-md shadow-md z-50">
                <div className="py-1">
                  {quickActions?.map((action, index) =>
                <button
                  key={index}
                  onClick={() => {
                    action?.action();
                    setQuickMenuOpen(false);
                  }}
                  className="w-full flex items-center px-3 py-2 text-sm text-popover-foreground hover:bg-muted transition-colors duration-150">

                      <Icon name={action?.icon} size={16} className="mr-3" />
                      {action?.label}
                    </button>
                )}
                </div>
              </div>
            }
          </div>

          {/* User Menu */}
          <Button variant="ghost" size="icon">
            <Icon name="User" size={20} />
          </Button>
        </div>
      </div>
      {/* Click outside to close dropdown */}
      {quickMenuOpen &&
      <div
        className="fixed inset-0 z-40"
        onClick={() => setQuickMenuOpen(false)} />

      }
    </header>);

};

export default Header;