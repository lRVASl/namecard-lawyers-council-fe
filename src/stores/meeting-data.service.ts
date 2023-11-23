import { httpClient } from '../utils/http-client';

export type MeetingList = {
  id: string;
  name: string;
};
const createGetListmeeting =
  <T extends keyof MeetingList>(path: T) =>
  () =>
    httpClient.get<MeetingList[]>(`/meeting/`);

export const getListmeeting = createGetListmeeting('name');
