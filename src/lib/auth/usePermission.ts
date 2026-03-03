import { useAuthStore } from "./store";

export const usePermission = () => {
  const { permissions } = useAuthStore();

  const has = (permission: string): boolean => {
    return permissions.includes(permission);
  };

  const hasAny = (perms: string[]): boolean => {
    return perms.some((p) => permissions.includes(p));
  };

  const hasAll = (perms: string[]): boolean => {
    return perms.every((p) => permissions.includes(p));
  };

  return { has, hasAny, hasAll };
};