import { typeOf } from '@/lib/_';
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

export function uuidMaker(date = new Date()) {
  const prefix = 'ts-xhr';
  const formatDate = date.toLocaleDateString().split('/').join('_');
  const random = Math.ceil(Math.random() * 1000);

  return `${prefix}-${formatDate}-${random}`;
}
