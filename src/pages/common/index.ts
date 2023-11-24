export interface IDetailnamecard {
  id: number;
  member_number: number;
  name_th: string;
  lastname_th: string;
  name_en: string;
  lastname_en: string;
  position: string;
  agency: string;
  phone_number: string;
  email: string;
  line: string;
  facebook: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  image: string;
}

export interface TPagination {
  current: number;
  pageSize: number;
}
