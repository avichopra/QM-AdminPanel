import axios from 'axios';
import config from './config';
import { isEmpty } from 'lodash';

const callWebService = options => {
  const axiosInstance = axios.create({
    baseURL: config.SERVER_URL
  });
  return axiosInstance(options);
};

const callApi = (
  method = 'post',
  url,
  data = {},
  headers = {
    'content-type': 'application/json',
    Accept: 'application/json'
  }
) => {
  // console.log("in the call api function", data, method, url, headers);
  return new Promise(function(resolve, reject) {
    if (method === 'get') {
      // let queryParams = encodeURI(JSON.stringify(data));
      // url = `${config.SERVER_URL}/${url}?params=${queryParams}`;
    } else {
      url = `${config.SERVER_URL}/${url}`;
    }

    let options = {
      method,
      url,
      data,
      headers,
      timeout: 1000 * 10
    };
    if (method === 'get') {
      delete options['data'];
    }
    axios({
      ...options
    })
      .then(response => {
        console.log('response');
        return resolve(response);
      })
      .catch(err => {
        return reject(err);
      });
  });
};

export { callWebService, callApi };
