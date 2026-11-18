import * as LucideIcons from 'lucide-react';

interface IconProps {
  icon?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function LucideIcon({ icon, size }: IconProps) {
  if (!icon) return;

  const Icon = LucideIcons[
    icon as keyof typeof LucideIcons
  ] as React.ComponentType<{ className: string }>;

  const iconSize =
    size && size === 'lg' ? 'h-10 w-10' : size === 'sm' ? 'h-4 w-4' : 'h-6 w-6';

  return Icon ? <Icon className={`${iconSize}`} /> : null;
}
