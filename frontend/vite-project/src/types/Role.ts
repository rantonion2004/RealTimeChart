export const Role = {
  Owner: "Owner",
  Editor: "Editor",
  Viewer: "Viewer",
} as const;

export type Role = (typeof Role)[keyof typeof Role];

export function getRoleName(role: Role | null): string {
  switch (role) {
    case Role.Owner:
      return "Dueño";
    case Role.Editor:
      return "Editor";
    case Role.Viewer:
      return "Solo lectura";
    case null:
      return "Sin rol";
  }
}