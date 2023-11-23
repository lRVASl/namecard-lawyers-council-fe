import { AccessReader, Id24Role } from '../access-reader';
import { sampleGroupAccess } from '../mock-data';
import { SideMenuGroup } from '../../../screens/main/components/side-menu/SideMenu';

describe('AccessReader', () => {
  describe('getMenuSet', () => {
    it("should return organization admin menu only when token contain only 'organization-admin' role", () => {
      const { getMenuSet } = AccessReader(sampleGroupAccess);
      const actual = getMenuSet();

      expect(actual).toEqual([SideMenuGroup.OrganizationAdmin]);
    });

    it("should return SuperAdmin when token contain only 'super-admin' roles", () => {
      const { getMenuSet } = AccessReader([
        {
          ...sampleGroupAccess[0],
          roles: ['super-admin'],
        },
      ]);
      const actual = getMenuSet();

      expect(actual).toEqual([SideMenuGroup.SuperAdmin]);
    });

    it('should return both OrganizationAdmin and SuperAdmin when token contain only both roles', () => {
      const { getMenuSet } = AccessReader([
        {
          ...sampleGroupAccess[0],
          roles: [Id24Role.SuperAdmin, Id24Role.OrganizationAdmin],
        },
      ]);
      const actual = getMenuSet();

      expect(actual).toEqual([
        SideMenuGroup.OrganizationAdmin,
        SideMenuGroup.SuperAdmin,
      ]);
    });
  });
});
