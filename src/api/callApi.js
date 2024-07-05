import axios from "axios";
import {isFunction} from 'lodash';

export default async function callApi ({
  method,
  apiPath,
  actionTypes: [requestType, successType, failureType],
  variables,
  dispatch,
  getState,
  headers
}) {
  if (!isFunction(dispatch) || !isFunction(getState)) {
    throw new Error('callGraphQLApi requires dispatch and getState functions');
  }

  const baseUrlApi = 'http://localhost:5000/';
  const header = {
    "Content-Type": "application/json",
  };
  dispatch(requestType())
  return axios({
    baseURL: baseUrlApi,
    headers: headers ? {...header, ...headers} : header,
    method: method,
    url: apiPath,
    data: variables,
    params: method === 'get' ? variables : ''
  })
  .then(function (response) {
    dispatch(successType(response.data))
    return response.data;
  })
  .catch((error) => {
    let response = error.response ? error.response : error;
    dispatch(failureType(error.response));
    return response
  })
}
