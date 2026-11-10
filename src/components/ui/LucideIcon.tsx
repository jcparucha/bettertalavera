import * as LucideIcons from 'lucide-react';

interface IconProps {
  icon?: string;
}

export default function LucideIcon({ icon }: IconProps) {
  if (!icon) return;

  const Icon = LucideIcons[
    icon as keyof typeof LucideIcons
  ] as React.ComponentType<{ className: string }>;

  return Icon ? <Icon className="h-6 w-6" /> : null;
}
