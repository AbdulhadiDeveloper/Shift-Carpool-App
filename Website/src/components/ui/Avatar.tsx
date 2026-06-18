interface AvatarProps {
  name: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export default function Avatar({ name, className = '', size = 'md' }: AvatarProps) {
  const getInitials = (n: string) => {
    return n
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const sizeClasses = {
    sm: 'w-6 h-6 text-[10px]',
    md: 'w-10 h-10 text-body-sm',
    lg: 'w-12 h-12 text-title-md',
    xl: 'w-32 h-32 text-display',
  };

  return (
    <div
      className={`rounded-full bg-surface-variant border border-outline-variant flex items-center justify-center text-primary shrink-0 ${sizeClasses[size]} ${className}`}
    >
      <span className="font-bold">{getInitials(name)}</span>
    </div>
  );
}
