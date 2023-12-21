import { AxiosInstance } from "axios";
import { IDetailnamecard } from "../common";

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

    getImages: async (condition: any) => {
      return await axiosInstance
        .get(`${apiNamecardLawyers}/get_image/namecard?image=${condition}`, { responseType: "blob" })
        .then((result) => result.data)
        .catch((err) => console.log(err.data));
    },

    findMemberByID: (id: number) => {
      return axiosInstance
        .post(`${apiNamecardLawyers}/findbyid`, { id: id })
        .then((result) => result.data)
        .catch((err) => err.data);
    },

    createUser: (data: IDetailnamecard) => {
      return axiosInstance
        .post(`${apiNamecardLawyers}/create`, data)
        .then((result) => result.data)
        .catch((err) => err.data);
    },

    updateuser: (data: IDetailnamecard) => {
      return axiosInstance
        .patch(`${apiNamecardLawyers}/updateuser`, data)
        .then((result) => result.data)
        .catch((err) => err.data);
    },

    uploadNewImages: (id: string, dataUpload: any) => {
      return axiosInstance
        .post(`${apiNamecardLawyers}/images/${id}`, dataUpload)
        .then((result) => result.data)
        .catch((err) => err.data);
    },

    deleteUser: (id: number, member_number: string) => {
      const dataResult = {
        id: id,
        member_number: member_number,
      };
      return axiosInstance
        .delete(`${apiNamecardLawyers}`, { data: dataResult })
        .then((result) => result.data)
        .catch((err) => err.data);
    },

    deleteImageGhs: async (res: string) => {
      const dataResult = {
        image: res,
      };
      return await axiosInstance
        .delete(`${apiNamecardLawyers}/delete-image`, { data: dataResult })
        .then((result) => result.data)
        .catch((err) => err.data);
    },
  };
};
