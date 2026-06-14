import type { LucideIcon } from 'lucide-react';
import type { Role } from './role.type';

export interface NavItem {
  label: string;
  path: string;
  icon: LucideIcon;
  allowedRoles: Role[] | 'ALL';
  children?: Omit<NavItem, 'children'>[];
}

export interface NavGroup {
  groupLabel: string;
  items: NavItem[];
}
