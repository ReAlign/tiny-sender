import Result from '@/lib/result';  // 返回
import {
  loadingHandler,
  // successHandler,
  errorHandler,
} from '@/lib/handler';

export function before(request) {
  return request;
}

export function beforeError(error) {
  return Promise.reject(error);
}

export async function after(response, formatOptions, TS) {
  // const res = response.data || {};

  const code = Result.getCode(response, TS.codeKeys).code;

  // 全局非 200 报错
  if (code !== 200) {
    const msg = Result.getMsg(response, TS.msgKeys).msg;
    TS.notify.error(msg || TS.ERR_MSG_NOT_200);
  }

  return response;
}

export function afterError(error, formatOptions) {
  // 取消加载状态
  loadingHandler(formatOptions, false);

  return errorHandler(error);
}
