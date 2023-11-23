import { httpClient } from '../utils/http-client';

export type AccountStatus = {
  id: string;
  name: string;
};

export type LoanType = {
  id: string;
  name: string;
};

export type Oa = {
  oaCode: string;
  oaName: string;
  address: string;
  email: string;
  contactName: string;
  contactPhone: string;
  adminUserId: string;
  userBank: string;
  oaOrganize: string;
  oaId: string;
  createDate: string;
  type: string;
};

export type ProductType = {
  id: string;
  dateTime: Date;
  loanType: string;
  productCode: string;
  productDesc: string;
  createDate: Date;
};

export type UserBank = {
  userId: string;
  userName: string;
  sub: string;
  parentNode: string;
};

type MasterDataMapper = {
  'account-statuses': AccountStatus;
  'loan-types': LoanType;
  'product-types': ProductType;
  supervisors: UserBank;
  'user-banks': UserBank;
  oas: Oa;
};

const createGetMasterData =
  <T extends keyof MasterDataMapper>(path: T) =>
  () =>
    httpClient.get<MasterDataMapper[T][]>(`/master-data/${path}`);

export const getAccountStatuses = createGetMasterData('account-statuses');
export const getProductTypes = createGetMasterData('product-types');
export const getSupervisors = createGetMasterData('supervisors');
export const getUserBanks = createGetMasterData('user-banks');
export const getOas = createGetMasterData('oas');
export const getLoanTypes = createGetMasterData('loan-types');
