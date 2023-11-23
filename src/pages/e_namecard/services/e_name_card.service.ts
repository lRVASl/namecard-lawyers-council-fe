import { AxiosInstance } from "axios";

export const NamecardService = (axiosInstance: AxiosInstance) => {
  const apiNamecardLawyers = "api/namecard-lawyers";
  return {
    namecard: async () => {
      return await axiosInstance
        .get(`http://18.139.111.131/intra/api/user.php?userId=suradachk`, {
          headers: {
            Authorization: "Bearer osdadminapisuperkey",
          },
        })
        .then((result) => result);
    },

    findAllMember: () => {
      return axiosInstance
        .get(`${apiNamecardLawyers}`)
        .then((result) => result.data)
        .catch((err) => err.data);
    },

    findMemberByID: (id: number) => {
      return axiosInstance
        .post(`${apiNamecardLawyers}/findbyid`, { id: id })
        .then((result) => result.data)
        .catch((err) => err.data);
    },
  };
};
