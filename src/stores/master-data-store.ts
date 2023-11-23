import { AxiosResponse } from 'axios';
import { makeAutoObservable } from 'mobx';
import {
  AccountStatus,
  getAccountStatuses,
  getLoanTypes,
  getOas,
  getProductTypes,
  getSupervisors,
  getUserBanks,
  LoanType,
  Oa,
  ProductType,
  UserBank,
} from './master-data.service';

class MasterDataStore {
  constructor() {
    makeAutoObservable(this);
    this.setAccountStatuses();
    this.setProductTypes();
    this.setSupervisors();
    this.setUserBanks();
    this.setOas();
    this.setLoanTypes();
  }

  accountStatuses: AccountStatus[] = [];
  loanTypes: LoanType[] = [];
  productTypes: ProductType[] = [];
  supervisors: UserBank[] = [];
  userBanks: UserBank[] = [];
  oas: Oa[] = [];

  *setAccountStatuses() {
    const { data }: AxiosResponse<AccountStatus[]> = yield getAccountStatuses();
    this.accountStatuses = data;
  }

  *setLoanTypes() {
    const { data }: AxiosResponse<LoanType[]> = yield getLoanTypes();
    this.loanTypes = data;
  }

  *setProductTypes() {
    const { data }: AxiosResponse<ProductType[]> = yield getProductTypes();
    this.productTypes = data;
  }

  *setSupervisors() {
    const { data }: AxiosResponse<UserBank[]> = yield getSupervisors();
    this.supervisors = data;
  }

  *setUserBanks() {
    const { data }: AxiosResponse<UserBank[]> = yield getUserBanks();
    this.userBanks = data;
  }

  *setOas() {
    const { data }: AxiosResponse<Oa[]> = yield getOas();
    this.oas = data;
  }
}

export const masterDataStore = new MasterDataStore();
