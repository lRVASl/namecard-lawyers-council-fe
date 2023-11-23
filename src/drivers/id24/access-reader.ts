import { UserAccess } from './models/user-access';

export enum SideMenuGroup {
  OrganizationAdmin = 'organizationAdmin',
  SuperAdmin = 'superAdmin',
}

export enum Id24Role {
  OrganizationAdmin = 'organization-admin',
  SuperAdmin = 'super-admin',
}

export const AccessReader = (userAccess: UserAccess[]) => ({
  getMenuSet: (): SideMenuGroup[] => {
    const roles: string[] = userAccess.reduce<string[]>(
      (allRoles, currentGroup) => [...allRoles, ...currentGroup.roles],
      [],
    );
    return [
      ...(roles.includes(Id24Role.OrganizationAdmin)
        ? [SideMenuGroup.OrganizationAdmin]
        : []),
      ...(roles.includes(Id24Role.SuperAdmin)
        ? [SideMenuGroup.SuperAdmin]
        : []),
    ];
  },
});
