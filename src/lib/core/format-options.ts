import {
  AjaxOptionsProps,
} from '@/index.d';
import {
  deepTrim,
  extend,
  queryString,
} from '@/lib/_';

const CONTENT = {
  FORM: 'application/x-www-form-urlencoded',
  JSON: 'application/json;charset=UTF-8',
  FORM_DATA: 'multipart/form-data',
};

const METHOD = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  OPTION: 'OPTION',
  PATCH: 'PATCH',
};

const defaultHeaders = {
  'X-Requested-With': 'XMLHttpRequest',
};

const transformUrl = (url, data) => {
  let urlParts = url.split('?');
  let queryObj = queryString.parse(urlParts[1]);
  queryObj = extend(queryObj, data);
  urlParts[1] = queryString.stringify(queryObj);
  return urlParts.filter(item => !!item).join('?');
};

const resolveUrl = (url) => {
  return url;
};

export default (option: AjaxOptionsProps): AjaxOptionsProps => {
  const {
    url = '',
    method = 'GET',
    norest = false,
    timeout = 3000,
    headers = {},
    data = {},
    trim = true,
    progress = true,
    onProgress,
  } = option || {};

  let _url = resolveUrl(url);
  let _method = (method || METHOD.GET).toUpperCase();
  let _data = trim ? deepTrim(data) : data;
  const _headers = Object.assign({}, defaultHeaders, headers, {
    'Content-Type': norest ? CONTENT.FORM : CONTENT.JSON,
  });

  if (_method === METHOD.GET) {
    _url = transformUrl(url, data);
    _data = null;
  }
  // data
  _data = _data
    ? norest
      ? queryString.stringify(_data)
      : JSON.stringify(_data)
    : null;

  return {
    url: _url,
    method: _method,
    data: _data,
    headers: _headers,
    norest,
    timeout,
    progress,
    onProgress,
  };
};
