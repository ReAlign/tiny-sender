export function endWith(str: string, endStr: string) {
  const d = str.length - endStr.length;
  return (d >= 0 && str.lastIndexOf(endStr) === d);
}

// 类型
export function typeOf(o) {
  return ({}).toString.call(o).slice(8, -1).toLowerCase();
}
// 复杂
export function isFunction(o) { return endWith(typeOf(o), 'function'); }
export function isAsyncFunction(o) { return typeOf(o) === 'asyncfunction'; }
export function isObject(o) { return typeOf(o) === 'object'; }
export function isArray(o) { return typeOf(o) === 'array'; }
export function isDate(o) { return typeOf(o) === 'date'; }
// 简单
export function isBoolean(o) { return typeOf(o) === 'boolean'; }
export function isString(o) { return typeOf(o) === 'string'; }
export function isNumber(o) { return typeOf(o) === 'number'; }
// false
export function isUndefined(o) { return typeOf(o) === 'undefined'; }
export function isNull(o) { return typeOf(o) === 'null'; }

export function merge(dest = null, src = null) {
  const type1 = typeOf(dest);
  const type2 = typeOf(src);

  if (type1 !== type2) {
    return src;
  }
  switch (type2) {
    case 'object':
      for (const i in src) {
        // eslint-disable-next-line no-prototype-builtins
        if (src.hasOwnProperty(i)) {
          dest[i] = merge(dest[i], src[i]);
        }
      }
      break;
    case 'array':
      src.forEach((item, i) => {
        dest[i] = merge(dest[i], item);
      });
      break;
    default:
      return src;
  }
  return dest;
}

/**
 * 将对象转化为 string
 * @param {Object}  obj             - 目标对象
 * @param {string}  [split=',']     - 分割符
 *
 * @return {string}
 *
 * @example
 * object2String({
 *     a: 1,
 *     b: ['&=', 2, 3],
 *     x: {
 *         y: 1,
 *         z: {
 *             zz :0
 *         }
 *     },
 *     date: new Date()
 * });
 * // 'a=1,b=&=,2,3,x={"y":1,"z":{"zz":0}},date=1504769382260'
 *
 */
export function object2String(obj = {}, split = ',', encode = false) {
  if (!obj) {
    return '';
  }
  let _arr = [];
  for (let _key in obj) {
    let _value = obj[_key];
    // eslint-disable-next-line no-prototype-builtins
    if (!obj.hasOwnProperty(_key)) {
      continue;
    }
    if (isFunction(_value)) {
      return '';
    }
    if (isDate(_value)) {
      _value = _value.getTime();
    } else if (isArray(_value)) {
      _value = _value.join(',');
    } else if (isObject(_value)) {
      _value = JSON.stringify(_value);
    }
    if (encode) {
      _value = encodeURIComponent(_value);
    }
    _arr.push(`${encodeURIComponent(_key)}=${_value}`);
  }
  return _arr.join(split || ',');
}

// 将 querystring 解析成对象
export const queryString: any = {
  decode: decodeURIComponent,
};

/**
 * @constant {Object}  qs
 * @property {Function}  default.parse  - 将 query string 解析成对象
 * @property {Function}  default.get    - 获取 query string 中的字段值
 * @property {Function}  default.set    - 这只 query string 的某个字段
 * @property {Function}  default.remove - 移除 query string 中的某个字段
 *
 */
/**
 *
 * @param {string} qStr
 * @return {Object}
 *
 * @example
 * qs.parse('x=1&y=&&z&');      // { x: '1', y: '', z: '' }
 */
queryString.parse = (qStr = '') => {
  return (qStr || '').split('&').reduce((result, name) => {
    let arr = name.split('=');
    if (arr && arr.length > 0) {
      let key = arr.shift();
      if (key) {
        result[queryString.decode(key)] = queryString.decode(arr.join('='));
      }
    }
    return result;
  }, {});
};

/**
 * 将对象转化成 querystring
 * @param {Object} paramObj     - 转化对象
 * @return {string}
 *
 * @example
 * qs.stringify({x: 1, y: [2, 3]});     // 'x=1&y=2%2C3&z=%7B%22a%22%3A4%7D'
 */
queryString.stringify = (paramObj = {}) => {
  return object2String(paramObj, '&', true);
};
/**
 * 获取 querystring 中的某个字段
 * @param {string} querystring
 * @param {string} key          - 字段名
 * @return {string}
 *
 * @example
 * qs.get('x=1&y=&&z&', 'x');      // '1'
 */
queryString.get = (qStr = '', key = '') => {
  return queryString.parse(qStr)[key] || '';
};
/**
 * 修改 querystring 中的某个字段
 * @param {string} querystring
 * @param {Object} values          - 新增字段，字段为 null 或 undefined 时将删除对应字段
 * @return {string}
 *
 * @example
 * qs.set('x=1&y=&&z&', {
 *     a: '',
 *     x: 10,
 *     y: null,
 *     z: undefined
 * });      // 'x=10&y=null&a='
 */
queryString.set = (qStr = '', values = {}) => {
  const paramObj = queryString.parse(qStr);
  merge(paramObj, values);
  for (let key in paramObj) {
    if (paramObj[key] === undefined) {
      delete paramObj[key];
    }
  }
  return object2String(paramObj, '&', true);
};
/**
 * 删除 querystring 中的某个字段
 * @param {string} querystring
 * @param {string} key          - 字段名
 * @return {string}
 *
 * @example
 * qs.remove('x=1&y=&&z&', 'x');      // 'y=&z='
 */
queryString.remove = (qStr = '', key = '') => {
  const paramObj = queryString.parse(qStr);
  delete paramObj[key];
  return object2String(paramObj, '&', true);
};

// 全量 trim
export function deepTrim(obj = '') {
  const _bf = {
    perform2ObjectOrArray(obj = {}) {
      Object.keys(obj).forEach((k) => {
        const type = typeOf(obj[k]);

        if (type === 'object' || type === 'array') {
          deepTrim(obj[k]);
        } else if (type === 'string') {
          obj[k] = _bf.perform2String(obj[k]);
        }
      });
    },
    perform2String(str = '') {
      return str.trim();
    }
  };

  const type = typeOf(obj);

  if (type === 'object' || type === 'array') {
    _bf.perform2ObjectOrArray(obj);
  } else if (type === 'string') {
    obj = _bf.perform2String(obj);
  }

  return obj;
}
