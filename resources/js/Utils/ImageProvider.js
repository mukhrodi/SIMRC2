import { BASE_URL } from './Constants';

export default function getImage(path) {
  return (`${BASE_URL}/storage${path}`);
}