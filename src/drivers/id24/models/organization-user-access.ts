import { UserAccess } from './user-access';

export type OrganizationUserAccess = {
  organizationId: string;
  userAccess: UserAccess[];
};
