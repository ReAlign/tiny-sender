import _ from 'lib/_';

const CONTENT = {
    FORM: 'application/x-www-form-urlencoded',
    JSON: 'application/json;charset=UTF-8',
    FORM_DATA: 'multipart/form-data'
};

const METHOD = {
    GET: 'GET',
    POST: 'POST',
    PUT: 'PUT',
    OPTION: 'OPTION',
    PATCH: 'PATCH'
};

const defaultHeaders = {
    'X-Requested-With': 'XMLHttpRequest'
};

const domain = 'm.kaola.com';

function transformUrl(url, data) {
    let urlParts = url.split('?');
    let queryObj = _.queryString.parse(urlParts[1]);
    queryObj = _.extend(queryObj, data);
    urlParts[1] = _.queryString.stringify(queryObj);
    return urlParts.filter(item => !!item).join('?');
}

function transformResponseData(xhr) {
    let data = xhr.response || xhr.responseText;
    if (typeof data === 'string') {
        try {
            data = JSON.parse(data);
        } catch (e) {/*eslint-disable-line*/}
    }
    return data;
}

function transformRequestData(data, headers) {
    if (data && CONTENT.FORM === headers['Content-Type']) {
        return _.queryString.stringify(data);
    } else if (data) {
        return JSON.stringify(data);
    }
    return null;
}

function createError(option) {
    const error = new Error(option.msg);
    return _.extend(error, option);
}

// 如果不是完整的url，补全域名
function resolveUrl(url) {
    const prefix = `https://${domain}`;
    if(/^(\/\/)+/.test(url)) return url;
    if(!/^https?/.test(url)) {
        if (url.indexOf('/') === 0) {
            return `${prefix}${url}`;
        }
        return `${prefix}/${url}`;
    }
    return url;
}

const ajax = function ajax(url, option = {}) {
    return new Promise((resolve, reject) => {
        url = resolveUrl(url);
        const method = (option.method || METHOD.GET).toUpperCase();
        const type = option.type === 'form' ? CONTENT.FORM : CONTENT.JSON;
        const timeout = option.timeout;
        let headers = _.extend(_.extend({}, defaultHeaders), option.headers);
        headers = _.extend(headers, {
            'Content-Type': type
        });
        const xhr = new XMLHttpRequest();
        let data = option.data;
        let params = option.params || {};

        if (method === METHOD.GET) {
            url = transformUrl(url, params);
        }

        xhr.open(method, url);
        xhr.withCredentials = true;

        for(let key in headers) {
            xhr.setRequestHeader(key, headers[key]);
        }

        xhr.timeout = timeout || 3000;
        xhr.ontimeout = function onTimeout() {
            reject(createError({
              msg: `request error: Time out!, request url: ${url}`,
              timeout: true
          }));
        };

        xhr.upload.onprogress = xhr.onprogress = function onProgress(...args) {
            option.onProgress && option.onProgress(...args);
        };

        xhr.onreadystatechange = function() {
            if (!xhr || xhr.readyState !== 4) {
                return;
            }

            const status = xhr.status;
            // credit: Axios
            // The request errored out and we didn't get a response, this will be
            // handled by onerror instead
            // With one exception: request that using file: protocol, most browsers
            // will return status as 0 even though it's a successful request
            if(status === 0) {
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

        xhr.onerror = function(e) {
            reject(createError({
                msg: `request error: ${e}, request url: ${url}`,
                status: 0
            }));
        };

        xhr.send(transformRequestData(data, headers));
    });
};

for(let method in METHOD) {
    ajax[method.toLowerCase()] = function(url, option = {}) {
        option.method = method;
        return ajax(url, option);
    };
}

export default ajax;
