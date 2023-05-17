import axios from 'axios';
import { getDomain } from 'helpers/getDomain';
import { toast } from 'react-toastify';


export const api = axios.create({
  baseURL: getDomain(),
  headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
});

export const handleError = error => {
  const response = error.response;

  // catch 4xx and 5xx status codes
  if (response && !!`${response.status}`.match(/^[4|5]\d{2}$/)) {
    let info = `\n`;

    if (response.data.status) {
      info += `\n${response.data.message}`;
    } else {
      info += `\nstatus code: ${response.status}`;
      info += `\nerror message:\n${response.data}`;
    }

    console.log('The request was made and answered but was unsuccessful.', error.response);
    return info;
  } else {
    if (error.message.match(/Network Error/)) {
      toast.error('The server cannot be reached.\nDid you start it?');
    }

    console.log('Something else happened.', error);
    return error.message;
  }
};
