import React from 'react';
import {
  BookOpen,
  Award,
  Sparkles,
  Volume2,
  Baby,
  UserCheck,
  GraduationCap,
  Users,
  Heart,
  Compass,
  Star,
  ShieldCheck,
} from 'lucide-react';
import type { IconNameType } from '../types/cms';

export const ICON_OPTIONS: IconNameType[] = [
  'BookOpen',
  'Award',
  'Sparkles',
  'Volume2',
  'Baby',
  'UserCheck',
  'GraduationCap',
  'Users',
  'Heart',
  'Compass',
  'Star',
  'ShieldCheck',
];

const ICON_COMPONENTS: Record<IconNameType, React.ComponentType<{ className?: string }>> = {
  BookOpen,
  Award,
  Sparkles,
  Volume2,
  Baby,
  UserCheck,
  GraduationCap,
  Users,
  Heart,
  Compass,
  Star,
  ShieldCheck,
};

export function getLucideIcon(name?: string): React.ComponentType<{ className?: string }> {
  if (name && name in ICON_COMPONENTS) {
    return ICON_COMPONENTS[name as IconNameType];
  }
  return BookOpen;
}
