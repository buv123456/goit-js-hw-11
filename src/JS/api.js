import axios from 'axios';

export async function getPhoto(baseURL, searchParams) {
  const config = {
    method: 'get',
    params: searchParams,
  };
  const { data } = await axios(baseURL, config);
  return data;
}
