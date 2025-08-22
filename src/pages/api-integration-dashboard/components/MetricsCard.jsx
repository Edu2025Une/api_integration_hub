import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';

const MetricsCard = ({ title, value, unit, icon, trend, trendValue, color = 'primary' }) => {
  const [animatedValue, setAnimatedValue] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      const increment = value / 20;
      let current = 0;
      const animation = setInterval(() => {
        current += increment;
        if (current >= value) {
          setAnimatedValue(value);
          clearInterval(animation);
        } else {
          setAnimatedValue(Math.floor(current));
        }
      }, 50);
    }, 300);

    return () => clearTimeout(timer);
  }, [value]);

  const getColorClasses = () => {
    switch (color) {
      case 'success':
        return 'text-success bg-success/10';
      case 'warning':
        return 'text-warning bg-warning/10';
      case 'error':
        return 'text-error bg-error/10';
      default:
        return 'text-primary bg-primary/10';
    }
  };

  const getTrendColor = () => {
    if (trend === 'up') return 'text-success';
    if (trend === 'down') return 'text-error';
    return 'text-muted-foreground';
  };

  const getTrendIcon = () => {
    if (trend === 'up') return 'TrendingUp';
    if (trend === 'down') return 'TrendingDown';
    return 'Minus';
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getColorClasses()}`}>
          {isLoading ? (
            <Icon name="Loader2" size={24} className="animate-spin" />
          ) : (
            <Icon name={icon} size={24} />
          )}
        </div>
        <div className={`flex items-center space-x-1 text-sm ${getTrendColor()}`}>
          <Icon name={getTrendIcon()} size={16} />
          <span className="font-medium">{trendValue}</span>
        </div>
      </div>
      <div className="space-y-1">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        <div className="flex items-baseline space-x-1">
          <span className="text-2xl font-bold text-foreground font-mono">
            {isLoading ? '---' : animatedValue?.toLocaleString('pt-BR')}
          </span>
          {unit && (
            <span className="text-sm text-muted-foreground">{unit}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default MetricsCard;