import { RiskLevel } from '@/lib/types';
import { Shield, AlertTriangle, XCircle, CheckCircle } from 'lucide-react';

interface AlertBadgeProps {
  riskLevel: RiskLevel;
  className?: string;
}

export function AlertBadge({ riskLevel, className = '' }: AlertBadgeProps) {
  const configs = {
    SAFE: {
      bg: 'bg-green-100',
      text: 'text-green-800',
      icon: CheckCircle,
      label: 'Safe',
    },
    WARNING: {
      bg: 'bg-yellow-100',
      text: 'text-yellow-800',
      icon: AlertTriangle,
      label: 'Warning',
    },
    CRITICAL: {
      bg: 'bg-red-100',
      text: 'text-red-800',
      icon: XCircle,
      label: 'Critical',
    },
    HALLUCINATION: {
      bg: 'bg-purple-100',
      text: 'text-purple-800',
      icon: AlertTriangle,
      label: 'Hallucination',
    },
  };

  const config = configs[riskLevel];
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${config.bg} ${config.text} ${className}`}
    >
      <Icon className="w-3 h-3" />
      {config.label}
    </span>
  );
}
