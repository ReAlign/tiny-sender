// 类型定义
import {
  blockReqProps,
  blockResProps,
} from '@/index.d';

export async function before(o: blockReqProps) {
  const {
    options,
  } = o || {};
  return options;
}

export function beforeError(error) {
  return Promise.reject(error);
}

export async function after(o: blockResProps) {
  const {
    json,
  } = o || {};
  return json;
}

export function afterError(error) {
  return Promise.resolve(error);
}
