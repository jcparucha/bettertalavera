import * as LucideIcons from 'lucide-react';

interface IconProps {
  icon?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  className?: string;
}

const iconSizes = {
  sm: 'h-4 w-4',
  md: 'h-6 w-6',
  lg: 'h-8 w-8',
  xl: 'h-10 w-10',
  '2xl': 'h-12 w-12',
};

export default function LucideIcon({ icon, size, className }: IconProps) {
  if (!icon) return;

  const Icon = LucideIcons[
    icon as keyof typeof LucideIcons
  ] as React.ComponentType<{ className: string }>;

  const iconSize = size ? iconSizes[size] : iconSizes.md;

  return Icon ? <Icon className={`${iconSize} ${className}`} /> : null;
}
