import { OrganizationUserAccess } from './organization-user-access';

export type DecodedID24Claim = {
  userId: string;
  clientId: string;
  access: OrganizationUserAccess;
};
