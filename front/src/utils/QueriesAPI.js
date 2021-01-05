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

export const runRU2Query = async (championName, role) => {
  return axios({
    method: 'post',
    url: `${baseURL}/RU2`,
    headers,
    data: {
      championName,
      role
    }
  });
} 

export const runRU4Query = async () => {
  return axios({
    method: 'post',
    url: `${baseURL}/RU4`,
    headers
  });
} 


export const runRD1Query = async () => {
  return axios({
    method: 'post',
    url: `${baseURL}/RD1`,
    headers
  });
} 
export const runRD2Query = async (championName, answerType) => {
  return axios({
    method: 'post',
    url: `${baseURL}/RD2`,
    headers,
    data: {
      championName,
      answerType
    }
  });
} 
export const runRD3Query = async () => {
  return axios({
    method: 'post',
    url: `${baseURL}/RD3`,
    headers
  });
} 
export const runRD4Query = async () => {
  return axios({
    method: 'post',
    url: `${baseURL}/RD4`,
    headers
  });
} 
