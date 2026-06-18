import { Car, Armchair, CheckCircle2, Ban } from 'lucide-react';

type StatusType = 'DRIVING' | 'RIDING' | 'COMPLETED' | 'CANCELLED';

interface StatusBadgeProps {
  status: StatusType;
  className?: string;
}

export default function StatusBadge({ status, className = '' }: StatusBadgeProps) {
  const configs = {
    DRIVING: {
      icon: <Car size={16} />,
      text: 'DRIVING',
      classes: 'text-primary border-outline-variant/30',
    },
    RIDING: {
      icon: <Armchair size={16} />,
      text: 'RIDING',
      classes: 'text-tertiary-fixed-dim border-outline-variant/30',
    },
    COMPLETED: {
      icon: <CheckCircle2 size={16} />,
      text: 'COMPLETED',
      classes: 'text-tertiary-fixed-dim border-transparent',
    },
    CANCELLED: {
      icon: <Ban size={16} />,
      text: 'CANCELLED',
      classes: 'text-outline border-transparent',
    },
  };

  const config = configs[status];

  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-px rounded-sm bg-surface-variant font-label-caps text-label-caps tracking-wider uppercase border ${config.classes} ${className}`}
    >
      {config.icon}
      <span>{config.text}</span>
    </div>
  );
}
