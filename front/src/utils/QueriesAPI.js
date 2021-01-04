import axios from "axios";

const baseURL = process.env.REACT_APP_DOMAIN;

const headers = {
  'Content-Type': 'application/json'
};

export const runRU1Query = async () => {
  return axios({
    method: 'post',
    url: `${baseURL}/RU1`,
    headers
  });
} 

// export const runRU2Query = async (username, password) => {
//   return axios({
//     method: 'post',
//     url: `${baseURL}/api/auth/login`,
//     headers: headers,
//     data: {
//       username,
//       password
//     }
//   });
// } 