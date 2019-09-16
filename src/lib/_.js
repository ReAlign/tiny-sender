const _ = {};

// 类型
_.typeOf = (o) => o === null ? String(o) : ({}).toString.call(o).slice(8, -1).toLowerCase();
// 复杂
_.isFunction = (o) => _.typeOf(o) === 'function';
_.isObject = (o) => _.typeOf(o) === 'object';
_.isArray = (o) => _.typeOf(o) === 'array';
_.isDate = (o) => _.typeOf(o) === 'date';
// 简单
_.isBoolean = (o) => _.typeOf(o) === 'boolean';
_.isString = (o) => _.typeOf(o) === 'string';
_.isNumber = (o) => _.typeOf(o) === 'number';
// false
_.isUndefined = (o) => _.typeOf(o) === 'undefined';
_.isNull = (o) => _.typeOf(o) === 'null';

_.extend = (o1 = {}, o2 = {}, override = false) => {
    for (let i in o2) {
        if (o2.hasOwnProperty(i)) {
            if (o1[i] === undefined || override) {
                o1[i] = o2[i];
            }
        }
    }
    return o1;
};

_.merge = (dest = null, src = null) => {
    const type1 = _.typeOf(dest);
    const type2 = _.typeOf(src);

    if (type1 !== type2) {
        return src;
    }
    switch (type2) {
        case 'object':
            for (const i in src) {
                if (src.hasOwnProperty(i)) {
                    dest[i] = _.merge(dest[i], src[i]);
                }
            }
            break;
        case 'array':
            src.forEach((item, i) => {
                dest[i] = _.merge(dest[i], item);
            });
            break;
        default:
            return src;
    }
    return dest;
};

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
_.object2String = (obj = {}, split = ',', encode = false) => {
    if (!obj) {
        return '';
    }
    let _arr = [];
    for (let _key in obj) {
        let _value = obj[_key];
        if (!obj.hasOwnProperty(_key)) {
            continue;
        }
        if (_.isFunction(_value)) {
            return '';
        }
        if (_.isDate(_value)) {
            _value = _value.getTime();
        } else if (_.isArray(_value)) {
            _value = _value.join(',');
        } else if (_.isObject(_value)) {
            _value = JSON.stringify(_value);
        }
        if (encode) {
            _value = encodeURIComponent(_value);
        }
        _arr.push(`${encodeURIComponent(_key)}=${_value}`);
    }
    return _arr.join(split || ',');
};

// 将 querystring 解析成对象
_.queryString = {
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
_.queryString.parse = (qStr = '') => {
    return (qStr || '').split('&').reduce((result, name) => {
        let arr = name.split('=');
        if (arr && arr.length > 0) {
            let key = arr.shift();
            if (key) {
                result[_.queryString.decode(key)] = _.queryString.decode(arr.join('='));
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
_.queryString.stringify = (paramObj = {}) => {
    return _.object2String(paramObj, '&', true);
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
_.queryString.get = (qStr = '', key = '') => {
    return this.parse(qStr)[key] || '';
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
_.queryString.set = (qStr = '', values = {}) => {
    const paramObj = this.parse(qStr);
    _.merge(paramObj, values);
    for (let key in paramObj) {
        if (paramObj[key] === undefined) {
            delete paramObj[key];
        }
    }
    return _.object2String(paramObj, '&', true);
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
_.queryString.remove = (qStr = '', key = '') => {
    const paramObj = this.parse(qStr);
    delete paramObj[key];
    return _.object2String(paramObj, '&', true);
};

export default _;