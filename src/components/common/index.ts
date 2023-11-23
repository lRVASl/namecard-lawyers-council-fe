export interface IProfile {
  id: number;
  id_card_number: string;
  personal_information_id: string;
  prefix: string;
  name: string;
  surname: string;
  sex: string;
  birthday: string;
  address_status: true;
  createdAt: string;
  updatedAt: string;
  address_information: [
    {
      id: number;
      housenumber: string;
      house_registration: string;
      createdAt: string;
      updatedAt: string;
      p_information_id: string;
    }
  ];
  other_information: [
    {
      id: number;
      education_level: string;
      occupation: string;
      club?: string;
      religion: string;
      marital_status: string;
      father?: string;
      mother?: string;
      married_couple: string;
      createdAt: string;
      updatedAt: string;
      p_information_id: string;
    }
  ];
  medical_information: [
    {
      id: number;
      code_rights: string;
      treatment_rights: string;
      congenital_disease: string;
      createdAt: string;
      updatedAt: string;
      p_information_id: string;
    }
  ];
  users: [
    {
      user_id: string;
      token: string;
      active: boolean;
      email: string;
      phonenumber: string;
      type_user: string;
      personal_information_id: string;
      createdAt: string;
      updatedAt: string;
      deletedAt?: string;
    }
  ];
}
