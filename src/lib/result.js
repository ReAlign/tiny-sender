import _ from 'lib/_';

const result = {};

result.CODE = ['code'];
result.MSG = ['msg'];
result.ERR_MSG_NOT_200 = '请求失败，（返回非 200）';
result.ERR_MSG_NO_RES = '请求失败，（无返回值）';

const _get = (type = '', res = {}, codeArr = []) => {
    const TYPE_MAP = {
        code: 'number',
        msg: 'string'
    };
    const KEY_MAP = {
        code: 'code',
        msg: 'msg'
    };
    const RES_MAP = {
        code: 'CODE',
        msg: 'MSG',
    };
    const obj = {};

    const v = _.typeOf(codeArr) === 'array' && codeArr.length;
    const ARR = v ? codeArr : result[RES_MAP[type]];

    let key = null;

    ARR.some(c => {
        const flag = res[c] && _.typeOf(res[c]) === TYPE_MAP[type];
        if(flag) {
            key = c;
        }

        return v;
    });

    obj.key = key;
    obj[KEY_MAP[type]] = res[key];

    return obj;
};

result.getCode = (res, arr) => _get('code', res, arr);
result.getMsg = (res, arr) => _get('msg', res, arr);

export default result;