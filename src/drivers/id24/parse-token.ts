import { decodeToken } from 'react-jwt';
import { OrganizationUserAccess } from './models/organization-user-access';

export const parseToken = (token: string): OrganizationUserAccess => {
  const {
    access: { userAccess, organizationId },
  } = decodeToken(token) as any;
  return { userAccess, organizationId };
};
