import axios from "axios";

const API = process.env.REACT_APP_TRAINER_API;

export const getAllAssessments = () => axios.get(`${API}/allAsses`);

export const postAssessment = (data: any) =>
  axios.post(`${API}/postasses`, data);

export const getUserWithAssessments = (userId: number) =>
  axios.get(`${API}/fetch/${userId}`);
