import {
  BookOpen,
  Award,
  Sparkles,
  Volume2,
  GraduationCap,
  Heart,
  Users,
  Compass,
  Baby,
  UserCheck,
  ShieldCheck,
  LucideIcon,
} from 'lucide-react';

export const ICON_MAP: Record<string, LucideIcon> = {
  BookOpen,
  Award,
  Sparkles,
  Volume2,
  GraduationCap,
  Heart,
  Users,
  Compass,
  Baby,
  UserCheck,
  ShieldCheck,
};

export const AVAILABLE_ICON_NAMES = Object.keys(ICON_MAP);

export function getLucideIcon(name?: string): LucideIcon {
  if (!name) return BookOpen;
  return ICON_MAP[name] || BookOpen;
}
