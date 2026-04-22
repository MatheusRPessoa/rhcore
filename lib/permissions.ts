import type { UserRole } from "./types";

export const ROUTE_PERMISSIONS: Record<string, UserRole[]> = {
  "/": ["ADMIN", "MANAGER", "EMPLOYEE"],
  "/employees": ["ADMIN", "MANAGER"],
  "/departments": ["ADMIN", "MANAGER"],
  "/positions": ["ADMIN", "MANAGER", "EMPLOYEE"],
  "/vacations": ["ADMIN", "MANAGER", "EMPLOYEE"],
  "/requests": ["ADMIN", "MANAGER", "EMPLOYEE"],
  "/users": ["ADMIN"],
  "/profile": ["ADMIN", "MANAGER", "EMPLOYEE"],
};

export function hasRouteAccess(
  role: UserRole | null,
  pathname: string,
): boolean {
  if (!role) return false;
  const match = Object.keys(ROUTE_PERMISSIONS)
    .filter((route) =>
      route === "/" ? pathname === "/" : pathname.startsWith(route),
    )
    .sort((a, b) => b.length - a.length)[0];
  if (!match) return true;
  return ROUTE_PERMISSIONS[match].includes(role);
}
