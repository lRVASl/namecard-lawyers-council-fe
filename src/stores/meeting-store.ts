import axios from "axios";
import { httpClient } from "../utils/http-client";

export const DatamanagementService = (domain?: any) => ({
  getListmeeting: async () => {
    const result = await httpClient.get(`/meeting/`);
    return result.data;
  },
  updatemeeting: async (
    idmeeting: any,
    dataAgenda: any,
    user: any,
    dataDetail: any,
    dataFood: any
  ) => {
    const result = await httpClient.put(`/meeting/`, {
      idmeeting: idmeeting,
      dataAgenda: dataAgenda,
      user: user,
      dataDetail: dataDetail,
      dataFood: dataFood,
    });
    return result.data;
  },
  createuser: async (data: any) => {
    // console.log(data);
    const result = await httpClient.post(`/userattendees/createuser`, data);
    return result.data;
  },
  saveusermeetingall: async (
    userBoard: [],
    userAttendee: [],
    idmeeting: string
  ) => {
    const newData = {
      userBoard: userBoard,
      userAttendee: userAttendee,
      idmeeting: idmeeting,
    };

    const result = await httpClient.post(`/userattendees/`, newData);
    return result.data;
  },
  saveuserattendeesByuser: async (userDetail: {
    username: string;
    phone: string;
    email: string;
    model: string;
    position: string;
    uuidprofile: string;
    idmeeting: string;
    checkin: boolean;
    foodstatus: boolean;
    type_user: string;
  }) => {
    const result = await httpClient.post(`/userattendees/byuser`, userDetail);
    return result.data;
  },
  submituserexternal: async (
    roomid: any,
    newuuid: string,
    username: string,
    phonenumber: string,
    email: string,
    model: string,
    course: any,
    position: any
  ) => {
    const result = await httpClient.post(`/userattendees/submituserexternal`, {
      roomid: roomid,
      newuuid: newuuid,
      username: username,
      phonenumber: phonenumber,
      email: email,
      model: model,
      course: course,
      position: position,
    });
    return result.data;
  },
  getProfileByid: async (roomid: any, userid: any) => {
    const result = await httpClient.get(`/userattendees/${roomid}/${userid}`);
    return result.data;
  },
  getMeetingByid: async (roomid: any) => {
    const result = await httpClient.get(`/meeting/${roomid}`);

    return result.data;
  },
  checkin: async (roomid: any, userid: any, status: boolean) => {
    const data = {
      roomid: roomid,
      userid: userid,
      status: status,
    };
    const result = await httpClient.put(`/userattendees/`, data);

    return result.data;
  },
  getuserInroom: async (roomid: any) => {
    const result = await httpClient.get(`/userattendees/${roomid}`);
    return result.data;
  },
  dowloadFileoverview: async (roomid: any, namefile: string) => {
    const data = {
      roomid: roomid,
      namefile: namefile,
    };
    const result = await httpClient.post(`/meeting/dowloadfileoverview`, data);
    return result.data;
  },

  getuserInroomAll: async () => {
    const result = await httpClient.get(`/userattendees/userinroomall`);
    // console.log(result);
    return result.data;
  },
  getFiles: async (roomid: any) => {
    const result = await httpClient.get(`/meeting/filepdf/${roomid}`);
    return result.data;
  },
  upLoadfilecsv: async (data: any) => {
    const result = await httpClient.post(`/userattendees/uploaduser`, {
      data: data,
    });
    return result.data;
  },
  upLoadfilecsvparty: async (data: any) => {
    const result = await httpClient.post(`/userparty`, {
      data: data,
    });
    return result.data;
  },
  saveagenda: async (data: any, id: string, step: string) => {
    const newData = {
      agendas: data,
      id: id,
      step: step,
    };
    const result = await httpClient.post(`/meeting/agenda`, newData);
    return result.data;
  },

  deletefileagendas: async (
    idmeeting: string,
    step: string,
    namefile: string
  ) => {
    const result = await httpClient.delete(
      `/meeting/agendafile/${idmeeting}/${step}/${namefile}`
    );
    return result;
  },
  getagendaByid: async (idroom: any) => {
    const result = await httpClient.get(`meeting/agenda/${idroom}`);
    return result.data;
  },
  updateStatusUser: async (idroom: any, userId: any) => {
    const result = await httpClient.put(
      `userattendees/updatestatususer/${idroom}/${userId}`
    );
    return result?.data;
  },
  updateByid: async (uuid: any, data: any) => {
    const result = await httpClient.put(
      `userattendees/updateUser/${uuid}`,
      data
    );
    return result.data;
  },
  importPosition: async (data: any, type: any) => {
    const newData = {
      data: data,
    };
    const result = await httpClient.post(
      `userattendees/import/position/${type}`,
      newData
    );
    return result.data;
  },
  // getPositionall: async () => {
  //   const result = await httpClient.get(`userattendees/positionall`);
  //   return result.data;
  // },
  getCourseall: async () => {
    const result = await httpClient.get(`userattendees/courseall`);
    return result.data;
  },
  deletePosition: async (data: any) => {
    const newData = {
      data: data,
    };
    const result = await httpClient.delete(
      `userattendees/delete/position/${data.uuid}`,
      newData
    );
    return result?.data;
  },
  updateUser: async (uuid: any, data: any) => {
    // console.log(uuid);
    const newData = {
      data: data,
    };

    const result = await httpClient.put(`user/updateuser/${uuid}`, newData);
    return result?.data;
  },
  getPathFilePdf: async (roomid: any) => {
    const result = await httpClient.get(`/meeting/getPathFilePdf/${roomid}`);
    return result.data;
  },

  findUser: async (userid: any) => {
    const result = await httpClient.get(`findbyid/:userid${userid}`);
    return result.data;
  },
  findAll: async () => {
    const result = await httpClient.get(`userattendees`);
    return result.data;
  },

  // findbyidcontract: async (userid: any) => {
  //   const result = await httpClient.get(`/user/findbyids/${userid}`);
  //   console.log(result);

  //   return result.data;
  // },

  dowloadPathFileStep: async (
    idfile: string,
    roomid: any,
    step: any,
    namefile: string
  ) => {
    const result = await httpClient.post(`/meeting/getfilestep`, {
      idfile: idfile,
      roomid: roomid,
      step: step,
      namefile: namefile,
    });
    return result.data;
  },
  getDetailfood: async (roomid: any) => {
    const result = await httpClient.get(`/meeting/detailfood/${roomid}`);
    return result.data;
  },
  updateStatusFood: async (
    roomid: any,
    userid: any,
    statusfood: boolean,
    statusgift: boolean
  ) => {
    const result = await httpClient.post(`/userattendees/foodupdate`, {
      roomid: roomid,
      userid: userid,
      statusfood: statusfood,
      statusgift: statusgift,
    });
    return result.data;
  },
  updateUserDetail: async (roomid: any, userid: any, data: any) => {
    const result = await httpClient.put(
      `/userattendees/updateUserDetail/${roomid}/${userid}`,
      data
    );
    return result?.data;
  },
  updateUserNoomeet: async (roomid: any, userid: any, data: any) => {
    const result = await httpClient.put(
      `/userattendees/updateUserNoomeet/${roomid}/${userid}`,
      data
    );
    return result?.data;
  },

  // updateUserNoomeet
  findAagendesdetailbyid: async (roomid: any, step: any) => {
    const result = await httpClient.get(
      `/meeting/findagendesdetailbyid/${roomid}/${step}`
    );
    return result.data;
  },
  saveSummaryMeeting: async (roomid: any, detail: string) => {
    const newData = {
      data: detail,
    };

    const result = await httpClient.post(
      `/meeting/savesummarymeeting/${roomid}`,
      newData
    );
    return result.data;
  },
  getPathFileSummary: async (roomid: any, namefile: string) => {
    const result = await httpClient.get(
      `/meeting/getfilesummary/${roomid}/${namefile}`,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        responseType: "arraybuffer",
      }
    );
    return result.data;
  },
  getnamefileSummary: async (roomid: any) => {
    const result = await httpClient.get(
      `/meeting/getfilenamesummary/${roomid}/`
    );
    return result.data;
  },

  updatecheckinparty: async (userid: string) => {
    const result = await httpClient.put(`/userparty/userin/${userid}`);
    return result.data;
  },
  getUserInparty: async (userid: any) => {
    const result = await httpClient.get(`/userparty/${userid}`);
    return result.data;
  },
  updaterecivegift: async (userid: string) => {
    const result = await httpClient.put(`/userparty/recivegif/${userid}`);
    return result.data;
  },
  // updateroom: async (
  //   data: IDataroom,
  //   userAttendee: IUsers,
  //   userBoard: IUsers
  // ) => {
  //   const result = await httpClient.put(`/meeting`, {
  //     data: data,
  //     usersatd: userAttendee,
  //     userboard: userBoard,
  //   });
  //   return result.data;
  // },
  updateFileoverview: async (
    file: any,
    idmeeting: any,
    namefile: string,
    idfile: number
  ) => {
    const result = await httpClient.put(
      `/meeting/import/${idmeeting}/${namefile}/${idfile}`,
      file,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return result.data;
  },
  updateFileagendas: async (
    file: any,
    idmeeting: any,
    namefile: string,
    filenumber: number,
    numberstep: number
  ) => {
    const result = await httpClient.put(
      `/meeting/updatefileagendas/${idmeeting}/${namefile}/${filenumber}/${numberstep}`,
      file,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return result;
  },
  getGroup: async () => {
    const result = await httpClient.get(`user/groupall`);
    return result.data;
  },
  CourseAlls: async () => {
    const result = await httpClient.get(`userattendees/courseall`);
    return result?.data;
  },

  // finduserbyid/:userid
  FindUserByID: async (userid: any) => {
    const result = await httpClient.get(`user/finduserbyid/${userid}`);
    return result?.data;
  },

  CreateGroup: async (data: any) => {
    const result = await httpClient.post(`userattendees/create/group`, data);
    return result?.data;
  },
  // delete/group/:uuid
  DeleteGroup: async (data: any) => {
    const newData = {
      data: data,
    };

    const result = await httpClient.delete(
      `userattendees/delete/group/${data.uuidgroup}`,
      newData
    );
    return result?.data;
  },

  updateGroup: async (uuid: any, data: any) => {
    const newData = {
      data: data,
    };
    const result = await httpClient.put(
      `/userattendees/updateGroup/${uuid}`,
      newData
    );
    return result?.data;
  },
  /////////////////////// update
  getFileoverview: async (idroom: any) => {
    const result = await httpClient.get(`/meeting/getFileoverview/${idroom}`);
    return result?.data;
  },
  getFileagenda: async (idroom: any) => {
    const result = await httpClient.get(`/meeting/getFileagenda/${idroom}`);
    return result?.data;
  },
  updateoldFileoverview: async (data: any) => {
    const result = await httpClient.post(`meeting/updateoldFileoverview`, data);
    return result?.data;
  },
  updateoldFileagenda: async (data: any) => {
    const result = await httpClient.post(`meeting/updateoldFileagenda`, data);
    return result?.data;
  },
  removeFileoverviewAll: async (idroom: any) => {
    const result = await httpClient.delete(
      `meeting/deletefileoverviewAll/${idroom}`
    );
    return result?.data;
  },
  removeFileagendesAll: async (idroom: any, number: number) => {
    const result = await httpClient.delete(
      `meeting/deletefileagendesAll/${idroom}/${number}`
    );
    return result?.data;
  },
  getStatusProfile: async (roomid: any, userid: any) => {
    const result = await httpClient.post(`userattendees/getstatusprofile`, {
      roomid: roomid,
      userid: userid,
    });
    return result?.data;
  },
  updateStatuscheckin: async (
    roomid: any,
    userid: any,
    statuschckin: boolean
  ) => {
    const result = await httpClient.post(`userattendees/updatestatuscheckin`, {
      roomid: roomid,
      userid: userid,
      statuschckin: statuschckin,
    });
    return result?.data;
  },
  loginbyphonenumber: async (idroom: any, phonenumber: string) => {
    const result = await httpClient.post(`userattendees/loginbyphonenumber`, {
      idroom: idroom,
      phonenumber: phonenumber,
    });
    return result?.data;
  },
  vote: async (roomid: any, type: any, userid: any, step: any) => {
    const result = await httpClient.post(`meeting/vote`, {
      roomid: roomid,
      type: type,
      userid: userid,
      step: step,
    });
    return result?.data;
  },
  submitsummarypage: async (roomid: any, detailsummary: string) => {
    const result = await httpClient.post(`meeting/submitsummarypage`, {
      roomid: roomid,
      detailsummary: detailsummary,
    });
    return result?.data;
  },
  submitfilesummarypage: async (
    roomid: any,
    files: any,
    numberfile: number,
    namefile: string
  ) => {
    const result = await httpClient.post(
      `/meeting/submitfilesummarypage/${roomid}/${numberfile}/${namefile}`,
      files,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return result.data;
  },
  updateprofile: async (name: string, email: string) => {
    const result = await domain.post(`user/updateprofile`, {
      name: name,
      email: email,
    });
    return result?.data;
  },
  createcourse: async (data: any) => {
    const result = await httpClient.post(`userattendees/createcourse`, data);
    return result?.data;
  },
  updatecourse: async (data: any) => {
    const result = await httpClient.post(`userattendees/updatecourse`, data);
    return result?.data;
  },
  deletecourse: async (uuid: string) => {
    const result = await httpClient.delete(
      `userattendees/deletecourse/${uuid}`
    );
    return result?.data;
  },
  getactivitybyid: async (idactivity: any, applicationnumber: any) => {
    const result = await httpClient.get(``);
    return result?.data;
  },
  activitycheckin: async (idactivity: any, applicationnumber: any) => {
    const result = await httpClient.post(`meeting/activity/activitycheckin`, {
      idactivity: idactivity,
      applicationnumber: applicationnumber,
    });
    return result?.data;
  },
  getcheckinmeactivity: async (idactivity: any) => {
    const result = await httpClient.get(
      `meeting/activity/getcheckinmeactivity/${idactivity}`
    );
    return result?.data;
  },

  getactivitybyphone: async (phonenumber: any) => {
    const result = await httpClient.get(
      `meeting/activity/getactivitybyphone/${phonenumber}`
    );
    return result?.data;
  },
});
