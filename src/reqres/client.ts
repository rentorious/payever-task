import axios, { AxiosResponse } from 'axios';
import { ReqResUser } from './types';

export const client = axios.create({ baseURL: 'https://reqres.in/api/' });

export const fetchUser = (id: number): Promise<ReqResUser> =>
  client
    .get<never, AxiosResponse<{ data: ReqResUser }>>(`users/${id}`)
    .then((res) => res.data.data);
