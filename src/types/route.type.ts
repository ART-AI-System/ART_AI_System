import type { Role } from './role.type';

export interface AppRoute {
  path: string;
  allowedRoles: Role[] | 'PUBLIC' | 'ALL';
  isAuthLayout?: boolean;
}
