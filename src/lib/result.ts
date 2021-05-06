import { typeOf } from '@/lib/_';

const result = {
  CODE: ['code'],
  MSG: ['msg'],
};
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
  const obj: any = {};

  const v = typeOf(codeArr) === 'array' && codeArr.length;
  const ARR = v ? codeArr : result[RES_MAP[type]];

  let key = null;

  ARR.some(c => {
    const flag = res[c] && typeOf(res[c]) === TYPE_MAP[type];
    if (flag) {
      key = c;
    }

    return v;
  });

  obj.key = key;
  obj[KEY_MAP[type]] = res[key];

  return obj;
};

export const ERR_MSG_NOT_200 = '请求失败，（返回非 200）';
export const ERR_MSG_NO_RES = '请求失败，（无返回值）';

export const getCode = (res, arr) => _get('code', res, arr);
export const getMsg = (res, arr) => _get('msg', res, arr);
