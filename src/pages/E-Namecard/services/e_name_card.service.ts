import { AxiosInstance } from "axios";

export const NamecardService = (axiosInstance: AxiosInstance) => {
  return {
    namecard: async () => {
      return await axiosInstance
        .get(
          `http://18.139.111.131/intra/api/user.php?userId=suradachk`,
          {
            headers: {
              Authorization: "Bearer osdadminapisuperkey",
            },
          },
        )
        .then((result) => result);
    },
  };
};
