import { icons, type IconName } from '../../lib/iconRegistry';

interface IconProps {
  icon?: IconName;
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

  const Icon = icons[icon];

  const iconSize = size ? iconSizes[size] : iconSizes.md;

  return Icon ? <Icon className={`${iconSize} ${className}`} /> : null;
}
