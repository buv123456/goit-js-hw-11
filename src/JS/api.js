import axios from 'axios';

export async function getPhoto(baseURL, searchParams) {
  const { data } = await axios.get(`${baseURL}?${searchParams}`);
  return data;
}
