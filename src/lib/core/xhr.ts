// https://blog.csdn.net/hahahhahahahha123456/article/details/80608568
import {
  AjaxOptionsProps,
} from '@/index.d';

import { extend } from '@/lib/_';
import formatOptions from '@/lib/core/format-options';
import {
  updatePercentage,
} from '@/lib/core/progress';

function transformResponseData(xhr) {
  let data = xhr.response || xhr.responseText;
  if (typeof data === 'string') {
    try {
      data = JSON.parse(data);
    } catch (e) {/*eslint-disable-line*/ }
  }
  return data;
}


function createError(option) {
  const error = new Error(option.msg);
  return extend(error, option);
}

export default function XHR_CORE(url: string, options: AjaxOptionsProps): Promise<any> {
  const {
    method,
    timeout,
    headers,
    data,
    onProgress,
  } = formatOptions(url, options);
  return new Promise(
    (
      resolve: (data: any) => void,
      reject: (err: any) => void
    ) => {
    const xhr = new XMLHttpRequest();

    xhr.open(method, url);
    xhr.withCredentials = true;

    for (let key in headers) {
      xhr.setRequestHeader(key, headers[key]);
    }

    xhr.timeout = timeout;
    xhr.ontimeout = () => {
      reject(createError({
        msg: `request error: Time out!, request url: ${url}`,
        timeout: true,
      }));
    };

    xhr.upload.onprogress  = xhr.onprogress = (evt) => {
      updatePercentage(evt);
      onProgress && onProgress(evt);
    };

    xhr.onreadystatechange = () => {
      if (!xhr || xhr.readyState !== 4) {
        return;
      }

      const status = xhr.status;
      // credit: Axios
      // The request errored out and we didn't get a response, this will be
      // handled by onerror instead
      // With one exception: request that using file: protocol, most browsers
      // will return status as 0 even though it's a successful request
      if (status === 0) {
        return;
      }
      const responseData = transformResponseData(xhr);
      if (status === 200) {
        resolve(responseData);
      } else {
        reject(createError({
          msg: `response error with status code ${status}`,
          status,
          response: responseData
        }));
      }
    };

    xhr.onerror = (e) => {
      reject(createError({
        msg: `request error: ${e}, request url: ${url}`,
        status: 0
      }));
    };

    xhr.send(data);
  });
}
